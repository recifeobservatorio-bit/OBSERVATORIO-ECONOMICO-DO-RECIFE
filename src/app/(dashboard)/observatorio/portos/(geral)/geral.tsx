"use client";

import React, { useRef, useState } from "react";

import { PortoGeralData } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { PortosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import charts from "./@imports/charts";
import maps from "./@imports/maps";
import tables from "./@imports/tables";


const Geral = ({
  data,
  months,
}: ChartBuild<PortoGeralData>) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const [tableOrder, setTableOrder] = useState(tables.map((_, index) => index));
  // REF do container e REF da instância do Sortable

  const sortableContainerRef = useRef<HTMLDivElement>(null);
  const sortableContainerTableRef = useRef<HTMLDivElement>(null);

  const { Component } = maps[0]

  return (
    <FitToScreen>
    {/* Como num painel Power BI: gráficos e tabela à esquerda, o mapa numa
        coluna à direita com a altura toda — numa faixa larga embaixo o Brasil
        (quase quadrado) aparecia pequeno ou cortado. */}
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 items-stretch">
      <div className="flex flex-col gap-4 min-w-0">
      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid bi-grid-2x2 items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {chartOrder.map((index) => {
          const { Component } = charts[index];
          return (
            <div
              key={index}
              className={`chart-content-wrapper relative`}
            >
              <SectionIconBadge icon={<PortosIcon />} />
              <React.Suspense fallback={<GraphSkeleton />}>
                <ErrorBoundary>
                  <Component data={data} months={months} />
                </ErrorBoundary>
              </React.Suspense>
            </div>
          );
        })}
      </SortableDiv>

      <SortableDiv chartOrder={tableOrder} setChartOrder={setTableOrder} sortableContainerRef={sortableContainerTableRef} style="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {tableOrder.map((index) => {
          const { Component } = tables[index];
         
          return ( 
            <div
              key={index}
              className="bg-white shadow-md rounded-lg flex flex-col items-center w-full relative"
            >
              <SectionIconBadge icon={<PortosIcon />} />
              <React.Suspense fallback={<div>Carregando...</div>}>
                <ErrorBoundary>
                  <Component
                    color={ColorPalette.default[index]}
                    data={data}
                  />
                </ErrorBoundary>
              </React.Suspense>
            </div>
          )})}
        </SortableDiv>
      </div>

      <div className="z-0 min-w-0">
        <div className="bg-white dark:bg-[#0C1A28] shadow-md rounded-lg p-4 w-full h-full overflow-x-hidden flex flex-col relative">
          <SectionIconBadge icon={<PortosIcon />} />
          <Component data={data.coords || []} />
        </div>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Geral;
