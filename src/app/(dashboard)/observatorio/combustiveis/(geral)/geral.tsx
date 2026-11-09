"use client";

import React, { useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { CombustiveisIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";

const TOP_ROW_SIZE = 2;

const Geral = ({ data, year }: { data: any; year?: string }) => {
  const topCharts = charts.slice(0, TOP_ROW_SIZE);
  const bottomCharts = charts.slice(TOP_ROW_SIZE);

  const [topOrder, setTopOrder] = useState(topCharts.map((_, i) => i));
  const [bottomOrder, setBottomOrder] = useState(bottomCharts.map((_, i) => i));
  const topContainerRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  const renderChart = (chart: (typeof charts)[number], index: number) => {
    const { Component, span } = chart;
    const spanClass = span === 2 ? " md:col-span-2 lg:col-span-2" : "";
    return (
      <div key={index} className={`chart-content-wrapper w-full${spanClass} relative`}>
        <SectionIconBadge icon={<CombustiveisIcon />} />
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
      {/* Cards */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {cards.map(({ Component }, index) => (
          <React.Suspense fallback={<div className="min-w-[310px] h-[120px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />} key={index}>
            <ErrorBoundary>
              <Component data={data} year={year} color={ColorPalette.default[index]} />
            </ErrorBoundary>
          </React.Suspense>
        ))}
      </div>

      {/* Gráficos: linha e dispersão na linha de cima (linha ocupa o dobro da largura) */}
      <SortableDiv
        chartOrder={topOrder}
        setChartOrder={setTopOrder}
        sortableContainerRef={topContainerRef}
        style="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 pb-4"
      >
        {topOrder.map((index) => renderChart(topCharts[index], index))}
      </SortableDiv>

      {/* Gráficos: estado, capitais e região na linha de baixo */}
      <SortableDiv
        chartOrder={bottomOrder}
        setChartOrder={setBottomOrder}
        sortableContainerRef={bottomContainerRef}
        style="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4"
      >
        {bottomOrder.map((index) => renderChart(bottomCharts[index], TOP_ROW_SIZE + index))}
      </SortableDiv>
    </div>
    </FitToScreen>
  );
};

export default Geral;
