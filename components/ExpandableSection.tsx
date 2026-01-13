'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

interface ExpandableSectionProps {
  label: string;
  lines: React.ReactNode[];
}

type AnimationState = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';

const LINE_DELAY = 120; // ms between each line

const COLORS = [
  '--color-tet-1', '--color-tet-2', '--color-tet-3', '--color-tet-4',
  '--color-tet-5', '--color-tet-6', '--color-tet-7', '--color-tet-8'
];

const shuffle = (array: string[]): string[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Recursively traverse React children and apply colors to <a> elements
const colorizeLinks = (
  node: React.ReactNode,
  colors: string[],
  indexRef: { current: number }
): React.ReactNode => {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // If it's an <a> element, apply color
    if (child.type === 'a') {
      const color = colors[indexRef.current % colors.length];
      indexRef.current++;
      return React.cloneElement(child, {
        ...child.props,
        style: { ...child.props.style, color: `var(${color})` },
      });
    }

    // If it has children, recurse
    if (child.props.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: colorizeLinks(child.props.children, colors, indexRef),
      });
    }

    return child;
  });
};

export const ExpandableSection = ({
  label,
  lines,
}: ExpandableSectionProps) => {
  const [animationState, setAnimationState] = useState<AnimationState>('collapsed');
  const [visibleLineCount, setVisibleLineCount] = useState(0);
  const [colorSequence, setColorSequence] = useState<string[]>(() => shuffle(COLORS));
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
      // Start expanding - shuffle colors for this expansion
      setColorSequence(shuffle(COLORS));
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

  // Apply colors to all lines (color index continues across lines)
  const colorIndexRef = { current: 0 };
  const colorizedLines = validLines.map((line) =>
    colorizeLinks(line, colorSequence, colorIndexRef)
  );

  // Bottom-to-top: reverse lines, slice first N, reverse again to maintain visual order
  const reversedLines = [...colorizedLines].reverse();
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
