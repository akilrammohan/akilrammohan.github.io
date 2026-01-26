'use client';

import { useRef, useEffect, useState } from 'react';

interface VisitorCounterProps {
  count: number | null;
}

export const VisitorCounter = ({ count }: VisitorCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [topValue, setTopValue] = useState<number | null>(null);

  useEffect(() => {
    const groupedSections = document.querySelector('.grouped-sections');
    if (!groupedSections) return;

    const updatePosition = () => {
      const rect = groupedSections.getBoundingClientRect();
      const trackingTop = rect.bottom + 16; // 1rem below grouped-sections
      const restingTop = window.innerHeight - 16 - (ref.current?.offsetHeight ?? 20); // 1rem from bottom
      setTopValue(Math.max(trackingTop, restingTop));
    };

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(groupedSections);

    // Also update on window resize
    window.addEventListener('resize', updatePosition);

    // Initial position
    updatePosition();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  if (count === null) {
    return null;
  }

  const formattedCount = count.toLocaleString();

  return (
    <div
      ref={ref}
      className="visitor-counter"
      style={topValue !== null ? { top: `${topValue}px` } : undefined}
    >
      [visitor {formattedCount}]
    </div>
  );
};
