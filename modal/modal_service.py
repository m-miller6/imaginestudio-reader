import io
import base64
import os
from PIL import Image, ImageOps, ImageFilter
import modal

cuda_version = "12.8.1"
flavor = "devel"
operating_sys = "ubuntu24.04"
tag = f"{cuda_version}-{flavor}-{operating_sys}"
HF_CACHE_PATH = "/cache"

# ───────────────────────── SDXL + Adapters ───────────────────────── #
BASE_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"
INPAINT_MODEL = "diffusers/stable-diffusion-xl-1.0-inpainting-0.1"

LORAS = {
    "anime": "ntc-ai/SDXL-LoRA-slider.anime",
    "90s_anime": "ntc-ai/SDXL-LoRA-slider.90s-anime",
    "ghibli": "artificialguybr/StudioGhibli.Redmond-V2",
    "watercolor": "ostris/watercolor_style_lora_sdxl",
    "pixar": "ntc-ai/SDXL-LoRA-slider.pixar-style",
}

SAFETY_REPO = "CompVis/stable-diffusion-safety-checker"

# IP-Adapter (SDXL) weights
IPADAPTER_REPO = "h94/IP-Adapter"
IPADAPTER_SUBFOLDER = "sdxl_models"

# ───────────────────────── Modal Image ───────────────────────── #
base_image = (
    modal.Image.from_registry(f"nvidia/cuda:{tag}", add_python="3.11")
    .entrypoint([])
)

image = (
    base_image
    .apt_install(
        "git",
        "libglib2.0-0",
        "libsm6",
        "libxrender1",
        "libxext6",
        "ffmpeg",
        "libgl1",
    )
    .pip_install(
        "fastapi[standard]",
        "torch==2.5.0",
        "diffusers==0.30.0",
        "safetensors==0.4.4",
        "Pillow",
        "transformers==4.44.0",
        "accelerate==0.33.0",
        "numpy<2",
        "peft",
        "huggingface_hub[hf_transfer]==0.26.2",
    )
    .env({
        "HF_HUB_ENABLE_HF_TRANSFER": "1",
        "HF_HUB_CACHE": HF_CACHE_PATH,
        "HF_HOME": f"{HF_CACHE_PATH}/hub",
    })
)

app = modal.App("sdxl-lora-api", image=image)

# ───────────────────────── Helpers ───────────────────────── #
with image.imports():
    import os
    from pathlib import Path
    import torch
    import numpy as np
    from diffusers import (
        StableDiffusionXLPipeline,
        StableDiffusionXLImg2ImgPipeline,
        StableDiffusionXLInpaintPipeline,
        DPMSolverMultistepScheduler,
    )
    from diffusers.pipelines.stable_diffusion.safety_checker import StableDiffusionSafetyChecker
    from transformers import AutoImageProcessor
    from transformers.utils import move_cache

def _png_bytes_to_b64(data: bytes) -> str:
    return "data:image/png;base64," + base64.b64encode(data).decode("utf-8")

def _decode_data_url_b64(data_url_or_b64: str) -> bytes:
    s = data_url_or_b64
    if isinstance(s, str) and s.startswith("data:"):
        s = s.split(",", 1)[1]
    return base64.b64decode(s)

def _pil_to_png_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def _prepare_ref_image(ref: Image.Image, target_size: int = 512) -> Image.Image:
    """
    Normalize the reference image for IP-Adapter:
      - Convert to RGB
      - Center-crop to square
      - Resize to fixed size (default 512x512)
    """
    ref = ref.convert("RGB")
    ref = ImageOps.fit(
        ref,
        (target_size, target_size),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.42)
    )
    return ref

# ───────────────────────── Worker Class ───────────────────────── #
@app.cls(
    gpu="A100",
    volumes={HF_CACHE_PATH: modal.Volume.from_name("hf-cache", create_if_missing=True)},
    scaledown_window=300,
)
class SDXLLoRAHost:
    @modal.enter()
    def setup(self):
        torch.backends.cuda.matmul.allow_tf32 = True
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        # Prefer fp16 on CUDA for SDXL; fall back to fp32 on CPU
        self.dtype = torch.float16 if self.device == "cuda" else torch.float32
        # IP-Adapter (reference image guidance) for SDXL Inpaint: will be attached once after creating inpaint pipe

        # Run HF cache migration once (non-fatal if it fails)
        try:
            if not os.path.exists("/cache/.hf_migrated"):
                move_cache()
                Path("/cache/.hf_migrated").touch()
        except Exception:
            pass

        # Pipelines
        self.t2i = StableDiffusionXLPipeline.from_pretrained(
            BASE_MODEL, torch_dtype=self.dtype, cache_dir=HF_CACHE_PATH
        ).to(self.device)

        self.i2i = StableDiffusionXLImg2ImgPipeline.from_pretrained(
            BASE_MODEL, torch_dtype=self.dtype, cache_dir=HF_CACHE_PATH
        ).to(self.device)

        # Create inpaint pipeline BEFORE using it
        self.inpaint = StableDiffusionXLInpaintPipeline.from_pretrained(
            INPAINT_MODEL, torch_dtype=self.dtype, cache_dir=HF_CACHE_PATH
        ).to(self.device)

        # One-time IP-Adapter attach; pick ONE and never swap.
        self.inpaint.load_ip_adapter(
            IPADAPTER_REPO,
            subfolder=IPADAPTER_SUBFOLDER,
            weight_name="ip-adapter_sdxl.safetensors",
        )
        try:
            self.inpaint.set_ip_adapter_scale(0.85)
        except Exception:
            pass

        for p in (self.t2i, self.i2i, self.inpaint):
            #p.set_progress_bar_config(disable=True) #optional silence progress to save a few ms
            p.scheduler = DPMSolverMultistepScheduler.from_config(p.scheduler.config)
            p.enable_vae_slicing()
            p.enable_vae_tiling()
            if self.device != "cuda":
                p.enable_model_cpu_offload()

        # Start with LoRA disabled
        self.t2i.disable_lora()
        self.i2i.disable_lora()
        self.inpaint.disable_lora()
        self.active_adapter = "none"
        self.t2i.lora_fused = False
        self.i2i.lora_fused = False
        self.inpaint.lora_fused = False

        # Safety tooling (Transformers 4.44+)
        self.safety_checker = StableDiffusionSafetyChecker.from_pretrained(
            SAFETY_REPO, cache_dir=HF_CACHE_PATH
        ).to(self.device)
        self.image_processor = AutoImageProcessor.from_pretrained(
            SAFETY_REPO, cache_dir=HF_CACHE_PATH
        )

        # ─────────────── Minimal warmup to keep init fast ─────────────── #
        try:
            _ = self.t2i(
                prompt="warmup",
                width=64,
                height=64,
                num_inference_steps=2,
                guidance_scale=1.0,
                output_type="pil",
            ).images[0]
        except Exception as e:
            print("Warmup t2i failed:", e)

    

    # ─────────────── LoRA adapter switching ─────────────── #

    def _set_adapter(self, adapter: str, scale: float = 1.0):
        adapter = (adapter or "none").lower()

        if adapter in ("none", "off", "disable"):
            for p in (self.t2i, self.i2i, self.inpaint):
                try:
                    p.disable_lora()
                except Exception:
                    pass
            self.active_adapter = "none"
            return

        if adapter not in LORAS:
            raise ValueError(f"Unknown adapter '{adapter}'. Choose one of: {', '.join(list(LORAS.keys()) + ['none'])}")

        repo = LORAS[adapter]
        for p in (self.t2i, self.i2i, self.inpaint):
            try:
                known = getattr(p, "_known_adapters", set())
                if adapter not in known:
                    p.load_lora_weights(repo, adapter_name=adapter, use_peft_backend=False)
                    known.add(adapter)
                    setattr(p, "_known_adapters", known)
                # Do NOT fuse on inpaint; just set adapter weights
                p.set_adapters(adapter, adapter_weights=[float(scale)])
            except Exception:
                pass

        self.active_adapter = adapter

    # ─────────────── Text → Image ─────────────── #
    @modal.method()
    def generate_t2i(
        self,
        prompt: str,
        width: int = 1024,
        height: int = 1024,
        steps: int = 30,
        guidance_scale: float = 4.5,
        seed=None,
        adapter: str = "none",
        negative_prompt: str | None = None,
    ) -> bytes:
        if not prompt:
            raise ValueError("Missing 'prompt'.")
        self._set_adapter(adapter)

        g = None
        if seed is not None:
            g = torch.Generator(device=self.device).manual_seed(int(seed))

        with torch.inference_mode():
            image = self.t2i(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=int(width),
            height=int(height),
            num_inference_steps=int(steps),
            guidance_scale=float(guidance_scale),
            generator=g,
            output_type="pil",
        ).images[0]
        return _pil_to_png_bytes(image)

    # ─────────────── Image → Image ─────────────── #
    @modal.method()
    def generate_i2i(
        self,
        prompt: str,
        image_bytes: bytes,
        strength: float = 0.35,                 # lower = preserve more of the init
        steps: int = 32,                        # a bit more steps for i2i
        guidance_scale: float = 6.5,            # SDXL i2i tends to like 5.5–7.5
        seed=None,
        out_size: int = 1024,
        adapter: str = "none",
        negative_prompt: str | None = "low quality, blurry, jpeg artifacts, extra fingers, extra limbs",
        # Advanced (optional) knobs:
        adapter_scale: float = 1.0,             # LoRA strength per-request
        use_freeu: bool = True,                 # sharper textures, tiny overhead
        guidance_rescale: float | None = 0.7,   # mitigates CFG artifacts
        noise_offset: float | None = 0.02,      # combats desaturation/washed look
        keep_aspect: bool = True,               # avoid squashing
    ):
        import io
        from PIL import Image, ImageOps
    
        if not prompt:
            raise ValueError("Missing 'prompt'.")
        if not image_bytes:
            raise ValueError("Missing 'image'.")
    
        # single adapter, adjustable scale
        self._set_adapter(adapter, scale=float(adapter_scale))
    
        # --- preprocess init image safely ---
        init = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        if out_size:
            size = int(out_size)
            if keep_aspect:
                # center-crop to square, then resize → no distortion
                init = ImageOps.fit(init, (size, size), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            else:
                init = init.resize((size, size), Image.Resampling.LANCZOS)
    
        # --- scheduler: DPM++ 2M with Karras sigmas for i2i smoothness ---
        try:
            cfg = self.i2i.scheduler.config
            if getattr(cfg, "use_karras_sigmas", False) is False:
                cfg.use_karras_sigmas = True
            # re-init scheduler from config to apply flag
            from diffusers import DPMSolverMultistepScheduler
            self.i2i.scheduler = DPMSolverMultistepScheduler.from_config(cfg)
        except Exception:
            pass  # safe fallback to existing scheduler
        
        # FreeU can add crispness to textures with small cost
        if use_freeu and hasattr(self.i2i, "enable_freeu"):
            try:
                # Common SDXL-ish FreeU settings; adjust if too sharp
                self.i2i.enable_freeu(s1=0.9, s2=0.2, b1=1.2, b2=1.4)
            except Exception:
                pass
            
        # RNG
        g = None
        if seed is not None:
            g = torch.Generator(device=self.device).manual_seed(int(seed))
    
        # --- run ---
        kwargs = dict(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=init,
            strength=float(strength),
            num_inference_steps=int(steps),
            guidance_scale=float(guidance_scale),
            generator=g,
            output_type="pil",
        )
        if guidance_rescale is not None:
            kwargs["guidance_rescale"] = float(guidance_rescale)
        if noise_offset is not None:
            kwargs["noise_offset"] = float(noise_offset)
    
        if not hasattr(self, "_i2i_warm"):
            try:
                from PIL import Image as _PILImage
                _dummy = _PILImage.new("RGB", (64, 64), color=(128, 128, 128))
                _ = self.i2i(prompt="warmup", image=_dummy, strength=0.1, num_inference_steps=2, output_type="pil")
            except Exception:
                pass
            self._i2i_warm = True

        with torch.inference_mode():
            result = self.i2i(**kwargs)
        out_img = result.images[0]
    
        # Safety (unchanged)
        np_img = np.array(out_img).astype(np.float32) / 255.0
        clip_in = self.image_processor(images=[out_img], return_tensors="pt")
        pixel_values = clip_in["pixel_values"].to(self.device)
        _checked_images, has_nsfw_concepts = self.safety_checker(
            images=np_img[None, ...], clip_input=pixel_values
        )
        safety = {
            "flagged": bool(has_nsfw_concepts[0]),
            "explanation": "Heuristic safety signal from StableDiffusionSafetyChecker; may over/under-flag.",
        }
    
        # Reset FreeU to avoid surprising other calls that don't want it
        if use_freeu and hasattr(self.i2i, "disable_freeu"):
            try:
                self.i2i.disable_freeu()
            except Exception:
                pass
            
        return _pil_to_png_bytes(out_img), safety

    # ─────────────── Inpaint (reference-guided via IP-Adapter) ─────────────── #
    @modal.method()
    def generate_inpaint_ref(
        self,
        prompt: str,
        bg_image_bytes: bytes,
        mask_bytes: bytes,
        ref_image_bytes: bytes,
        # Keep a tiny set of knobs; defaults chosen for stability on SDXL:
        steps: int = 28,
        guidance_scale: float = 5,
        seed=None,
        out_size: int = 1024,
        adapter: str = "none",
        adapter_scale: float = 0.9,
        negative_prompt: str | None = None,
    ):
        """
        Simple: Put the character (from ref_image) into the masked hole of the background.
        Assumptions:
          - IP-Adapter is already loaded once in setup (e.g., 'plus-face') and never swapped.
          - Style == LoRA adapter (story-level), applied once per call.
          - White = inpaint region, Black = keep.
          - Output is forced to 'out_size' longest side to match story canvas.
        """
        import io
        from PIL import Image, ImageOps
        import numpy as np
        import torch
    
        if not prompt:
            raise ValueError("Missing 'prompt'.")
        if not bg_image_bytes or not mask_bytes or not ref_image_bytes:
            raise ValueError("Missing 'image', 'mask', or 'ref_image'.")
    
        # 1) Decode inputs
        bg = Image.open(io.BytesIO(bg_image_bytes)).convert("RGB")
        mask = Image.open(io.BytesIO(mask_bytes)).convert("L")
        ref = Image.open(io.BytesIO(ref_image_bytes)).convert("RGB")
        # Normalize ref to 512x512 center-cropped square for IP-Adapter
        ref = _prepare_ref_image(ref, target_size=512)
    
        # 2) Force deterministic canvas size (match your story template)
        if out_size and int(out_size) > 0:
            out_size = int(out_size)
            w, h = bg.size
            scale = out_size / float(max(w, h))
            if scale != 1.0:
                bg = bg.resize((max(1, int(round(w * scale))), max(1, int(round(h * scale)))), Image.Resampling.LANCZOS)
    
        if mask.size != bg.size:
            mask = mask.resize(bg.size, Image.Resampling.LANCZOS)
    
        # Binarize mask (sane contract: white=inpaint, black=keep)
        mask = mask.point(lambda p: 255 if p > 127 else 0)
        # Light edge treatment to avoid halos at seams
        mask = mask.filter(ImageFilter.MaxFilter(3))      # slight dilation
        mask = mask.filter(ImageFilter.GaussianBlur(1.2)) # feather
    
        # 3) Style (LoRA) — single call, no fuse/unfuse or unload/reload
        self._set_adapter(adapter, scale=float(adapter_scale))
    
        # 4) Seed locking
        g = None
        if seed is not None:
            g = torch.Generator(device=self.device).manual_seed(int(seed))
    
        # 5) Run inpaint — fixed recipe, no IP-Adapter hot swapping, no extra tricks
        # style (LoRA) already set above; do NOT fuse/unfuse on inpaint
        # Negative prompt fallback to reduce common artifacts if none provided
        if negative_prompt is None:
            negative_prompt = (
                "extra limbs, extra fingers, deformed face, asymmetry, "
                "mustache, beard, text, watermark, low quality, blurry"
            )

        with torch.inference_mode():
            result = self.inpaint(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=bg,
            mask_image=mask,
            ip_adapter_image=ref,   # that’s it — no embed prep
            num_inference_steps=int(steps),
            guidance_scale=float(guidance_scale),
            generator=g,
            output_type="pil",
        )
    
        out_img = result.images[0]
    
        # 6) Safety
        np_img = np.array(out_img).astype(np.float32) / 255.0
        clip_in = self.image_processor(images=[out_img], return_tensors="pt")
        pixel_values = clip_in["pixel_values"].to(self.device)
        _checked_images, has_nsfw_concepts = self.safety_checker(
            images=np_img[None, ...], clip_input=pixel_values
        )
        safety = {"flagged": bool(has_nsfw_concepts[0])}
    
        return _pil_to_png_bytes(out_img), safety

# ───────────────────────── FastAPI Endpoints ───────────────────────── #
@app.function()
@modal.fastapi_endpoint(method="POST")
def t2i(request: dict):
    prompt = request.get("prompt")
    if not prompt:
        return {"error": "Missing 'prompt'."}, 400

    width = int(request.get("width", 1024))
    height = int(request.get("height", 1024))
    steps = int(request.get("steps", 30))
    guidance_scale = float(request.get("guidance_scale", 5.5))
    negative_prompt = request.get("negative_prompt")
    seed = request.get("seed")
    seed = int(seed) if seed is not None else None
    adapter = request.get("adapter", "none")

    png = SDXLLoRAHost().generate_t2i.remote(
        prompt=prompt,
        width=width,
        height=height,
        steps=steps,
        guidance_scale=guidance_scale,
        seed=seed,
        adapter=adapter,
        negative_prompt=negative_prompt,
    )
    return {"image": _png_bytes_to_b64(png)}

@app.function()
@modal.fastapi_endpoint(method="POST")
def i2i(request: dict):
    prompt = request.get("prompt")
    b64 = request.get("image")
    if not prompt or not b64:
        return {"error": "Missing 'prompt' or 'image'."}, 400

    try:
        img_bytes = _decode_data_url_b64(b64)
    except Exception:
        return {"error": "Invalid base64 in 'image'."}, 400

    strength = float(request.get("strength", 0.35))
    steps = int(request.get("steps", 32))
    guidance_scale = float(request.get("guidance_scale", 6.5))
    negative_prompt = request.get("negative_prompt")
    seed = request.get("seed"); seed = int(seed) if seed is not None else None
    out_size = int(request.get("out_size", 1024))
    adapter = request.get("adapter", "none")
    # NEW: pass-through for the quality knobs
    adapter_scale = float(request.get("adapter_scale", 1.0))
    guidance_rescale = request.get("guidance_rescale")
    guidance_rescale = float(guidance_rescale) if guidance_rescale is not None else None
    noise_offset = request.get("noise_offset")
    noise_offset = float(noise_offset) if noise_offset is not None else None
    keep_aspect = bool(request.get("keep_aspect", True))

    png, safety = SDXLLoRAHost().generate_i2i.remote(
        prompt=prompt,
        image_bytes=img_bytes,
        strength=strength,
        steps=steps,
        guidance_scale=guidance_scale,
        seed=seed,
        out_size=out_size,
        adapter=adapter,
        negative_prompt=negative_prompt,
        adapter_scale=adapter_scale,
        guidance_rescale=guidance_rescale,
        noise_offset=noise_offset,
        keep_aspect=keep_aspect,
    )
    return {"image": _png_bytes_to_b64(png), "safety": safety}

@app.function()
@modal.fastapi_endpoint(method="POST")
def inpaint(request: dict):
    # required
    prompt   = request.get("prompt")
    img_b64  = request.get("image")       # background image
    mask_b64 = request.get("mask")        # white=inpaint, black=keep
    ref_b64  = request.get("ref_image")   # selfie/character reference
    if not prompt or not img_b64 or not mask_b64 or not ref_b64:
        return {"error": "Missing 'prompt', 'image', 'mask', or 'ref_image'."}, 400

    try:
        bg_bytes   = _decode_data_url_b64(img_b64)
        mask_bytes = _decode_data_url_b64(mask_b64)
        ref_bytes  = _decode_data_url_b64(ref_b64)
    except Exception:
        return {"error": "Invalid base64 in one of: 'image', 'mask', 'ref_image'."}, 400

    # minimal knobs (everything else is fixed by the service)
    seed    = request.get("seed"); seed = int(seed) if seed is not None else None

    png, safety = SDXLLoRAHost().generate_inpaint_ref.remote(
        prompt=prompt,
        bg_image_bytes=bg_bytes,
        mask_bytes=mask_bytes,
        ref_image_bytes=ref_bytes,
        steps=int(request.get("steps", 28)), #hardcode later, check request for now
        guidance_scale=float(request.get("guidance_scale", 5)), #hardcode later, check request for now
        seed=seed,
        out_size=int(request.get("out_size", 1024)),
        adapter = request.get("adapter", "none"),
        adapter_scale=float(request.get("adapter_scale", 0.9)),
        negative_prompt=request.get("negative_prompt"),
    )
    return {"image": _png_bytes_to_b64(png), "safety": safety}