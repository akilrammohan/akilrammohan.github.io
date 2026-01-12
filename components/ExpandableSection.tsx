'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

interface ExpandableSectionProps {
  label: string;
  lines: React.ReactNode[];
}

type AnimationState = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';

const LINE_DELAY = 120; // ms between each line

export const ExpandableSection = ({
  label,
  lines,
}: ExpandableSectionProps) => {
  const [animationState, setAnimationState] = useState<AnimationState>('collapsed');
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const { triggerUpdate } = useConcentricContext();
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter out falsy lines (for dynamic content that may not be loaded)
  const validLines = lines.filter(Boolean);
  const lineCount = validLines.length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const animateLine = useCallback((
    currentCount: number,
    targetCount: number,
    direction: 'expand' | 'collapse'
  ) => {
    if (direction === 'expand') {
      if (currentCount < targetCount) {
        const newCount = currentCount + 1;
        setVisibleLineCount(newCount);
        triggerUpdate();

        animationTimeoutRef.current = setTimeout(() => {
          animateLine(newCount, targetCount, direction);
        }, LINE_DELAY);
      } else {
        setAnimationState('expanded');
      }
    } else {
      // Collapse: decrease count
      if (currentCount > 0) {
        const newCount = currentCount - 1;
        setVisibleLineCount(newCount);
        triggerUpdate();

        animationTimeoutRef.current = setTimeout(() => {
          animateLine(newCount, 0, direction);
        }, LINE_DELAY);
      } else {
        setAnimationState('collapsed');
      }
    }
  }, [triggerUpdate]);

  const handleToggle = useCallback(() => {
    // Cancel any in-progress animation
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    if (animationState === 'collapsed' || animationState === 'collapsing') {
      // Start expanding
      setAnimationState('expanding');
      animateLine(visibleLineCount, lineCount, 'expand');
    } else {
      // Start collapsing
      setAnimationState('collapsing');
      animateLine(visibleLineCount, 0, 'collapse');
    }
  }, [animationState, visibleLineCount, lineCount, animateLine]);

  const handleClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on a link
    if ((e.target as HTMLElement).tagName === 'A') return;
    handleToggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const isExpanded = animationState === 'expanded' || animationState === 'expanding';

  // Bottom-to-top: reverse lines, slice first N, reverse again to maintain visual order
  const reversedLines = [...validLines].reverse();
  const visibleLines = reversedLines.slice(0, visibleLineCount).reverse();

  return (
    <div
      className={`expandable-section ${isExpanded ? 'expanded' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={handleKeyDown}
    >
      <div className="expandable-label">[ {label} ]</div>
      <div className="expandable-content">
        {visibleLineCount > 0 && (
          <div className="expandable-lines">
            {visibleLines.map((line, index) => (
              <div key={index} className="expandable-line">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
