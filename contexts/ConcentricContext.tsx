'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type ElementType = 'nav' | 'section' | 'social';

export interface ElementData {
  id: string;
  type: ElementType;
  bounds: DOMRect | null;
  isExpanded?: boolean;
}

interface Viewport {
  width: number;
  height: number;
}

interface ConcentricContextValue {
  elements: Map<string, ElementData>;
  registerElement: (id: string, type: ElementType, element: HTMLElement | null) => void;
  unregisterElement: (id: string) => void;
  setExpanded: (id: string, expanded: boolean) => void;
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
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRefs = useRef<Map<string, HTMLElement>>(new Map());
  const rafIdRef = useRef<number | null>(null);

  // Update all element bounds from their current positions
  const updateAllBounds = useCallback(() => {
    setElements((prev) => {
      const next = new Map(prev);
      elementRefs.current.forEach((element, id) => {
        const data = next.get(id);
        if (data) {
          const rect = element.getBoundingClientRect();
          next.set(id, { ...data, bounds: rect });
        }
      });
      return next;
    });
  }, []);

  // Schedule viewport and bounds update in next frame
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      // Double RAF to ensure layout is complete
      requestAnimationFrame(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        updateAllBounds();
        rafIdRef.current = null;
      });
    });
  }, [updateAllBounds]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => scheduleUpdate();

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scheduleUpdate]);

  // Setup ResizeObserver for element size changes
  useEffect(() => {
    observerRef.current = new ResizeObserver(() => {
      scheduleUpdate();
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [scheduleUpdate]);

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

    // Schedule update to get accurate bounds after render
    requestAnimationFrame(() => {
      setElements((prev) => {
        const next = new Map(prev);
        const data = next.get(id);
        if (data && elementRefs.current.has(id)) {
          const el = elementRefs.current.get(id)!;
          next.set(id, { ...data, bounds: el.getBoundingClientRect() });
        }
        return next;
      });
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

  const setExpanded = useCallback((id: string, expanded: boolean) => {
    setElements((prev) => {
      const next = new Map(prev);
      const data = next.get(id);
      if (data) {
        next.set(id, { ...data, isExpanded: expanded });
      }
      return next;
    });

    // Schedule updates over multiple frames to catch layout changes
    const delays = [0, 16, 32, 64, 128, 256];
    delays.forEach((delay) => {
      setTimeout(scheduleUpdate, delay);
    });
  }, [scheduleUpdate]);

  return (
    <ConcentricContext.Provider
      value={{
        elements,
        registerElement,
        unregisterElement,
        setExpanded,
        viewport,
      }}
    >
      {children}
    </ConcentricContext.Provider>
  );
};
