'use client';

import { ConcentricProvider } from '@/contexts/ConcentricContext';
import { ConcentricCanvas } from './ConcentricCanvas';

export const ConcentricWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConcentricProvider>
      <ConcentricCanvas
        gap={8}
        spacing={8}
        strokeOpacity={0.8}
      />
      {children}
    </ConcentricProvider>
  );
};
