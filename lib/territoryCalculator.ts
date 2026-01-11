import type { ElementData, ElementType } from '@/contexts/ConcentricContext';

export interface Territory {
  id: string;
  type: ElementType;
  elementBounds: DOMRect;
  territoryBounds: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Ring {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Viewport {
  layoutWidth: number;  // innerWidth - stable, for territory calculations
  visibleWidth: number; // clientWidth - for right edge clamping
  height: number;
}

/**
 * Groups elements by their type and sorts them by position
 */
const groupAndSortElements = (elements: Map<string, ElementData>) => {
  const nav: ElementData[] = [];
  const sections: ElementData[] = [];
  const social: ElementData[] = [];

  elements.forEach((data) => {
    if (!data.bounds) return;

    switch (data.type) {
      case 'nav':
        nav.push(data);
        break;
      case 'section':
        sections.push(data);
        break;
      case 'social':
        social.push(data);
        break;
    }
  });

  // Sort nav by horizontal position (left) - horizontal row at top
  nav.sort((a, b) => (a.bounds?.left ?? 0) - (b.bounds?.left ?? 0));
  // Sort sections by vertical position (top)
  sections.sort((a, b) => (a.bounds?.top ?? 0) - (b.bounds?.top ?? 0));
  // Sort social by horizontal position (left) - horizontal row at bottom
  social.sort((a, b) => (a.bounds?.left ?? 0) - (b.bounds?.left ?? 0));

  return { nav, sections, social };
};

/**
 * Calculates territories for all elements based on midpoint rules
 * Nav and social are horizontal rows at top/bottom
 * Sections are vertical stack in the middle
 * All territories extend to viewport left edge
 */
export const calculateTerritories = (
  elements: Map<string, ElementData>,
  viewport: Viewport,
  gap: number = 4
): Territory[] => {
  const { nav, sections, social } = groupAndSortElements(elements);
  const territories: Territory[] = [];
  const { layoutWidth, visibleWidth, height } = viewport;

  if (layoutWidth === 0 || height === 0) return territories;

  // Helper to clamp right edge for viewport-touching territories
  const clampRightEdge = (rightEdge: number): number => {
    const layoutEdge = layoutWidth - gap / 2;
    if (Math.abs(rightEdge - layoutEdge) < 1) {
      return visibleWidth - gap / 2;
    }
    return rightEdge;
  };

  // Find vertical boundaries between nav, sections, and social
  let navBottom = 0;
  nav.forEach((el) => {
    if (el.bounds) {
      navBottom = Math.max(navBottom, el.bounds.bottom);
    }
  });

  let sectionsTop = height;
  let sectionsBottom = 0;
  sections.forEach((el) => {
    if (el.bounds) {
      sectionsTop = Math.min(sectionsTop, el.bounds.top);
      sectionsBottom = Math.max(sectionsBottom, el.bounds.bottom);
    }
  });

  let socialTop = height;
  social.forEach((el) => {
    if (el.bounds) {
      socialTop = Math.min(socialTop, el.bounds.top);
    }
  });

  // Calculate midpoints between vertical groups
  const navSectionsMidpoint = nav.length > 0 && sections.length > 0
    ? (navBottom + sectionsTop) / 2
    : (nav.length > 0 ? navBottom + gap : 0);

  const sectionsSocialMidpoint = social.length > 0 && sections.length > 0
    ? (sectionsBottom + socialTop) / 2
    : (social.length > 0 ? socialTop - gap : height);

  // Process nav elements (horizontal row at top)
  nav.forEach((el, i) => {
    if (!el.bounds) return;

    const left = i === 0
      ? 0
      : (nav[i - 1].bounds!.right + el.bounds.left) / 2;

    const right = i === nav.length - 1
      ? layoutWidth
      : (el.bounds.right + nav[i + 1].bounds!.left) / 2;

    territories.push({
      id: el.id,
      type: el.type,
      elementBounds: el.bounds,
      territoryBounds: {
        top: gap / 2,
        right: clampRightEdge(right - gap / 2),
        bottom: navSectionsMidpoint - gap / 2,
        left: left + gap / 2,
      },
    });
  });

  // Process section elements (vertical stack in middle)
  sections.forEach((el, i) => {
    if (!el.bounds) return;

    // First section starts at nav-sections midpoint (or top if no nav)
    const top = i === 0
      ? navSectionsMidpoint
      : (sections[i - 1].bounds!.bottom + el.bounds.top) / 2;

    const bottom = i === sections.length - 1
      ? sectionsSocialMidpoint
      : (el.bounds.bottom + sections[i + 1].bounds!.top) / 2;

    territories.push({
      id: el.id,
      type: el.type,
      elementBounds: el.bounds,
      territoryBounds: {
        top: top + gap / 2,
        right: clampRightEdge(layoutWidth - gap / 2),
        bottom: bottom - gap / 2,
        left: gap / 2,
      },
    });
  });

  // Process social elements (horizontal row at bottom)
  social.forEach((el, i) => {
    if (!el.bounds) return;

    const left = i === 0
      ? 0
      : (social[i - 1].bounds!.right + el.bounds.left) / 2;

    const right = i === social.length - 1
      ? layoutWidth
      : (el.bounds.right + social[i + 1].bounds!.left) / 2;

    territories.push({
      id: el.id,
      type: el.type,
      elementBounds: el.bounds,
      territoryBounds: {
        top: sectionsSocialMidpoint + gap / 2,
        right: clampRightEdge(right - gap / 2),
        bottom: height - gap / 2,
        left: left + gap / 2,
      },
    });
  });

  return territories;
};

/**
 * Generates concentric rings for a territory with constant spacing
 */
const generateRings = (
  territory: Territory,
  spacing: number = 12
): Ring[] => {
  const rings: Ring[] = [];
  const { elementBounds, territoryBounds } = territory;

  // Start from the element bounds
  let currentRing = {
    x: elementBounds.left,
    y: elementBounds.top,
    width: elementBounds.width,
    height: elementBounds.height,
  };

  // First ring is the element itself
  rings.push({ ...currentRing });

  let iteration = 0;
  const maxIterations = 100; // Safety limit

  while (iteration < maxIterations) {
    // Expand the ring outward by constant spacing
    const nextRing = {
      x: currentRing.x - spacing,
      y: currentRing.y - spacing,
      width: currentRing.width + spacing * 2,
      height: currentRing.height + spacing * 2,
    };

    // Check if this ring would exceed territory bounds
    const exceedsTop = nextRing.y < territoryBounds.top;
    const exceedsRight = nextRing.x + nextRing.width > territoryBounds.right;
    const exceedsBottom = nextRing.y + nextRing.height > territoryBounds.bottom;
    const exceedsLeft = nextRing.x < territoryBounds.left;

    // Clamp the ring to territory bounds
    const clampedRing = {
      x: Math.max(nextRing.x, territoryBounds.left),
      y: Math.max(nextRing.y, territoryBounds.top),
      width: 0,
      height: 0,
    };

    clampedRing.width = Math.min(
      nextRing.x + nextRing.width,
      territoryBounds.right
    ) - clampedRing.x;

    clampedRing.height = Math.min(
      nextRing.y + nextRing.height,
      territoryBounds.bottom
    ) - clampedRing.y;

    // If the ring is too small or fully clamped, stop
    if (clampedRing.width <= 0 || clampedRing.height <= 0) {
      break;
    }

    // If all sides are clamped, we've filled the territory
    if (exceedsTop && exceedsRight && exceedsBottom && exceedsLeft) {
      rings.push(clampedRing);
      break;
    }

    rings.push(clampedRing);
    currentRing = nextRing; // Use unclamped for next iteration calculation
    iteration++;
  }

  return rings;
};

/**
 * Generate all rings for all territories
 */
export const generateAllRings = (
  territories: Territory[],
  spacing: number = 12
): Map<string, Ring[]> => {
  const allRings = new Map<string, Ring[]>();

  territories.forEach((territory) => {
    const rings = generateRings(territory, spacing);
    allRings.set(territory.id, rings);
  });

  return allRings;
};
