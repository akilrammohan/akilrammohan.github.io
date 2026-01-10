'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

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
  // Keep a ref to current dragOffsets so callbacks can access it
  const dragOffsetsRef = useRef<Map<string, DragOffset>>(dragOffsets);
  dragOffsetsRef.current = dragOffsets;
  // Track last known innerWidth to detect actual window resizes vs scrollbar changes
  const lastInnerWidthRef = useRef<number>(0);

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
            next.set(id, { ...data, bounds: rect });
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
      setViewport({ layoutWidth, visibleWidth, height: contentHeight, scrollbarCompensation });
      updateAllBounds();
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [updateAllBounds, getContentHeight]);

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

      if (isScrollbarChange) {
        // Only scrollbar changed - update visibleWidth, height, and compensation
        // baseX stays locked, preventing horizontal shift
        setViewport((prev) => ({
          ...prev,
          visibleWidth,
          height: contentHeight,
          scrollbarCompensation,
        }));
      } else {
        // Actual layout change - clear baseX and update everything
        setElements((prev) => {
          const next = new Map(prev);
          next.forEach((data, id) => {
            next.set(id, { ...data, baseX: null });
          });
          return next;
        });
        lastInnerWidthRef.current = currentInnerWidth;
        setViewport({
          layoutWidth: currentInnerWidth,
          visibleWidth,
          height: contentHeight,
          scrollbarCompensation,
        });
      }
      updateAllBounds();
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
  }, [updateAllBounds, getContentHeight]);

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

      if (isScrollbarChange) {
        // Only scrollbar changed - baseX stays locked
        setViewport((prev) => ({
          ...prev,
          visibleWidth,
          height: contentHeight,
          scrollbarCompensation,
        }));
      } else {
        // Actual layout change - clear baseX
        setElements((prev) => {
          const next = new Map(prev);
          next.forEach((data, id) => {
            next.set(id, { ...data, baseX: null });
          });
          return next;
        });
        lastInnerWidthRef.current = currentInnerWidth;
        setViewport({
          layoutWidth: currentInnerWidth,
          visibleWidth,
          height: contentHeight,
          scrollbarCompensation,
        });
      }
      updateAllBounds();
    };

    // Use multiple frames to catch the full layout change
    const updateFrames = [0, 1, 2, 3, 5, 10, 20, 30];
    updateFrames.forEach((delay) => {
      setTimeout(updateAll, delay * 16);
    });
  }, [updateAllBounds, getContentHeight]);

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
        viewport,
      }}
    >
      {children}
    </ConcentricContext.Provider>
  );
};
