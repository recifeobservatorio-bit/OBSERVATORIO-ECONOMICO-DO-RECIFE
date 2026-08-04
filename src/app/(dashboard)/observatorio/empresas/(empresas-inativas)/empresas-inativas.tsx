"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import { SortableDiv } from "@/components/@global/features/SortableDiv";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { getDataObj } from "@/functions/process_data/observatorio/micro-caged/getDataObj";
import { getSaldoData } from "@/functions/process_data/observatorio/micro-caged/getSaldoData";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import charts from "./@imports/charts";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import maps from "./@imports/maps";
import cards from "./@imports/cards";


const EmpresasInativas = ({
  data,
  dataSemMes,
  dataSemMesPast,
  year,
}: {
  data: any;
  dataSemMes?: any;
  dataSemMesPast?: any;
  year: string;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));

  const sortableContainerRef = useRef<HTMLDivElement>(null);

  const params = ['nome_bairro', 'Grupo', 'desc_atividade', 'mes', 'rpa', 'zona']

  const chartData = useMemo(() => {
    const acc = geralAccFunction(data, params)
    // 'mesFiltrado' preserva a série respeitando o filtro de mês, para o toggle
    // Mês/Ano de EmpresasMes escolher entre ela e a variante sem filtro abaixo.
    acc.mesFiltrado = acc.mes
    // 'mes' alimenta o modo "Ano" do gráfico de linha (EmpresasMes) — usa a série sem o
    // filtro de mês aplicado, senão a linha vira um ponto só quando um mês é selecionado.
    if (dataSemMes) acc.mes = geralAccFunction(dataSemMes, ['mes']).mes
    // 'mesPast' é o ano anterior inteiro, por mês — usado pra comparar o período atual com o
    // mesmo período do ano passado.
    acc.mesPast = dataSemMesPast ? geralAccFunction(dataSemMesPast, ['mes']).mes : {}
    return acc
  }, [data, dataSemMes, dataSemMesPast, params])
  
  const { Component }: any = maps[0]

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

      <div className="place-items-center z-0 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 w-full overflow-x-hidden flex flex-col items-center">
          <Component data={data} />
        </div>
      </div>
    </div>
  );
};

export default EmpresasInativas;
