"use client";

import React, { useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { TributosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";

// Quando o total de gráficos é divisível por 3, distribui em duas fileiras
// iguais de 3 (em vez de destacar o primeiro gráfico com o dobro da largura).
const isEvenThirds = charts.length % 3 === 0;
const TOP_ROW_SIZE = isEvenThirds ? charts.length / 2 : 2;
// grid-cols-1 (celular) -> 2 (tablet em pé) -> 3 (tablet paisagem/notebook/desktop)
const GRID_CLASS = isEvenThirds
  ? "grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
  : "grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 pb-4";

const ItbiContribuintes = ({ data, year }: { data: any; year?: string }) => {
  const topCharts = charts.slice(0, TOP_ROW_SIZE);
  const bottomCharts = charts.slice(TOP_ROW_SIZE);

  const [topOrder, setTopOrder] = useState(topCharts.map((_, i) => i));
  const [bottomOrder, setBottomOrder] = useState(bottomCharts.map((_, i) => i));
  const topContainerRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  const renderChart = (chart: (typeof charts)[number], index: number) => {
    const { Component, span } = chart;
    const spanClass = !isEvenThirds && span === 2 ? " md:col-span-2 lg:col-span-2" : "";
    return (
      <div key={index} className={`chart-content-wrapper relative w-full${spanClass}`}>
        <SectionIconBadge icon={<TributosIcon />} />
        <React.Suspense fallback={<GraphSkeleton />}>
          <ErrorBoundary>
            <Component data={data} colors={ColorPalette.default} />
          </ErrorBoundary>
        </React.Suspense>
      </div>
    );
  };

  return (
    <FitToScreen>
      <div className="pb-4">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {cards.map(({ Component }, index) => (
            <React.Suspense fallback={<div className="min-w-[310px] h-[120px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />} key={index}>
              <ErrorBoundary>
                <Component data={data} year={year} color={ColorPalette.default[index]} />
              </ErrorBoundary>
            </React.Suspense>
          ))}
        </div>

        <SortableDiv
          chartOrder={topOrder}
          setChartOrder={setTopOrder}
          sortableContainerRef={topContainerRef}
          style={GRID_CLASS}
        >
          {topOrder.map((index) => renderChart(topCharts[index], index))}
        </SortableDiv>

        <SortableDiv
          chartOrder={bottomOrder}
          setChartOrder={setBottomOrder}
          sortableContainerRef={bottomContainerRef}
          style={GRID_CLASS}
        >
          {bottomOrder.map((index) => renderChart(bottomCharts[index], TOP_ROW_SIZE + index))}
        </SortableDiv>
      </div>
    </FitToScreen>
  );
};

export default ItbiContribuintes;
