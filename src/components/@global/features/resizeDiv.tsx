'use client'

import { MutableRefObject, useEffect } from "react";

/** Acompanha a largura do elemento de `containerRef` e repassa para `setWidth`. */
export const useResizeDiv = (containerRef: MutableRefObject<HTMLDivElement | null>, _width: number | null, setWidth: (val: number | null) => void) => {
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(element);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
