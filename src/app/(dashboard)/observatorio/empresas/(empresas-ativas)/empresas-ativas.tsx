"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EmpresasIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { getDataObj } from "@/functions/process_data/observatorio/micro-caged/getDataObj";
import { getSaldoData } from "@/functions/process_data/observatorio/micro-caged/getSaldoData";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import maps from "./@imports/maps";


const EmpresasAtivas = ({
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

  const params = ['nome_bairro', 'Grupo', 'desc_atividade', 'mes']

  const chartData = useMemo(() => {
    const acc = geralAccFunction(data, params)
    // 'mesFiltrado' preserva a série respeitando o filtro de mês, para o toggle
    // Mês/Ano de EmpresasMes escolher entre ela e a variante sem filtro abaixo.
    acc.mesFiltrado = acc.mes
    // 'mes' alimenta o modo "Ano" do gráfico de linha (EmpresasMes) — usa a série sem o
    // filtro de mês aplicado, senão a linha vira um ponto só quando um mês é selecionado.
    if (dataSemMes) acc.mes = geralAccFunction(dataSemMes, ['mes']).mes
    // 'mesPast' é o ano anterior inteiro, por mês — usado pra comparar o mês atual com o
    // mesmo mês do ano passado.
    acc.mesPast = dataSemMesPast ? geralAccFunction(dataSemMesPast, ['mes']).mes : {}
    return acc
  }, [data, dataSemMes, dataSemMesPast, params])
  
  const { Component }: any = maps[0]

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

      {/* Como num painel Power BI: gráficos à esquerda (3/4) e o mapa numa
          coluna à direita com a altura toda — numa faixa larga embaixo a aba
          não cabia na tela única. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] gap-4 items-stretch">
      <div className="min-w-0">
      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="charts-items-wrapper !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !place-items-stretch">
        {chartOrder.map((index) => {
          const chart = charts[index] as typeof charts[number] & { full?: boolean; colSpan?: number; rowSpan?: number };
          const { Component, full, colSpan, rowSpan } = chart;
          return (
            <div
              key={index}
              className={`chart-content-wrapper relative ${full ? "col-span-full" : ""} ${colSpan === 2 ? "col-span-2" : ""} ${rowSpan === 2 ? "row-span-2" : ""}`}
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

      <div className="z-0 min-w-0">
        <div className="bg-white dark:bg-[#0C1A28] shadow-md rounded-lg p-3 w-full h-full overflow-x-hidden flex flex-col relative">
          <SectionIconBadge icon={<EmpresasIcon />} />
          <Component data={data} />
        </div>
      </div>
      </div>
    </div>
    </FitToScreen>
  );
};

export default EmpresasAtivas;
