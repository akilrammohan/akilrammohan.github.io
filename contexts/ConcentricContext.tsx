'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { calculateTerritories } from '@/lib/territoryCalculator';

export type ElementType = 'nav' | 'section' | 'social';

export interface ElementData {
  id: string;
  type: ElementType;
  bounds: DOMRect | null;
  baseX: number | null; // Locked X position, only reset on true window resize
  isExpanded?: boolean;
}

export interface DragOffset {
  x: number;
  y: number;
}

interface Viewport {
  layoutWidth: number;  // innerWidth - stable, for territory calculations
  visibleWidth: number; // clientWidth - for right edge clamping (scrollbar-aware)
  height: number;
  scrollbarCompensation: number; // 0.25 * scrollbar width, to offset CSS percentage shift
}

interface ConcentricContextValue {
  elements: Map<string, ElementData>;
  dragOffsets: Map<string, DragOffset>;
  registerElement: (id: string, type: ElementType, element: HTMLElement | null) => void;
  unregisterElement: (id: string) => void;
  updateBounds: (id: string, bounds: DOMRect) => void;
  setExpanded: (id: string, expanded: boolean) => void;
  setDragOffset: (id: string, offset: DragOffset | null) => void;
  resetRandomOffsets: () => void;
  viewport: Viewport;
}

const ConcentricContext = createContext<ConcentricContextValue | null>(null);

export const useConcentricContext = () => {
  const context = useContext(ConcentricContext);
  if (!context) {
    throw new Error('useConcentricContext must be used within ConcentricProvider');
  }
  return context;
};

export const ConcentricProvider = ({ children }: { children: React.ReactNode }) => {
  const [elements, setElements] = useState<Map<string, ElementData>>(new Map());
  const [dragOffsets, setDragOffsets] = useState<Map<string, DragOffset>>(new Map());
  const [viewport, setViewport] = useState<Viewport>({ layoutWidth: 0, visibleWidth: 0, height: 0, scrollbarCompensation: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());
  // Keep refs to current state so callbacks can access latest values
  const dragOffsetsRef = useRef<Map<string, DragOffset>>(dragOffsets);
  dragOffsetsRef.current = dragOffsets;
  const elementsRef = useRef<Map<string, ElementData>>(elements);
  elementsRef.current = elements;
  const viewportRef = useRef<Viewport>(viewport);
  viewportRef.current = viewport;
  // Track last known innerWidth to detect actual window resizes vs scrollbar changes
  const lastInnerWidthRef = useRef<number>(0);
  // RAF-based viewport update batching to prevent flicker
  const pendingViewportRef = useRef<Viewport | null>(null);
  const rafIdRef = useRef<number | null>(null);
  // Track whether random offsets have been generated for this "session"
  const randomOffsetsGeneratedRef = useRef(false);

  // Calculate content height from actual elements (not scrollHeight which includes SVG)
  // Uses base positions (without drag transforms) for consistent height calculation
  const getContentHeight = useCallback(() => {
    const scrollY = window.scrollY;
    let maxBottom = 0;
    const currentOffsets = dragOffsetsRef.current;

    // Find the bottom-most element (excluding nav which is fixed)
    elementRefs.current.forEach((element, id) => {
      if (!id.startsWith('nav-')) {
        const rect = element.getBoundingClientRect();
        const offset = currentOffsets.get(id);
        // Subtract drag offset to get base position
        const bottom = rect.bottom + scrollY - (offset?.y ?? 0);
        maxBottom = Math.max(maxBottom, bottom);
      }
    });

    // Always at least viewport height (fills screen), extends when content grows
    return Math.max(window.innerHeight, maxBottom + 32);
  }, []);

  // Batch viewport AND bounds updates into a single frame to prevent flicker
  // Multiple rapid updates (from ResizeObservers, setTimeouts) get coalesced
  // Both setViewport and setElements happen in same RAF callback = React batches them
  const scheduleViewportUpdate = useCallback((newViewport: Viewport, boundsUpdater: () => void) => {
    pendingViewportRef.current = newViewport;

    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Schedule update for next frame - both viewport and bounds together
    rafIdRef.current = requestAnimationFrame(() => {
      if (pendingViewportRef.current) {
        setViewport(pendingViewportRef.current);
        pendingViewportRef.current = null;
      }
      // Update bounds in same frame so React batches both state updates
      boundsUpdater();
      rafIdRef.current = null;
    });
  }, []);

  // Function to update ALL element bounds
  // Nav elements stay viewport-relative (they're position: fixed)
  // Other elements use document-relative coordinates
  // IMPORTANT: We subtract drag offsets to get "base" bounds (without CSS transform)
  // because getBoundingClientRect() includes transforms
  // IMPORTANT: X position is locked to baseX to prevent scrollbar-induced horizontal shift
  const updateAllBounds = useCallback(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const currentOffsets = dragOffsetsRef.current;

    setElements((prev) => {
      const next = new Map(prev);
      elementRefs.current.forEach((element, id) => {
        const data = next.get(id);
        if (data) {
          const rect = element.getBoundingClientRect();
          const offset = currentOffsets.get(id);

          if (data.type === 'nav') {
            // Nav elements are fixed, keep viewport-relative bounds
            // Subtract offset to get base position (getBoundingClientRect includes transforms)
            const navRect = new DOMRect(
              rect.x - (offset?.x ?? 0),
              rect.y - (offset?.y ?? 0),
              rect.width,
              rect.height
            );
            next.set(id, { ...data, bounds: navRect });
          } else {
            // Calculate current X position (for first-time capture or after window resize)
            const currentX = rect.x + scrollX - (offset?.x ?? 0);
            // Use locked baseX if available, otherwise capture current X
            const baseX = data.baseX ?? currentX;

            // Convert viewport-relative to document-relative coordinates
            // Use baseX for horizontal position (prevents scrollbar-induced shift)
            // Use current values for Y, width, height (these should update normally)
            const docRect = new DOMRect(
              baseX,
              rect.y + scrollY - (offset?.y ?? 0),
              rect.width,
              rect.height
            );
            next.set(id, { ...data, bounds: docRect, baseX });
          }
        }
      });
      return next;
    });
  }, []);

  // Track document size (not just viewport)
  // Window resize = actual viewport change, update both widths
  useEffect(() => {
    const handleWindowResize = () => {
      const layoutWidth = window.innerWidth;
      const visibleWidth = document.documentElement.clientWidth;
      const contentHeight = getContentHeight();
      // Compensate for CSS layout shift: margin-left is 25%, so shift = 0.25 * scrollbar width
      const scrollbarCompensation = 0.25 * (layoutWidth - visibleWidth);

      // True window resize - clear baseX so positions get recaptured
      if (layoutWidth !== lastInnerWidthRef.current) {
        setElements((prev) => {
          const next = new Map(prev);
          next.forEach((data, id) => {
            next.set(id, { ...data, baseX: null });
          });
          return next;
        });
      }

      lastInnerWidthRef.current = layoutWidth;
      scheduleViewportUpdate({ layoutWidth, visibleWidth, height: contentHeight, scrollbarCompensation }, updateAllBounds);
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [updateAllBounds, getContentHeight, scheduleViewportUpdate]);

  // Setup ResizeObserver - when ANY element resizes, update bounds and viewport
  // Also observe body to catch scrollbar appearing/disappearing
  useEffect(() => {
    const handleElementResize = () => {
      const currentInnerWidth = window.innerWidth;
      const visibleWidth = document.documentElement.clientWidth;
      const contentHeight = getContentHeight();
      // Compensate for CSS layout shift: margin-left is 25%, so shift = 0.25 * scrollbar width
      const scrollbarCompensation = 0.25 * (currentInnerWidth - visibleWidth);

      // Check if this is a true layout change or just scrollbar appearing
      const isScrollbarChange = currentInnerWidth === lastInnerWidthRef.current;

      if (!isScrollbarChange) {
        // Actual layout change - clear baseX
        setElements((prev) => {
          const next = new Map(prev);
          next.forEach((data, id) => {
            next.set(id, { ...data, baseX: null });
          });
          return next;
        });
        lastInnerWidthRef.current = currentInnerWidth;
      }

      // Schedule batched viewport AND bounds update (uses RAF to prevent flicker)
      scheduleViewportUpdate({
        layoutWidth: lastInnerWidthRef.current,
        visibleWidth,
        height: contentHeight,
        scrollbarCompensation,
      }, updateAllBounds);
    };

    observerRef.current = new ResizeObserver(() => {
      handleElementResize();
    });

    // Also observe body for scrollbar changes
    const bodyObserver = new ResizeObserver(() => {
      handleElementResize();
    });
    bodyObserver.observe(document.body);

    return () => {
      observerRef.current?.disconnect();
      bodyObserver.disconnect();
    };
  }, [updateAllBounds, getContentHeight, scheduleViewportUpdate]);

  const registerElement = useCallback((id: string, type: ElementType, element: HTMLElement | null) => {
    if (!element) return;

    element.dataset.concentricId = id;
    elementRefs.current.set(id, element);
    observerRef.current?.observe(element);

    setElements((prev) => {
      const next = new Map(prev);
      next.set(id, {
        id,
        type,
        bounds: element.getBoundingClientRect(),
        baseX: null, // Will be captured on first updateAllBounds
        isExpanded: false,
      });
      return next;
    });
  }, []);

  const unregisterElement = useCallback((id: string) => {
    const element = elementRefs.current.get(id);
    if (element) {
      observerRef.current?.unobserve(element);
      elementRefs.current.delete(id);
    }

    setElements((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const updateBounds = useCallback((id: string, bounds: DOMRect) => {
    setElements((prev) => {
      const next = new Map(prev);
      const data = next.get(id);
      if (data) {
        next.set(id, { ...data, bounds });
      }
      return next;
    });
  }, []);

  // Clamp existing offsets to their current territory bounds
  // Called after layout changes (expand/collapse) to keep elements within bounds
  // Uses refs to always get latest state values
  const clampOffsetsToTerritories = useCallback(() => {
    const currentElements = elementsRef.current;
    const currentViewport = viewportRef.current;

    if (currentElements.size === 0 || currentViewport.layoutWidth === 0) return;

    const territories = calculateTerritories(currentElements, currentViewport, 8);

    setDragOffsets((prev) => {
      const next = new Map(prev);

      territories.forEach((territory) => {
        const offset = next.get(territory.id);
        if (!offset) return;

        const { elementBounds, territoryBounds } = territory;

        // Calculate valid offset range
        const maxLeft = elementBounds.left - territoryBounds.left;
        const maxRight = territoryBounds.right - (elementBounds.left + elementBounds.width);
        const maxUp = elementBounds.top - territoryBounds.top;
        const maxDown = territoryBounds.bottom - (elementBounds.top + elementBounds.height);

        // Clamp offset to valid range
        const clampedX = Math.max(-maxLeft, Math.min(maxRight, offset.x));
        const clampedY = Math.max(-maxUp, Math.min(maxDown, offset.y));

        next.set(territory.id, { x: clampedX, y: clampedY });
      });

      return next;
    });
  }, []);

  const setExpanded = useCallback((id: string, expanded: boolean) => {
    setElements((prev) => {
      const next = new Map(prev);
      const data = next.get(id);
      if (data) {
        next.set(id, { ...data, isExpanded: expanded });
      }
      return next;
    });

    // Force bounds and viewport update after expansion/collapse
    const updateAll = () => {
      const currentInnerWidth = window.innerWidth;
      const visibleWidth = document.documentElement.clientWidth;
      const contentHeight = getContentHeight();
      // Compensate for CSS layout shift: margin-left is 25%, so shift = 0.25 * scrollbar width
      const scrollbarCompensation = 0.25 * (currentInnerWidth - visibleWidth);

      // Check if this is a true layout change or just scrollbar appearing
      const isScrollbarChange = currentInnerWidth === lastInnerWidthRef.current;

      if (!isScrollbarChange) {
        // Actual layout change - clear baseX
        setElements((prev) => {
          const next = new Map(prev);
          next.forEach((data, id) => {
            next.set(id, { ...data, baseX: null });
          });
          return next;
        });
        lastInnerWidthRef.current = currentInnerWidth;
      }

      // Schedule batched viewport AND bounds update (uses RAF to prevent flicker)
      scheduleViewportUpdate({
        layoutWidth: lastInnerWidthRef.current,
        visibleWidth,
        height: contentHeight,
        scrollbarCompensation,
      }, updateAllBounds);
    };

    // Use multiple frames to catch the full layout change
    const updateFrames = [0, 1, 2, 3, 5, 10, 20, 30];
    updateFrames.forEach((delay) => {
      setTimeout(updateAll, delay * 16);
    });

    // Clamp offsets after layout has settled (after final bounds update)
    setTimeout(() => {
      clampOffsetsToTerritories();
    }, 35 * 16); // After the last bounds update
  }, [updateAllBounds, getContentHeight, scheduleViewportUpdate, clampOffsetsToTerritories]);

  const setDragOffset = useCallback((id: string, offset: DragOffset | null) => {
    setDragOffsets((prev) => {
      const next = new Map(prev);
      if (offset === null) {
        next.delete(id);
      } else {
        next.set(id, offset);
      }
      return next;
    });
  }, []);

  // Generate random offsets (disabled - all elements start at default positions)
  const generateRandomOffsets = useCallback(() => {
    // No-op: randomization disabled
  }, []);

  // Reset random offsets to trigger regeneration on navigation
  const resetRandomOffsets = useCallback(() => {
    randomOffsetsGeneratedRef.current = false;
    setDragOffsets(new Map());
  }, []);

  // Generate random offsets once territories are ready
  useEffect(() => {
    if (randomOffsetsGeneratedRef.current) return;
    if (elements.size === 0 || viewport.layoutWidth === 0) return;

    // Check for valid bounds
    let hasValidBounds = false;
    elements.forEach((el) => {
      if (el.bounds && el.bounds.width > 0) hasValidBounds = true;
    });
    if (!hasValidBounds) return;

    // Use RAF to ensure layout is settled
    const rafId = requestAnimationFrame(() => {
      if (!randomOffsetsGeneratedRef.current) {
        generateRandomOffsets();
        randomOffsetsGeneratedRef.current = true;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [elements, viewport, generateRandomOffsets]);

  return (
    <ConcentricContext.Provider
      value={{
        elements,
        dragOffsets,
        registerElement,
        unregisterElement,
        updateBounds,
        setExpanded,
        setDragOffset,
        resetRandomOffsets,
        viewport,
      }}
    >
      {children}
    </ConcentricContext.Provider>
  );
};
