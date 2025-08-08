import io
from typing import Optional
from PIL import Image
import modal
from fastapi import Form, File, UploadFile
from fastapi.responses import Response, JSONResponse

# Concrete LoRA adapters
STYLE_PRESETS = {
    "general": {
        "lora_id": "lks2025/lks",
        "trigger": "lks"
    },
    "modern-anime": {
        "lora_id": "alfredplpl/flux.1-dev-modern-anime-lora",
        "trigger": "modern anime style"
    },
    "turbo": {
        "lora_id": "alimama-creative/FLUX.1-Turbo-Alpha",
        "trigger": ""  # no special phrase needed
    },
    "pixar": {
        "lora_id": "francsharma/pixar2",
        "trigger": "pixar style"
    }
}

image = modal.Image.debian_slim(python_version="3.11").pip_install(
    "fastapi[standard]", "torch", "diffusers", "safetensors", "Pillow"
)

app = modal.App("flux-lora-service", image=image)

with image.imports():
    import torch
    from diffusers import (
        FluxPipeline, StableDiffusionImg2ImgPipeline, StableDiffusionInpaintingPipeline
    )

def load_pipelines():
    base = "black-forest-labs/FLUX.1-dev"
    t2i = FluxPipeline.from_pretrained(base, torch_dtype=torch.bfloat16)
    i2i = StableDiffusionImg2ImgPipeline.from_pretrained(base, torch_dtype=torch.bfloat16)
    ip = StableDiffusionInpaintingPipeline.from_pretrained(base, torch_dtype=torch.bfloat16)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    return t2i.to(device), i2i.to(device), ip.to(device), device

def apply_lora(pipe, style_id):
    lora = STYLE_PRESETS[style_id]["lora_id"]
    pipe.load_lora_weights(lora)
    return pipe

def png_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO(); img.save(buf, format="PNG"); return buf.getvalue()

@app.cls(gpu="A100")
class Service:
    def __enter__(self):
        self.t2i, self.i2i, self.ip, self.device = load_pipelines()

    @modal.method()
    def prompt2img(self, prompt: str, style_id: str, seed: Optional[int]):
        pipe = apply_lora(self.t2i, style_id)
        gen = torch.Generator(device=self.device).manual_seed(seed or 1234)
        text = f"{STYLE_PRESETS[style_id]['trigger']}, {prompt}" if STYLE_PRESETS[style_id]['trigger'] else prompt
        img = pipe(prompt=text, generator=gen).images[0]
        return png_bytes(img)

    @modal.method()
    def img2img_character(self, image_bytes: bytes, style_id: str, seed: Optional[int]):
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((512, 512))
        pipe = apply_lora(self.i2i, style_id)
        gen = torch.Generator(device=self.device).manual_seed(seed or 1234)
        text = STYLE_PRESETS[style_id]['trigger']
        out = pipe(prompt=text, image=img, generator=gen).images[0]
        return png_bytes(out)

    @modal.method()
    def inpaint_character(self, bg_bytes, mask_bytes, char_bytes, style_id: str, seed: Optional[int]):
        bg = Image.open(io.BytesIO(bg_bytes)).convert("RGB")
        mask = Image.open(io.BytesIO(mask_bytes)).convert("L")
        char = Image.open(io.BytesIO(char_bytes)).convert("RGBA").resize(bg.size)
        comp = bg.copy(); comp.paste(char.convert("RGB"), (0, 0), char)
        pipe = apply_lora(self.ip, style_id)
        gen = torch.Generator(device=self.device).manual_seed(seed or 1234)
        text = STYLE_PRESETS[style_id]['trigger']
        out = pipe(image=comp, mask_image=mask, prompt=text, generator=gen).images[0]
        return png_bytes(out)

@app.function()
@modal.fastapi_endpoint(method="POST")
async def prompt2img(prompt: str = Form(...), style_id: str = Form(...), seed: Optional[int] = Form(None)):
    if style_id not in STYLE_PRESETS:
        return JSONResponse({"error": "invalid style_id"}, status_code=400)
    svc = Service()
    png = await svc.prompt2img.remote.aio(prompt, style_id, seed)
    return Response(content=png, media_type="image/png")

@app.function()
@modal.fastapi_endpoint(method="POST")
async def img2img_character(
    image: UploadFile = File(...),
    style_id: str = Form(...),
    seed: Optional[int] = Form(None)
):
    data = await image.read()
    if style_id not in STYLE_PRESETS:
        return JSONResponse({"error": "invalid style_id"}, status_code=400)
    svc = Service()
    png = await svc.img2img_character.remote.aio(data, style_id, seed)
    return Response(content=png, media_type="image/png")

@app.function()
@modal.fastapi_endpoint(method="POST")
async def inpaint_character(
    background: UploadFile = File(...),
    mask: UploadFile = File(...),
    character: UploadFile = File(...),
    style_id: str = Form(...),
    seed: Optional[int] = Form(None)
):
    if style_id not in STYLE_PRESETS:
        return JSONResponse({"error": "invalid style_id"}, status_code=400)
    svc = Service()
    png = await svc.inpaint_character.remote.aio(
        await background.read(),
        await mask.read(),
        await character.read(),
        style_id, seed
    )
    return Response(content=png, media_type="image/png")
