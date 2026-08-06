"use client";

import { useChartSelection } from "@/context/ChartSelectionContext";

const ChartSelectionIndicator = () => {
  const { selection, clear } = useChartSelection();

  if (!selection) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={clear}
        className="flex items-center gap-2 bg-[#0155AE] text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg hover:bg-[#013f85] transition-all"
      >
        <span>Filtro: {selection.value}</span>
        <span className="opacity-80">· Limpar</span>
      </button>
    </div>
  );
};

export default ChartSelectionIndicator;
