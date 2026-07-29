"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import { SortableDiv } from "@/components/@global/features/SortableDiv";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";


const EmpresasAtivasInativas = ({
  data,
  year,
}: {
  data: any;
  year: string;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));

  const sortableContainerRef = useRef<HTMLDivElement>(null);

  const params = ['nome_bairro', 'Grupo', 'desc_atividade', 'mes']

  const chartData = useMemo(() => {
    const ativas = geralAccFunction(data['ativas'], params)
    const inativas = geralAccFunction(data['inativas'], params)

    // Mesmo esquema de mesFiltrado/mes do toggle Mês/Ano em empresas-ativas.tsx
    ativas.mesFiltrado = ativas.mes
    inativas.mesFiltrado = inativas.mes
    if (data['ativasSemMes']) ativas.mes = geralAccFunction(data['ativasSemMes'], ['mes']).mes
    if (data['inativasSemMes']) inativas.mes = geralAccFunction(data['inativasSemMes'], ['mes']).mes

    return { ativas, inativas }
  }, [data, params])

  return (
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

      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="charts-items-wrapper">
        {chartOrder.map((index) => {
          const { Component } = charts[index];
          console.log('ChartData ->', chartData)

          return (
            <div
              key={index}
              className={`chart-content-wrapper`}
            >
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
  );
};

export default EmpresasAtivasInativas;
