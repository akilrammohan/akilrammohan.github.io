'use client';

import { useMemo } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';
import { calculateTerritories, generateAllRings, type Ring } from '@/lib/territoryCalculator';

interface ConcentricCanvasProps {
  gap?: number;
  spacing?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export const ConcentricCanvas = ({
  gap = 8,
  spacing = 12,
  strokeColor = 'var(--text-color)',
  strokeWidth = 1,
  strokeOpacity = 0.3,
}: ConcentricCanvasProps) => {
  const { elements, viewport } = useConcentricContext();

  const rings = useMemo(() => {
    if (elements.size === 0 || viewport.layoutWidth === 0) {
      return new Map<string, Ring[]>();
    }

    const territories = calculateTerritories(elements, viewport, gap);
    return generateAllRings(territories, spacing);
  }, [elements, viewport, gap, spacing]);

  if (viewport.layoutWidth === 0 || viewport.height === 0) {
    return null;
  }

  return (
    <svg
      className="concentric-canvas"
      width={viewport.visibleWidth}
      height={viewport.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {Array.from(rings.entries()).map(([id, ringList]) =>
        ringList.map((ring, i) => (
          <rect
            key={`${id}-${i}`}
            x={ring.x}
            y={ring.y}
            width={ring.width}
            height={ring.height}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={strokeOpacity}
          />
        ))
      )}
    </svg>
  );
};
