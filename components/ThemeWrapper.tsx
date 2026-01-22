'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
