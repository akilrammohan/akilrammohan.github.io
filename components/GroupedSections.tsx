'use client';

import { useRef, useEffect } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';

interface GroupedSectionsProps {
  children: React.ReactNode;
}

export const GroupedSections = ({ children }: GroupedSectionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useConcentricContext();
  const id = 'grouped-sections';

  useEffect(() => {
    registerElement(id, 'section', containerRef.current);
    return () => unregisterElement(id);
  }, [registerElement, unregisterElement]);

  return (
    <div ref={containerRef} className="grouped-sections">
      {children}
    </div>
  );
};
