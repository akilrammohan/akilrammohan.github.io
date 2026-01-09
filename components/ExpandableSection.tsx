'use client';

import { useState } from 'react';

interface ExpandableSectionProps {
  label: string;
  children: React.ReactNode;
}

export const ExpandableSection = ({ label, children }: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on a link
    if ((e.target as HTMLElement).tagName === 'A') return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`expandable-section ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
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
