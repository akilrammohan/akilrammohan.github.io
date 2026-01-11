'use client';

import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

interface GroupedSectionsProps {
  children: React.ReactNode;
  className?: string;
}

export const GroupedSections = ({ children, className }: GroupedSectionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useConcentricContext();
  const id = 'grouped-sections';

  useEffect(() => {
    registerElement(id, 'section', containerRef.current);
    return () => unregisterElement(id);
  }, [registerElement, unregisterElement]);

  const classes = className ? `grouped-sections ${className}` : 'grouped-sections';

  return (
    <div ref={containerRef} className={classes}>
      {children}
    </div>
  );
};
