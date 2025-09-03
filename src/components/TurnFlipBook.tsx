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
        <div key={`text-${spreadNum}`} className="page p-4">
          <div className="h-full w-full flex items-center justify-center">
            <div className="prose prose-lg max-w-none">
              <p className="font-playful leading-relaxed text-foreground">{p.text}</p>
            </div>
          </div>
        </div>
      );
      out.push(
        <div key={`img-${spreadNum}`} className="page">
          <img src={p.illustration} alt="Story page" className="w-full h-full object-cover" />
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
    <div ref={wrapperRef} className={cn("relative mx-auto select-none touch-none", className)}>
      <div ref={bookRef} className="shadow-xl bg-background overflow-hidden">
        {flatPages}
      </div>
    </div>
  );
};

export default TurnFlipBook;


