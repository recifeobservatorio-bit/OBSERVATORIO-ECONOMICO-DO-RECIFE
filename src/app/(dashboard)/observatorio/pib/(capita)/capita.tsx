import React, { useRef, useEffect, useState } from "react";
import Sortable from "sortablejs";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { PibIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";
import tables from "./@imports/tables";

const Capita = ({ toCompare, data, year, months }: { toCompare?: string[]; data: any; year: string, months: number }) => {
  
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const [tableOrder, setTableOrder] = useState(tables.map((_, index) => index));

  // REF do container e REF da instância do Sortable
  const sortableContainerRef = useRef<HTMLDivElement>(null);
  const sortableContainerTableRef = useRef<HTMLDivElement>(null);

  return (
    <FitToScreen>
    {/* Tela única: gráficos e tabela numa grade só de 3 colunas (5 gráficos +
        tabela = 2 linhas). Antes a tabela ocupava uma linha inteira sozinha. */}
    <div className="lg:grid lg:grid-cols-3 lg:gap-4">
      <div className="flex flex-wrap gap-4 justify-center mb-8 lg:col-span-3 lg:mb-0">
        {cards.map(({ Component }, index) => (
          <React.Suspense fallback={<div>Carregando...</div>} key={index}>
            <Component
              // local={toCompare ? toCompare : []}
              data={data}
              year={year}
              color={ColorPalette.default[index]}
            />
          </React.Suspense>
        ))}
      </div>

      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="flex flex-wrap items-stretch gap-4 lg:contents">
        {chartOrder.map((index) => {
          const { Component } = charts[index];
          return (
            <div
              key={index}
              className={`chart-content-wrapper grow basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)] relative`}
            >
              <SectionIconBadge icon={<PibIcon />} />
              <React.Suspense fallback={<GraphSkeleton />}>
                <Component data={data} months={months} />
              </React.Suspense>
            </div>
          );
        })}

      </SortableDiv>

      <SortableDiv chartOrder={tableOrder} setChartOrder={setTableOrder} sortableContainerRef={sortableContainerTableRef} style="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 lg:contents">
          {tableOrder.map((index) => {
          const { Component } = tables[index];

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg flex flex-col items-center w-full relative"
            >
              <SectionIconBadge icon={<PibIcon />} />
              <React.Suspense fallback={<div>Carregando...</div>}>
                <Component
                  color={ColorPalette.default[index]}
                  data={data}
                />
              </React.Suspense>
            </div>
          )})}
        </SortableDiv>
    </div>
    </FitToScreen>
  );
};

export default Capita;
