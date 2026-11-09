"use client";

import React, {  useMemo, useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EmpresasIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";
import { geralAccFieldFunction, geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";

const EmpresasNaturezas = ({
  data,
  year,
}: {
  data: any;
  year: string;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));

  const sortableContainerRef = useRef<HTMLDivElement>(null);
 
  const params = ['Municipio', 'mes', 'Natureza Jurídica']
 
  const chartData = useMemo(() => {
    const empresas = geralAccFieldFunction(data['empresas'], params, 'Estabelecimentos')
    // 'mesPast' é o ano anterior inteiro, por mês (sem filtro de mês) — usado pelos cards
    // pra comparar o período atual com o mesmo período do ano passado.
    empresas.mesPast = data['past'] ? geralAccFieldFunction(data['past'], ['mes'], 'Estabelecimentos').mes : {}

    return {
      empresas,
      rawData: {
        municipio: geralAccFieldFunction(data['rawData']['municipio'], params, 'Estabelecimentos'),
        mes: geralAccFieldFunction(data['rawData']['mes'], params, 'Estabelecimentos')
      }
    }
  }, [data, params])
  
  return (
    <FitToScreen>
    <div>
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {cards.map(({ Component }, index) => (
          <React.Suspense fallback={<div>Carregando...</div>} key={index}>
            <ErrorBoundary>
              <Component
                data={chartData}
                year={year}
                color={ColorPalette.default[index]}
              />
            </ErrorBoundary>
          </React.Suspense>
        ))}
      </div>

      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="charts-items-wrapper !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-2 !place-items-stretch">
        {chartOrder.map((index) => {
          const chart = charts[index] as typeof charts[number] & { full?: boolean; rowSpan?: number };
          const { Component, full, rowSpan } = chart;
          return (
            <div
              key={index}
              className={`chart-content-wrapper relative ${full ? "col-span-full" : ""} ${rowSpan === 2 ? "row-span-2" : ""}`}
            >
              <SectionIconBadge icon={<EmpresasIcon />} />
              <React.Suspense fallback={<GraphSkeleton />}>
                <ErrorBoundary>
                  <Component data={chartData} />
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

export default EmpresasNaturezas;
