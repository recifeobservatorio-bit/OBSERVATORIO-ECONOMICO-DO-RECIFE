"use client";

import React, { useEffect, useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EmpregosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";
import maps from "./@imports/maps";

const Desemprego = ({
  data,
  year,
  months,
}: {
  data: any;
  year: string;
  months: number;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const sortableContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState({})

  useEffect(() => {
      setChartData(data)
  }, [data])

  const { Component }: any = maps[0]

  return (
    <FitToScreen>
    <div>
      {/* Duas linhas centralizadas independentemente (não um grid único):
          com o mesmo gap e largura de card nas duas linhas, centralizar
          cada uma separadamente forma o efeito "triângulo de sinuca" —
          os 2 cards de baixo ficam alinhados com os vãos da linha de cima.
          Também evita o "tamanho variando": flex-wrap numa linha só
          quebrava num ponto imprevisível conforme a largura da janela. */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {cards.slice(0, 3).map(({ Component }, index) => (
            <React.Suspense fallback={<div>Carregando...</div>} key={index}>
              <Component data={chartData} year={year} color={ColorPalette.default[index]} />
            </React.Suspense>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {cards.slice(3).map(({ Component }, index) => (
            <React.Suspense fallback={<div>Carregando...</div>} key={index + 3}>
              <Component data={chartData} year={year} color={ColorPalette.default[index + 3]} />
            </React.Suspense>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="contents">
          {chartOrder.map((index) => {
            const { Component } = charts[index];
            return (
              <div
                key={index}
                className={`chart-content-wrapper relative`}
              >
                <SectionIconBadge icon={<EmpregosIcon />} />
                <React.Suspense fallback={<GraphSkeleton />}>
                  <ErrorBoundary>
                    <Component data={data} months={months} />
                  </ErrorBoundary>
                </React.Suspense>
              </div>
            );
          })}
        </SortableDiv>

        <div className="chart-content-wrapper overflow-x-hidden relative">
          <SectionIconBadge icon={<EmpregosIcon />} />
          <Component data={data} />
        </div>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Desemprego;
