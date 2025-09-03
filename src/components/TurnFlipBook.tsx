import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface PageContent {
  text: string;
  illustration: string;
}

interface TurnFlipBookProps {
  pages: PageContent[];
  currentPage: number; // spread index (1-based)
  onPageChange: (page: number) => void; // spread index (1-based)
  className?: string;
}

export const TurnFlipBook = ({ pages, currentPage, onPageChange, className }: TurnFlipBookProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  // Build individual pages: for each spread, generate 2 pages (left text, right image)
  const flatPages = useMemo(() => {
    const out: Array<JSX.Element> = [];
    pages.forEach((p, idx) => {
      const spreadNum = idx + 1;
      out.push(
        <div key={`text-${spreadNum}`} className="page p-6 bg-gradient-to-br from-cream-50 to-amber-50 border-r border-amber-200/50">
          <div className="h-full w-full flex items-center justify-center relative">
            {/* Page texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhaW4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMC41IiBmaWxsPSJyZ2JhKDIwMCwxODAsMTQwLDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhaW4pIi8+PC9zdmc+')] opacity-30"></div>
            <div className="prose prose-lg max-w-none relative z-10">
              <p className="font-playful leading-relaxed text-amber-900 drop-shadow-sm">{p.text}</p>
            </div>
            {/* Page number */}
            <div className="absolute bottom-4 right-4 text-xs text-amber-700 font-medium">{spreadNum * 2 - 1}</div>
          </div>
        </div>
      );
      out.push(
        <div key={`img-${spreadNum}`} className="page bg-gradient-to-br from-cream-50 to-amber-50 border-l border-amber-200/50 relative">
          <img src={p.illustration} alt="Story page" className="w-full h-full object-cover rounded-sm" />
          {/* Page number */}
          <div className="absolute bottom-4 left-4 text-xs text-amber-700 font-medium bg-white/80 px-2 py-1 rounded">{spreadNum * 2}</div>
          {/* Image border shadow */}
          <div className="absolute inset-0 shadow-inner rounded-sm pointer-events-none"></div>
        </div>
      );
    });
    return out;
  }, [pages]);

  // Initialize turn.js
  useEffect(() => {
    const el = bookRef.current;
    
    // Check if element exists
    if (!el || typeof window === "undefined") return;
    
    const initializeTurnJS = () => {
      // Check if jQuery and turn.js are available
      if (typeof $ === "undefined" || typeof $.fn.turn === "undefined") {
        return false;
      }

      const $book = $(el);

      // Helper: responsive sizing
      const sizeToWrapper = () => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const maxWidth = Math.min(wrapper.clientWidth, 1100);
        const width = Math.max(480, maxWidth);
        const height = Math.round(width * 0.68); // pleasant aspect
        try {
          if (typeof $book.turn === "function") {
            $book.turn("size", width, height);
          }
        } catch (error) {
          console.error("Error resizing turn.js book:", error);
        }
      };

      try {
        // Initialize plugin
        $book.turn({
          display: "double",
          autoCenter: true,
          elevation: 50,
          gradients: true,
          duration: 800,
          page: (currentPage - 1) * 2 + 1,
          when: {
            turned: (_e: any, page: number) => {
              const spread = Math.ceil(page / 2);
              if (spread !== currentPage) onPageChange(spread);
            },
          },
        });

        sizeToWrapper();
        const onResize = () => sizeToWrapper();
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          try {
            if (typeof $book.turn === "function") {
              $book.turn("destroy");
            }
          } catch (error) {
            console.error("Error destroying turn.js book:", error);
          }
        };
      } catch (error) {
        console.error("Error initializing turn.js book:", error);
        return false;
      }
    };

    // Try to initialize immediately
    const cleanup = initializeTurnJS();
    if (cleanup) {
      return cleanup;
    }

    // If not ready, poll for libraries to be available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    let cleanup2: (() => void) | undefined;

    const pollForLibraries = () => {
      attempts++;
      const result = initializeTurnJS();
      
      if (result) {
        cleanup2 = result;
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(pollForLibraries, 100);
      } else {
        console.error("Turn.js libraries failed to load within timeout");
      }
    };

    setTimeout(pollForLibraries, 100);

    return () => {
      if (cleanup2) {
        cleanup2();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep plugin page in sync when prop changes
  useEffect(() => {
    const el = bookRef.current;
    if (!el || typeof $ === "undefined" || typeof $.fn.turn === "undefined") return;
    
    const $book = $(el);
    try {
      if (typeof $book.turn === "function") {
        const target = (currentPage - 1) * 2 + 1;
        const cur = $book.turn("page");
        if (cur !== target) $book.turn("page", target);
      }
    } catch (error) {
      console.error("Error changing turn.js page:", error);
    }
  }, [currentPage]);

  return (
    <div ref={wrapperRef} className={cn("relative mx-auto select-none touch-none perspective-[2000px]", className)}>
      {/* Book Container with Spine */}
      <div className="relative">
        {/* Book Spine */}
        <div className="absolute left-1/2 top-0 w-8 h-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 transform -translate-x-1/2 rounded-l-sm shadow-lg z-10">
          <div className="absolute inset-y-0 left-1 w-px bg-amber-900 opacity-60"></div>
          <div className="absolute inset-y-0 right-1 w-px bg-amber-500 opacity-40"></div>
        </div>
        
        {/* Book Pages Container */}
        <div ref={bookRef} className="relative bg-white shadow-2xl rounded-r-sm overflow-hidden book-pages">
          {flatPages.map((page, index) => (
            <div key={index} className="page-wrapper">
              <div className={cn(
                "page-content bg-gradient-to-br from-amber-50 to-cream-100 border-r border-amber-200",
                index % 2 === 0 ? "border-l-0" : "border-l border-amber-300"
              )}>
                {page}
              </div>
              {/* Page Shadow */}
              <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        {/* Book Base Shadow */}
        <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/20 blur-sm rounded-full"></div>
      </div>
    </div>
  );
};

export default TurnFlipBook;


