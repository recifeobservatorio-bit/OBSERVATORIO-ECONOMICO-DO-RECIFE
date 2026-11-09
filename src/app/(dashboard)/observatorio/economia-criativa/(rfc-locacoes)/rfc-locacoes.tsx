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

const RfcLocacoes = ({
  data,
  dataSemMes,
  year,
}: {
  data: any[];
  dataSemMes?: any[];
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

        <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="flex flex-wrap items-stretch gap-4">
          {chartOrder.map((index) => {
            const { Component } = charts[index];
            return (
              <div key={index} className="chart-content-wrapper relative grow shrink-0 basis-full sm:basis-[calc((100%_-_1rem)/2)] bi-half" style={{ height: "auto" }}>
                <SectionIconBadge icon={<EconomiaCriativaIcon />} />
                <React.Suspense fallback={<GraphSkeleton />}>
                  <ErrorBoundary>
                    <Component data={data || []} dataSemMes={dataSemMes || []} />
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

export default RfcLocacoes;
