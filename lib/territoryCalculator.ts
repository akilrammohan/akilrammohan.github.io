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
  width: number;
  height: number;
}

/**
 * Groups elements by their type and sorts them by position
 */
export const groupAndSortElements = (elements: Map<string, ElementData>) => {
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

  // Sort nav and sections by vertical position (top)
  nav.sort((a, b) => (a.bounds?.top ?? 0) - (b.bounds?.top ?? 0));
  sections.sort((a, b) => (a.bounds?.top ?? 0) - (b.bounds?.top ?? 0));

  // Sort social by horizontal position (left)
  social.sort((a, b) => (a.bounds?.left ?? 0) - (b.bounds?.left ?? 0));

  return { nav, sections, social };
};

/**
 * Calculates territories for all elements based on midpoint rules
 */
export const calculateTerritories = (
  elements: Map<string, ElementData>,
  viewport: Viewport,
  gap: number = 4
): Territory[] => {
  const { nav, sections, social } = groupAndSortElements(elements);
  const territories: Territory[] = [];

  if (viewport.width === 0 || viewport.height === 0) return territories;

  // Calculate the horizontal boundary between nav and content
  // This is the midpoint between the rightmost nav element and leftmost content element
  let navRightEdge = 0;
  let contentLeftEdge = viewport.width;

  nav.forEach((el) => {
    if (el.bounds) {
      navRightEdge = Math.max(navRightEdge, el.bounds.right);
    }
  });

  [...sections, ...social].forEach((el) => {
    if (el.bounds) {
      contentLeftEdge = Math.min(contentLeftEdge, el.bounds.left);
    }
  });

  const horizontalMidpoint = (navRightEdge + contentLeftEdge) / 2;

  // Process nav elements (vertical stack on left)
  nav.forEach((el, i) => {
    if (!el.bounds) return;

    const top = i === 0
      ? 0
      : (nav[i - 1].bounds!.bottom + el.bounds.top) / 2;

    const bottom = i === nav.length - 1
      ? viewport.height
      : (el.bounds.bottom + nav[i + 1].bounds!.top) / 2;

    territories.push({
      id: el.id,
      type: el.type,
      elementBounds: el.bounds,
      territoryBounds: {
        top: top + gap / 2,
        right: horizontalMidpoint - gap / 2,
        bottom: bottom - gap / 2,
        left: gap / 2,
      },
    });
  });

  // Find the bottom of sections to determine where social links start
  let sectionsBottom = 0;
  sections.forEach((el) => {
    if (el.bounds) {
      sectionsBottom = Math.max(sectionsBottom, el.bounds.bottom);
    }
  });

  // Find the top of social links
  let socialTop = viewport.height;
  social.forEach((el) => {
    if (el.bounds) {
      socialTop = Math.min(socialTop, el.bounds.top);
    }
  });

  const sectionsSocialMidpoint = social.length > 0
    ? (sectionsBottom + socialTop) / 2
    : viewport.height;

  // Process section elements (vertical stack in center-right)
  sections.forEach((el, i) => {
    if (!el.bounds) return;

    const top = i === 0
      ? 0
      : (sections[i - 1].bounds!.bottom + el.bounds.top) / 2;

    const bottom = i === sections.length - 1
      ? sectionsSocialMidpoint
      : (el.bounds.bottom + sections[i + 1].bounds!.top) / 2;

    // Sections share horizontal space with social links
    // If there are social links, section territory doesn't go to viewport right
    const rightBound = social.length > 0
      ? viewport.width - gap / 2  // Will be further constrained by social territories
      : viewport.width - gap / 2;

    territories.push({
      id: el.id,
      type: el.type,
      elementBounds: el.bounds,
      territoryBounds: {
        top: top + gap / 2,
        right: rightBound,
        bottom: bottom - gap / 2,
        left: horizontalMidpoint + gap / 2,
      },
    });
  });

  // Process social elements (horizontal row, full-height columns)
  social.forEach((el, i) => {
    if (!el.bounds) return;

    const left = i === 0
      ? horizontalMidpoint
      : (social[i - 1].bounds!.right + el.bounds.left) / 2;

    const right = i === social.length - 1
      ? viewport.width
      : (el.bounds.right + social[i + 1].bounds!.left) / 2;

    territories.push({
      id: el.id,
      type: el.type,
      elementBounds: el.bounds,
      territoryBounds: {
        top: sectionsSocialMidpoint + gap / 2,
        right: right - gap / 2,
        bottom: viewport.height - gap / 2,
        left: left + gap / 2,
      },
    });
  });

  return territories;
};

/**
 * Generates concentric rings for a territory with constant spacing
 */
export const generateRings = (
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
