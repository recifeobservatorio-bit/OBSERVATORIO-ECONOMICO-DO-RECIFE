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

const ItbiAvaliacoes = ({ data, year }: { data: any; year?: string }) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, i) => i));
  const sortableContainerRef = useRef<HTMLDivElement>(null);

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

        <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid bi-grid-2x2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {chartOrder.map((index) => {
            const { Component, wide, span } = charts[index] as { Component: React.ComponentType<any>; wide?: boolean; span?: number };
            return (
              <div key={index} className={`chart-content-wrapper relative${wide ? " col-span-full" : ""}${span === 2 ? " lg:col-span-2" : ""}`}>
                <SectionIconBadge icon={<TributosIcon />} />
                <React.Suspense fallback={<GraphSkeleton />}>
                  <ErrorBoundary>
                    <Component data={data} colors={ColorPalette.default} />
                  </ErrorBoundary>
                </React.Suspense>
              </div>
            );
          })}
        </SortableDiv>
      </div>
    </FitToScreen>
  );
};

export default ItbiAvaliacoes;
