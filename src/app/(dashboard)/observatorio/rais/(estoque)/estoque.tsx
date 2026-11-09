"use client";

import React, { useEffect, useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EmpregosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { cnaeAccFunction, geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";

const Estoque = ({
  data,
  year,
}: {
  data: any;
  year: string;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const sortableContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    console.log('dados->0->1->2->3->4->', geralAccFunction(data.ativ || [], ["Ind CEI Vinculado", "Ind Simples", "Tamanho Estabelecimento", "Natureza Jurídica"]))

    setChartData(geralAccFunction(data.ativ || [], ["Ind CEI Vinculado", "Ind Simples", "Tamanho Estabelecimento", "Natureza Jurídica"]))
  }, [data])

  return (
    <FitToScreen>
      <div>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {cards.slice(0, 1).map(({ Component }, index) => (
            <React.Suspense fallback={<div>Carregando...</div>} key={index}>
              <Component data={data} cards={cards.slice(1)} year={year} ColorPalette={ColorPalette.default} />
            </React.Suspense>
          ))}
        </div>

        <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default Estoque;
