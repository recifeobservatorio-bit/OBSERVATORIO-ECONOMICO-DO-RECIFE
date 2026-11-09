"use client";

import React, { useRef, useState } from "react";

import { PortoGeralData, PortoOperacaoData } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { PortosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";



const Operacao = ({
  data,
  year,
  months,
}: ChartBuild<PortoGeralData & PortoOperacaoData[]>) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));

  // REF do container e REF da instância do Sortable
  const sortableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <FitToScreen>
    <div>
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {cards.slice(0, 1).map(({ Component }, index) => (
          <React.Suspense fallback={<div>Carregando...</div>} key={index}>
            <Component data={data} cards={cards.slice(1)} year={year ?? "2024"} color={ColorPalette.default} />
          </React.Suspense>
        ))}
      </div>

      <SortableDiv
        chartOrder={chartOrder}
        setChartOrder={setChartOrder}
        sortableContainerRef={sortableContainerRef}
        style="grid bi-grid-2x2 items-stretch grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {chartOrder.map((index) => {
          const { Component } = charts[index];

          return (
            <div key={index} className="chart-content-wrapper relative">
              <SectionIconBadge icon={<PortosIcon />} />
              <React.Suspense fallback={<GraphSkeleton />}>
                <Component data={data} months={months} />
              </React.Suspense>
            </div>
          );
        })}
      </SortableDiv>

    </div>
    </FitToScreen>
  );
};

export default Operacao;
