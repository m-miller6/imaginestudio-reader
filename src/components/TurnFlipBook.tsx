import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface PageContent {
  text: string;
  illustration?: string;
  video?: string;
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
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // Build Turn.js pages - each story page becomes 2 Turn.js pages (text + video)
  const flatPages = useMemo(() => {
    const out: Array<JSX.Element> = [];
    
    pages.forEach((pageData, idx) => {
      const storyPageNum = idx + 1;
      
      // Text page (left side of spread)
      out.push(
        <div key={`text-${storyPageNum}`} className="page">
          <div className="page-content">
            <div className="page-text">
              <p className="text-3xl leading-relaxed font-serif tracking-wide">
                {pageData.text}
              </p>
            </div>
            <div className="page-number">
              {idx * 2 + 1}
            </div>
          </div>
        </div>
      );
      
      // Video/Illustration page (right side of spread) with text above
      out.push(
        <div key={`media-${storyPageNum}`} className="page">
          <div className="page-content flex flex-col">
            <div className="page-text mb-6">
              <p className="text-2xl leading-relaxed font-serif tracking-wide text-center">
                In a hush of midnight, a restless boy twists beneath his quilt.
              </p>
            </div>
            {pageData.video ? (
              <video 
                ref={(el) => {
                  if (el) {
                    videoRefs.current.set(storyPageNum, el);
                  } else {
                    videoRefs.current.delete(storyPageNum);
                  }
                }}
                src={pageData.video} 
                className="w-80 h-60 object-cover rounded-lg mx-auto" 
                loop 
                muted
                playsInline
                onLoadedData={() => {
                  const video = videoRefs.current.get(storyPageNum);
                  if (video && currentPage === storyPageNum) {
                    video.play().catch(console.error);
                  }
                }}
              />
            ) : pageData.illustration ? (
              <img 
                src={pageData.illustration} 
                alt="Story illustration" 
                className="w-80 h-60 object-cover rounded-lg mx-auto" 
              />
            ) : (
              <div className="w-80 h-60 flex items-center justify-center mx-auto">
                <div className="text-6xl">📖</div>
              </div>
            )}
            
            {pageData.video && (
              <div className="absolute top-6 right-6 bg-black/50 text-white p-3 rounded-full backdrop-blur-sm z-10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className="page-number">
              {idx * 2 + 2}
            </div>
          </div>
        </div>
      );
    });
    
    return out;
  }, [pages, currentPage]);

  // Initialize turn.js with proper book container structure
  useEffect(() => {
    const el = bookRef.current;
    
    if (!el || typeof window === "undefined") return;
    
    const initializeTurnJS = () => {
      if (typeof $ === "undefined" || typeof $.fn.turn === "undefined") {
        return false;
      }

      const $book = $(el);

      // Responsive sizing for book
      const sizeToWrapper = () => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        
        const containerWidth = wrapper.clientWidth;
        const maxWidth = Math.min(containerWidth * 0.9, 1000);
        const width = Math.max(600, maxWidth);
        const height = Math.round(width * 0.85); // Taller book aspect ratio
        
        try {
          if (typeof $book.turn === "function") {
            $book.turn("size", width, height);
          }
        } catch (error) {
          console.error("Error resizing turn.js book:", error);
        }
      };

      try {
        // Destroy any existing turn.js instance
        if (typeof $book.turn === "function" && $book.turn("is")) {
          $book.turn("destroy");
        }

        // Initialize turn.js
        $book.turn({
          display: "double",
          autoCenter: true,
          elevation: 50,
          gradients: true,
          duration: 600,
          page: (currentPage - 1) * 2 + 1,
          when: {
            turned: (_event: any, page: number) => {
              const spread = Math.ceil(page / 2);
              if (spread !== currentPage) {
                onPageChange(spread);
              }
            },
          },
        });

        sizeToWrapper();
        
        const handleResize = () => sizeToWrapper();
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          try {
            if (typeof $book.turn === "function" && $book.turn("is")) {
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

    // Poll for libraries if not available
    let attempts = 0;
    const maxAttempts = 50;
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
        console.error("Turn.js libraries failed to load");
      }
    };

    setTimeout(pollForLibraries, 100);

    return () => {
      if (cleanup2) {
        cleanup2();
      }
    };
  }, []);

  // Sync current page and handle video playback
  useEffect(() => {
    const el = bookRef.current;
    if (!el || typeof $ === "undefined" || typeof $.fn.turn === "undefined") return;
    
    const $book = $(el);
    
    try {
      if (typeof $book.turn === "function" && $book.turn("is")) {
        const targetPage = (currentPage - 1) * 2 + 1;
        const currentTurnPage = $book.turn("page");
        
        if (currentTurnPage !== targetPage) {
          $book.turn("page", targetPage);
        }
      }
    } catch (error) {
      console.error("Error changing turn.js page:", error);
    }

    // Handle video playback
    videoRefs.current.forEach((video, storyPageNum) => {
      if (storyPageNum === currentPage) {
        video.play().catch(console.error);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentPage]);

  return (
    <div ref={wrapperRef} className={cn("book-container", className)}>
      {/* Book spine */}
      <div className="book-spine"></div>
      
      {/* Turn.js book container with proper CSS classes */}
      <div ref={bookRef} className="book-pages">
        {flatPages}
      </div>
    </div>
  );
};

export default TurnFlipBook;