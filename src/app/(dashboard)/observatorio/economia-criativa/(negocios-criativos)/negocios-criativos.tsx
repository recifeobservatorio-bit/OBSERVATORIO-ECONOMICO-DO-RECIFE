"use client";

import React, { useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EconomiaCriativaIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";

const NegociosCriativos = ({
  data,
  year,
}: {
  data: any[];
  year: string;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const sortableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <FitToScreen>
      <div>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {cards.map(({ Component }, index) => (
            <React.Suspense fallback={<div>Carregando...</div>} key={index}>
              <ErrorBoundary>
                <Component data={data || []} year={year} color={ColorPalette.default[index]} />
              </ErrorBoundary>
            </React.Suspense>
          ))}
        </div>

        <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid bi-grid-2x2 grid-cols-1 sm:grid-cols-2 gap-4">
          {chartOrder.map((index) => {
            const { Component } = charts[index];
            return (
              <div key={index} className="chart-content-wrapper relative">
                <SectionIconBadge icon={<EconomiaCriativaIcon />} />
                <React.Suspense fallback={<GraphSkeleton />}>
                  <ErrorBoundary>
                    <Component data={data || []} />
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

export default NegociosCriativos;
