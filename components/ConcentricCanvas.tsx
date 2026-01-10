'use client';

import { useMemo } from 'react';
import { useConcentricContext } from '@/contexts/ConcentricContext';
import { calculateTerritories, generateAllRings, type Ring, type Territory } from '@/lib/territoryCalculator';

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
  const { elements, dragOffsets, viewport } = useConcentricContext();

  const { navRings, contentRings } = useMemo(() => {
    if (elements.size === 0 || viewport.layoutWidth === 0) {
      return { navRings: new Map<string, Ring[]>(), contentRings: new Map<string, Ring[]>() };
    }

    // Calculate territories from original element positions (fixed)
    const territories = calculateTerritories(elements, viewport, gap);

    // Apply drag offsets to element bounds for ring generation
    const territoriesWithOffsets: Territory[] = territories.map((territory) => {
      const offset = dragOffsets.get(territory.id);
      if (!offset) return territory;

      // Create new element bounds with offset applied
      const offsetBounds = new DOMRect(
        territory.elementBounds.x + offset.x,
        territory.elementBounds.y + offset.y,
        territory.elementBounds.width,
        territory.elementBounds.height
      );

      return {
        ...territory,
        elementBounds: offsetBounds,
      };
    });

    const allRings = generateAllRings(territoriesWithOffsets, spacing);

    // Separate nav rings from content rings
    const navRings = new Map<string, Ring[]>();
    const contentRings = new Map<string, Ring[]>();

    allRings.forEach((rings, id) => {
      if (id.startsWith('nav-')) {
        navRings.set(id, rings);
      } else {
        contentRings.set(id, rings);
      }
    });

    return { navRings, contentRings };
  }, [elements, dragOffsets, viewport, gap, spacing]);

  if (viewport.layoutWidth === 0 || viewport.height === 0) {
    return null;
  }

  const renderRings = (rings: Map<string, Ring[]>) =>
    Array.from(rings.entries()).map(([id, ringList]) =>
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
    );

  return (
    <>
      {/* Fixed layer for nav elements */}
      <svg
        className="concentric-canvas-nav"
        width={viewport.visibleWidth}
        height="100vh"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {renderRings(navRings)}
      </svg>

      {/* Absolute layer for scrolling content */}
      <svg
        className="concentric-canvas-content"
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
        {renderRings(contentRings)}
      </svg>
    </>
  );
};
