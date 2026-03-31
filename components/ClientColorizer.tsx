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
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    window.__colorizeLinks?.();
  }, [pathname]);

  return null;
};
