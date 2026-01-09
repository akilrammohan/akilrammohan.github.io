'use client';

import { useState } from 'react';

interface ExpandableSectionProps {
  label: string;
  children: React.ReactNode;
}

export const ExpandableSection = ({ label, children }: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="expandable-section">
      <button
        className="expandable-label"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        [ {label} ]
      </button>
      <div
        className="expandable-content"
        style={{ display: isExpanded ? 'block' : 'none' }}
      >
        {children}
      </div>
    </div>
  );
};
