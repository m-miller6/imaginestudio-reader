import React, { useRef, useEffect, useState } from 'react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

interface PageContent {
  text: string;
  illustration: string;
}

interface PageFlipBookProps {
  pages: PageContent[];
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}


export const PageFlipBook: React.FC<PageFlipBookProps> = ({
  pages,
  currentPage,
  onPageChange,
  className = ""
}) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const book = bookRef.current;
    if (!book || isInitialized) return;

    // Wait for jQuery and turn.js to load
    const initializeTurn = () => {
      if (!window.$ || !window.$.fn.turn) {
        setTimeout(initializeTurn, 100);
        return;
      }

      try {
        // Initialize turn.js with jQuery
        const $book = window.$(book);
        $book.turn({
          width: 1000,
          height: 600,
          elevation: 50,
          gradients: true,
          autoCenter: true,
          duration: 1000,
          pages: pages.length,
          page: currentPage,
          when: {
            turning: function(event: any, page: number) {
              onPageChange(page);
            },
            turned: function(event: any, page: number) {
              onPageChange(page);
            }
          }
        });

        setIsInitialized(true);
        console.log('Turn.js initialized successfully');
      } catch (error) {
        console.error('Error initializing turn.js:', error);
      }
    };

    initializeTurn();

    return () => {
      if (window.$ && bookRef.current) {
        const $book = window.$(bookRef.current);
        if ($book.turn && typeof $book.turn === 'function') {
          try {
            if ($book.turn('is')) {
              $book.turn('destroy');
            }
          } catch (e) {
            console.log('Error destroying turn.js:', e);
          }
        }
      }
    };
  }, [pages.length, isInitialized]);

  // Update page when currentPage prop changes
  useEffect(() => {
    const book = bookRef.current;
    if (!book || !window.$ || !isInitialized) return;

    const $book = window.$(book);
    if ($book.turn('is') && $book.turn('page') !== currentPage) {
      $book.turn('page', currentPage);
    }
  }, [currentPage, isInitialized]);

  // Fallback swipe gestures for mobile devices
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (window.$ && bookRef.current) {
        const $book = window.$(bookRef.current);
        if ($book.turn('is')) {
          $book.turn('next');
        }
      }
    },
    onSwipeRight: () => {
      if (window.$ && bookRef.current) {
        const $book = window.$(bookRef.current);
        if ($book.turn('is')) {
          $book.turn('previous');
        }
      }
    }
  });

  if (!pages || pages.length === 0) {
    return (
      <div className={`book-container ${className}`}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No pages to display
        </div>
      </div>
    );
  }

  return (
    <div className={`book-container ${className}`} {...swipeHandlers}>
      <div 
        ref={bookRef}
        className="flipbook"
      >
        {pages.map((page, index) => (
          <div key={index + 1} className={index === 0 || index === pages.length - 1 ? "page hard" : "page"}>
            <div className="page-content">
              {page.illustration && (
                <div className="page-illustration">
                  <img 
                    src={page.illustration} 
                    alt={`Story illustration ${index + 1}`}
                  />
                </div>
              )}
              {page.text && (
                <div className="page-text">
                  <p className="text-lg leading-relaxed text-foreground">
                    {page.text}
                  </p>
                </div>
              )}
              <div className="page-number">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};