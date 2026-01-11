'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

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

  useEffect(() => {
    registerElement(elementId, 'section', elementRef.current);
    return () => unregisterElement(elementId);
  }, [elementId, registerElement, unregisterElement]);

  const handleToggle = (expanded: boolean) => {
    setIsExpanded(expanded);
    setExpanded(elementId, expanded);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on a link
    if ((e.target as HTMLElement).tagName === 'A') return;
    handleToggle(!isExpanded);
  };

  return (
    <div
      ref={elementRef}
      className={`expandable-section ${isExpanded ? 'expanded' : ''}`}
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
    >
      <div className="expandable-label">[ {label} ]</div>
      <div className="expandable-content">
        {children}
      </div>
    </div>
  );
};
