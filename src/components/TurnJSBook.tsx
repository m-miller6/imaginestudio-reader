import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface PageContent {
  text: string;
  illustration: string;
}

interface TurnJSBookProps {
  pages: PageContent[];
  currentPage: number; // 1-based index
  onPageChange: (page: number) => void; // 1-based index
  className?: string;
}

const TurnJSBook = ({ pages, currentPage, onPageChange, className }: TurnJSBookProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initialize Turn.js
  useEffect(() => {
    const $: any = (window as any).jQuery || (window as any).$;
    if (!bookRef.current || !$ || !$.fn?.turn) return;

    const getSize = () => {
      const containerWidth = containerRef.current?.clientWidth || 640;
      const isSingle = containerWidth < 768;
      // Keep a pleasant aspect ratio for readability
      const height = Math.min(Math.round(containerWidth * 0.66), Math.max(360, window.innerHeight - 240));
      return { width: containerWidth, height, isSingle };
    };

    const { width, height, isSingle } = getSize();

    const options: any = {
      width,
      height,
      autoCenter: true,
      gradients: true,
      elevation: 50,
      duration: 800,
      page: Math.min(currentPage, pages.length),
      display: isSingle ? "single" : "double",
      when: {
        turned: (_e: any, page: number) => {
          onPageChange(page);
        },
      },
    };

    const $book = $(bookRef.current);
    try {
      $book.turn(options);
      initializedRef.current = true;
    } catch (e) {
      console.warn("Turn.js failed to initialize", e);
    }

    return () => {
      try {
        if (initializedRef.current) {
          $book.turn("destroy");
        }
      } catch {
        // ignore
      } finally {
        initializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length]);

  // Keep Turn.js in sync with currentPage from parent
  useEffect(() => {
    const $: any = (window as any).jQuery || (window as any).$;
    if (!initializedRef.current || !bookRef.current || !$) return;
    const $book = $(bookRef.current);
    try {
      const cur = $book.turn("page");
      if (cur !== currentPage) {
        $book.turn("page", currentPage);
      }
    } catch {
      // ignore runtime issues
    }
  }, [currentPage]);

  // Handle responsive sizing
  useLayoutEffect(() => {
    const $: any = (window as any).jQuery || (window as any).$;
    const onResize = () => {
      if (!initializedRef.current || !bookRef.current || !$) return;
      const containerWidth = containerRef.current?.clientWidth || 640;
      const isSingle = containerWidth < 768;
      const height = Math.min(Math.round(containerWidth * 0.66), Math.max(360, window.innerHeight - 240));
      const $book = $(bookRef.current);
      try {
        $book.turn("display", isSingle ? "single" : "double");
        $book.turn("size", containerWidth, height);
      } catch {
        // ignore
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className={cn("w-full", className)} aria-label="Interactive story book">
      <div ref={containerRef} className="w-full mx-auto max-w-5xl select-none">
        <div ref={bookRef} className="shadow-soft ring-1 ring-border rounded-md overflow-hidden bg-card">
          {pages.map((page, idx) => (
            <article
              key={idx}
              className="page h-full w-full bg-card"
              aria-label={`Page ${idx + 1}`}
            >
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <div className="w-full aspect-[3/2] overflow-hidden rounded-md bg-muted">
                  <img
                    src={page.illustration}
                    alt={`Story illustration page ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-playful text-base md:text-lg text-foreground leading-relaxed">
                  {page.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TurnJSBook;
