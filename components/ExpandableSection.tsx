'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';
import { useDraggable } from '@/lib/useDraggable';

interface ExpandableSectionProps {
  label: string;
  children: React.ReactNode;
}

export const ExpandableSection = ({ label, children }: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const elementId = `section-${id}`;
  const { registerElement, unregisterElement, setExpanded } = useConcentricContext();
  const { dragHandlers, offset, isDragging } = useDraggable(elementId);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const wasDragged = useRef(false);

  useEffect(() => {
    registerElement(elementId, 'section', elementRef.current);
    return () => unregisterElement(elementId);
  }, [elementId, registerElement, unregisterElement]);

  const handleToggle = (expanded: boolean) => {
    setIsExpanded(expanded);
    setExpanded(elementId, expanded);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    wasDragged.current = false;
    dragHandlers.onMouseDown(e);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on a link
    if ((e.target as HTMLElement).tagName === 'A') return;

    // Check if this was a drag (moved more than 5px)
    if (dragStartPos.current) {
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) {
        wasDragged.current = true;
      }
    }

    // Only toggle if we didn't drag
    if (!wasDragged.current) {
      handleToggle(!isExpanded);
    }

    dragStartPos.current = null;
  };

  return (
    <div
      ref={elementRef}
      className={`expandable-section ${isExpanded ? 'expanded' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={dragHandlers.onTouchStart}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle(!isExpanded);
        }
      }}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: isDragging ? 'none' : undefined,
      }}
    >
      <div className="expandable-label">[ {label} ]</div>
      <div className="expandable-content">
        {children}
      </div>
    </div>
  );
};
