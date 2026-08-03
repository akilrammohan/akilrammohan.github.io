'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    __colorizeLinks?: (reshuffle?: boolean) => void;
  }
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const ClientColorizer = () => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useIsoLayoutEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    window.__colorizeLinks?.(true);
  }, [pathname]);

  return null;
};
