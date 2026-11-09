"use client";

import React, { useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { CombustiveisIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import charts from "./@imports/charts";

const Estadual = ({ data }: { data: any }) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, i) => i));
  const sortableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <FitToScreen>
    <div className="pb-4">
      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid bi-grid-2x2 items-stretch grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
        {chartOrder.map((index) => {
          const { Component } = charts[index];
          return (
            <div key={index} className="chart-content-wrapper relative">
              <SectionIconBadge icon={<CombustiveisIcon />} />
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

export default Estadual;
