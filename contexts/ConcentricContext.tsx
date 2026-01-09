'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type ElementType = 'nav' | 'section' | 'social';

export interface ElementData {
  id: string;
  type: ElementType;
  bounds: DOMRect | null;
  isExpanded?: boolean;
}

interface ConcentricContextValue {
  elements: Map<string, ElementData>;
  registerElement: (id: string, type: ElementType, element: HTMLElement | null) => void;
  unregisterElement: (id: string) => void;
  updateBounds: (id: string, bounds: DOMRect) => void;
  setExpanded: (id: string, expanded: boolean) => void;
  viewport: { width: number; height: number };
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
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Calculate content height from actual elements (not scrollHeight which includes SVG)
  const getContentHeight = useCallback(() => {
    const scrollY = window.scrollY;
    let maxBottom = window.innerHeight;

    // Find the bottom-most element (excluding nav which is fixed)
    elementRefs.current.forEach((element, id) => {
      if (!id.startsWith('nav-')) {
        const rect = element.getBoundingClientRect();
        const bottom = rect.bottom + scrollY;
        maxBottom = Math.max(maxBottom, bottom + 50); // Add padding
      }
    });

    return maxBottom;
  }, []);

  // Function to update ALL element bounds
  // Nav elements stay viewport-relative (they're position: fixed)
  // Other elements use document-relative coordinates
  const updateAllBounds = useCallback(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    setElements((prev) => {
      const next = new Map(prev);
      elementRefs.current.forEach((element, id) => {
        const data = next.get(id);
        if (data) {
          const rect = element.getBoundingClientRect();

          if (data.type === 'nav') {
            // Nav elements are fixed, keep viewport-relative bounds
            next.set(id, { ...data, bounds: rect });
          } else {
            // Convert viewport-relative to document-relative coordinates
            const docRect = new DOMRect(
              rect.x + scrollX,
              rect.y + scrollY,
              rect.width,
              rect.height
            );
            next.set(id, { ...data, bounds: docRect });
          }
        }
      });
      return next;
    });
  }, []);

  // Track document size (not just viewport)
  useEffect(() => {
    const updateViewportSize = () => {
      // Use clientWidth to get visible viewport (excludes scrollbar)
      // This ensures rings shrink when scrollbar appears, expand when it disappears
      const width = document.documentElement.clientWidth;
      const contentHeight = getContentHeight();
      setViewport({ width, height: contentHeight });
      updateAllBounds();
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => {
      window.removeEventListener('resize', updateViewportSize);
    };
  }, [updateAllBounds, getContentHeight]);

  // Setup ResizeObserver - when ANY element resizes, update bounds and viewport
  // Also observe body to catch scrollbar appearing/disappearing
  useEffect(() => {
    const updateViewportAndBounds = () => {
      const width = document.documentElement.clientWidth;
      const contentHeight = getContentHeight();
      setViewport({ width, height: contentHeight });
      updateAllBounds();
    };

    observerRef.current = new ResizeObserver(() => {
      updateViewportAndBounds();
    });

    // Also observe body for scrollbar changes
    const bodyObserver = new ResizeObserver(() => {
      updateViewportAndBounds();
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
      const width = document.documentElement.clientWidth;
      const contentHeight = getContentHeight();
      setViewport({ width, height: contentHeight });
      updateAllBounds();
    };

    // Use multiple frames to catch the full layout change
    const updateFrames = [0, 1, 2, 3, 5, 10, 20, 30];
    updateFrames.forEach((delay) => {
      setTimeout(updateAll, delay * 16);
    });
  }, [updateAllBounds, getContentHeight]);

  return (
    <ConcentricContext.Provider
      value={{
        elements,
        registerElement,
        unregisterElement,
        updateBounds,
        setExpanded,
        viewport,
      }}
    >
      {children}
    </ConcentricContext.Provider>
  );
};
