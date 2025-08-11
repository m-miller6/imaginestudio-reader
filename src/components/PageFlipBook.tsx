import { useState, useRef, useCallback, useEffect } from "react";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

export const PageFlipBook = ({ pages, currentPage, onPageChange, className }: PageFlipBookProps) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  
  const bookRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const totalPages = pages.length;

  // Handle click to flip
  const handlePageClick = useCallback((side: 'left' | 'right') => {
    if (isFlipping || isDragging) return;
    
    if (side === 'right' && currentPage < totalPages) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(currentPage + 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }, 750);
    } else if (side === 'left' && currentPage > 1) {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(currentPage - 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }, 750);
    }
  }, [currentPage, totalPages, onPageChange, isFlipping, isDragging]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isFlipping) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    setDragStartX(clientX);
    setFlipProgress(0);
  }, [isFlipping]);

  // Handle drag move
  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !bookRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const bookRect = bookRef.current.getBoundingClientRect();
    const bookCenter = bookRect.left + bookRect.width / 2;
    const dragDistance = clientX - dragStartX;
    const maxDrag = bookRect.width / 3;
    
    // Determine flip direction based on start position and drag direction
    const startedOnRightSide = dragStartX > bookCenter;
    
    if (startedOnRightSide && dragDistance < 0 && currentPage < totalPages) {
      // Dragging left from right side - next page
      setFlipDirection('next');
      const progress = Math.min(Math.abs(dragDistance) / maxDrag, 1);
      setFlipProgress(progress);
    } else if (!startedOnRightSide && dragDistance > 0 && currentPage > 1) {
      // Dragging right from left side - previous page
      setFlipDirection('prev');
      const progress = Math.min(dragDistance / maxDrag, 1);
      setFlipProgress(progress);
    } else {
      setFlipProgress(0);
    }
  }, [isDragging, dragStartX, currentPage, totalPages]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (flipProgress > 0.3) {
      // Complete the flip
      setIsFlipping(true);
      setTimeout(() => {
        if (flipDirection === 'next' && currentPage < totalPages) {
          onPageChange(currentPage + 1);
        } else if (flipDirection === 'prev' && currentPage > 1) {
          onPageChange(currentPage - 1);
        }
        setIsFlipping(false);
        setFlipProgress(0);
      }, 400);
    } else {
      // Snap back
      setFlipProgress(0);
    }
  }, [isDragging, flipProgress, flipDirection, currentPage, totalPages, onPageChange]);

  // Swipe gesture handlers for mobile
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => handlePageClick('right'),
    onSwipeRight: () => handlePageClick('left'),
    threshold: 50
  });

  // Get current and next/prev page content
  const currentPageContent = pages[currentPage - 1];
  const nextPageContent = pages[currentPage];
  const prevPageContent = pages[currentPage - 2];
  
  const previewContent = flipDirection === 'next' ? nextPageContent : prevPageContent;

  // Calculate flip rotation based on progress or animation
  const getFlipRotation = () => {
    if (isDragging) {
      return flipProgress * 180;
    }
    if (isFlipping) {
      return 180;
    }
    return 0;
  };

  const flipRotation = getFlipRotation();

  return (
    <div 
      ref={bookRef}
      className={cn("book-container", className)}
      {...(isMobile ? swipeHandlers : {})}
    >
      {/* Book Spine */}
      <div className="book-spine" />
      
      {/* Left Page */}
      <div 
        className="book-page book-page-left"
        onClick={() => handlePageClick('left')}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Page content - text side */}
        <div className="page-content page-text">
          <div className="prose prose-lg max-w-none p-6 md:p-8">
            <p className={`font-playful ${isMobile ? 'text-base' : 'text-lg'} leading-relaxed text-foreground`}>
              {currentPageContent?.text}
            </p>
          </div>
        </div>
      </div>

      {/* Right Page */}
      <div 
        className={cn(
          "book-page book-page-right",
          (isFlipping || isDragging) && "flipping"
        )}
        style={{
          '--flip-rotation': `${flipRotation}deg`,
        } as React.CSSProperties}
        onClick={() => handlePageClick('right')}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Front face - illustration */}
        <div className="page-face page-face-front">
          <div className="page-content page-illustration">
            <div className={`${isMobile ? 'aspect-[4/3]' : 'aspect-square'} relative`}>
              <img 
                src={currentPageContent?.illustration}
                alt="Story illustration"
                className="w-full h-full object-cover"
              />
              <div className="page-gradient" />
            </div>
          </div>
        </div>

        {/* Back face - preview of next/previous page */}
        {previewContent && (
          <div className="page-face page-face-back">
            <div className="page-content page-preview">
              {flipDirection === 'next' ? (
                <div className="prose prose-lg max-w-none p-6 md:p-8">
                  <p className={`font-playful ${isMobile ? 'text-base' : 'text-lg'} leading-relaxed text-foreground opacity-80`}>
                    {previewContent.text}
                  </p>
                </div>
              ) : (
                <div className={`${isMobile ? 'aspect-[4/3]' : 'aspect-square'} relative`}>
                  <img 
                    src={previewContent.illustration}
                    alt="Previous page illustration"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="page-gradient" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page curl shadow */}
        <div className="page-curl-shadow" />
      </div>

      {/* Page number indicators */}
      <div className="page-numbers">
        <span className="page-number page-number-left">{currentPage * 2 - 1}</span>
        <span className="page-number page-number-right">{currentPage * 2}</span>
      </div>
    </div>
  );
};