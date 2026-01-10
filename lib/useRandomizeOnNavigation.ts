'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConcentricContext } from '@/contexts/ConcentricContext';

export const useRandomizeOnNavigation = () => {
  const pathname = usePathname();
  const { resetRandomOffsets } = useConcentricContext();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip initial mount (handled by context effect)
    if (previousPathRef.current === null) {
      previousPathRef.current = pathname;
      return;
    }

    // On navigation, reset to trigger regeneration
    if (pathname !== previousPathRef.current) {
      resetRandomOffsets();
      previousPathRef.current = pathname;
    }
  }, [pathname, resetRandomOffsets]);
};
