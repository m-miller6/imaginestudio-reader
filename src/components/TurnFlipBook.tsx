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
    if (!el || typeof $ === "undefined") return;

    const $book = $(el);

    // Helper: responsive sizing
    const sizeToWrapper = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const maxWidth = Math.min(wrapper.clientWidth, 1100);
      const width = Math.max(480, maxWidth);
      const height = Math.round(width * 0.68); // pleasant aspect
      try {
        $book.turn("size", width, height);
      } catch {}
    };

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
        $book.turn("destroy");
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep plugin page in sync when prop changes
  useEffect(() => {
    const el = bookRef.current;
    if (!el || typeof $ === "undefined") return;
    const $book = $(el);
    try {
      const target = (currentPage - 1) * 2 + 1;
      const cur = $book.turn("page");
      if (cur !== target) $book.turn("page", target);
    } catch {}
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


