'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useConcentricContext, type DragOffset } from '@/contexts/ConcentricContext';
import { calculateTerritories } from './territoryCalculator';

interface DragHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

interface UseDraggableResult {
  dragHandlers: DragHandlers;
  offset: DragOffset;
  isDragging: boolean;
}

export const useDraggable = (elementId: string): UseDraggableResult => {
  const { elements, dragOffsets, setDragOffset, viewport } = useConcentricContext();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [initialOffset, setInitialOffset] = useState<DragOffset>({ x: 0, y: 0 });

  const currentOffset = dragOffsets.get(elementId) ?? { x: 0, y: 0 };

  // Calculate territory bounds for this element
  // Use layoutWidth for stable drag constraints
  const territoryBounds = useMemo(() => {
    if (elements.size === 0 || viewport.layoutWidth === 0) return null;

    const territories = calculateTerritories(elements, viewport);
    const territory = territories.find((t) => t.id === elementId);
    return territory?.territoryBounds ?? null;
  }, [elements, viewport, elementId]);

  // Get element bounds
  const elementBounds = useMemo(() => {
    return elements.get(elementId)?.bounds ?? null;
  }, [elements, elementId]);

  // Constrain offset to keep element within territory
  const constrainOffset = useCallback(
    (offset: DragOffset): DragOffset => {
      if (!territoryBounds || !elementBounds) return offset;

      // Calculate where the element would be with this offset
      const newLeft = elementBounds.left + offset.x;
      const newTop = elementBounds.top + offset.y;
      const newRight = newLeft + elementBounds.width;
      const newBottom = newTop + elementBounds.height;

      let constrainedX = offset.x;
      let constrainedY = offset.y;

      // Constrain horizontally
      if (newLeft < territoryBounds.left) {
        constrainedX = territoryBounds.left - elementBounds.left;
      } else if (newRight > territoryBounds.right) {
        constrainedX = territoryBounds.right - elementBounds.right;
      }

      // Constrain vertically
      if (newTop < territoryBounds.top) {
        constrainedY = territoryBounds.top - elementBounds.top;
      } else if (newBottom > territoryBounds.bottom) {
        constrainedY = territoryBounds.bottom - elementBounds.bottom;
      }

      return { x: constrainedX, y: constrainedY };
    },
    [territoryBounds, elementBounds]
  );

  // Handle mouse/touch move
  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handleMove = (clientX: number, clientY: number) => {
      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;

      const newOffset = constrainOffset({
        x: initialOffset.x + deltaX,
        y: initialOffset.y + deltaY,
      });

      setDragOffset(elementId, newOffset);
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, dragStart, initialOffset, constrainOffset, setDragOffset, elementId]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return;

      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialOffset(currentOffset);
    },
    [currentOffset]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;

      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setInitialOffset(currentOffset);
    },
    [currentOffset]
  );

  return {
    dragHandlers: {
      onMouseDown,
      onTouchStart,
    },
    offset: currentOffset,
    isDragging,
  };
};
