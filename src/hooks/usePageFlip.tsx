import { useState, useCallback, useRef } from "react";

interface UsePageFlipOptions {
  totalPages: number;
  onPageChange?: (page: number) => void;
  flipDuration?: number;
  dragThreshold?: number;
}

export const usePageFlip = ({
  totalPages,
  onPageChange,
  flipDuration = 750,
  dragThreshold = 0.3,
}: UsePageFlipOptions) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  
  const flipTimeoutRef = useRef<NodeJS.Timeout>();

  const nextPage = useCallback(() => {
    if (isFlipping || isDragging || currentPage >= totalPages) return false;
    
    setFlipDirection('next');
    setIsFlipping(true);
    setFlipProgress(0);
    
    flipTimeoutRef.current = setTimeout(() => {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
      setIsFlipping(false);
      setFlipProgress(0);
    }, flipDuration);
    
    return true;
  }, [currentPage, totalPages, isFlipping, isDragging, onPageChange, flipDuration]);

  const prevPage = useCallback(() => {
    if (isFlipping || isDragging || currentPage <= 1) return false;
    
    setFlipDirection('prev');
    setIsFlipping(true);
    setFlipProgress(0);
    
    flipTimeoutRef.current = setTimeout(() => {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
      setIsFlipping(false);
      setFlipProgress(0);
    }, flipDuration);
    
    return true;
  }, [currentPage, isFlipping, isDragging, onPageChange, flipDuration]);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (isFlipping) return false;
    
    setIsDragging(true);
    setDragStartX(clientX);
    setDragStartY(clientY);
    setFlipProgress(0);
    
    return true;
  }, [isFlipping]);

  const updateDrag = useCallback((clientX: number, clientY: number, bookRect: DOMRect) => {
    if (!isDragging) return;
    
    const bookCenter = bookRect.left + bookRect.width / 2;
    const dragDistanceX = clientX - dragStartX;
    const dragDistanceY = Math.abs(clientY - dragStartY);
    const maxDrag = bookRect.width / 3;
    
    // Ignore if it's more of a vertical drag (scrolling)
    if (dragDistanceY > Math.abs(dragDistanceX) * 2) {
      return;
    }
    
    // Determine flip direction based on start position and drag direction
    const startedOnRightSide = dragStartX > bookCenter;
    
    if (startedOnRightSide && dragDistanceX < 0 && currentPage < totalPages) {
      // Dragging left from right side - next page
      setFlipDirection('next');
      const progress = Math.min(Math.abs(dragDistanceX) / maxDrag, 1);
      setFlipProgress(progress);
    } else if (!startedOnRightSide && dragDistanceX > 0 && currentPage > 1) {
      // Dragging right from left side - previous page
      setFlipDirection('prev');
      const progress = Math.min(dragDistanceX / maxDrag, 1);
      setFlipProgress(progress);
    } else {
      setFlipProgress(0);
    }
  }, [isDragging, dragStartX, dragStartY, currentPage, totalPages]);

  const endDrag = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (flipProgress > dragThreshold) {
      // Complete the flip
      setIsFlipping(true);
      
      flipTimeoutRef.current = setTimeout(() => {
        let newPage = currentPage;
        
        if (flipDirection === 'next' && currentPage < totalPages) {
          newPage = currentPage + 1;
        } else if (flipDirection === 'prev' && currentPage > 1) {
          newPage = currentPage - 1;
        }
        
        setCurrentPage(newPage);
        onPageChange?.(newPage);
        setIsFlipping(false);
        setFlipProgress(0);
      }, flipDuration * 0.5);
    } else {
      // Snap back with animation
      setFlipProgress(0);
    }
  }, [isDragging, flipProgress, flipDirection, currentPage, totalPages, onPageChange, flipDuration, dragThreshold]);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isFlipping || isDragging) {
      return false;
    }
    
    const direction = page > currentPage ? 'next' : 'prev';
    setFlipDirection(direction);
    setIsFlipping(true);
    setFlipProgress(0);
    
    flipTimeoutRef.current = setTimeout(() => {
      setCurrentPage(page);
      onPageChange?.(page);
      setIsFlipping(false);
      setFlipProgress(0);
    }, flipDuration);
    
    return true;
  }, [currentPage, totalPages, isFlipping, isDragging, onPageChange, flipDuration]);

  const cancelFlip = useCallback(() => {
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }
    setIsFlipping(false);
    setIsDragging(false);
    setFlipProgress(0);
  }, []);

  return {
    currentPage,
    isFlipping,
    flipProgress,
    flipDirection,
    isDragging,
    nextPage,
    prevPage,
    startDrag,
    updateDrag,
    endDrag,
    goToPage,
    cancelFlip,
    canGoNext: currentPage < totalPages && !isFlipping && !isDragging,
    canGoPrev: currentPage > 1 && !isFlipping && !isDragging,
  };
};