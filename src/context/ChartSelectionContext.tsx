'use client';
import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export type ChartSelection = { sourceId: string; value: string } | null;

type ChartSelectionContextType = {
  selection: ChartSelection;
  select: (sourceId: string, value: string) => void;
  clear: () => void;
};

const ChartSelectionContext = createContext<ChartSelectionContextType>({
  selection: null,
  select: () => {},
  clear: () => {},
});

export function useChartSelection() {
  return useContext(ChartSelectionContext);
}

export function ChartSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<ChartSelection>(null);

  const select = useCallback((sourceId: string, value: string) => {
    setSelection((current) =>
      current && current.sourceId === sourceId && current.value === value
        ? null
        : { sourceId, value }
    );
  }, []);

  const clear = useCallback(() => setSelection(null), []);

  return (
    <ChartSelectionContext.Provider value={{ selection, select, clear }}>
      {children}
    </ChartSelectionContext.Provider>
  );
}
