'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    __colorizeLinks?: () => void;
  }
}

export const ClientColorizer = () => {
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Re-colorize on client-side navigation
    window.__colorizeLinks?.();
  }, [pathname]);

  return null;
};
