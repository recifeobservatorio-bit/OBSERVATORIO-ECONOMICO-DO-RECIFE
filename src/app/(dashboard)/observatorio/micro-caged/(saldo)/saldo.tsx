"use client";

import React, { useEffect, useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EmpregosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { getDataObj } from "@/functions/process_data/observatorio/micro-caged/getDataObj";
import { getSaldoData } from "@/functions/process_data/observatorio/micro-caged/getSaldoData";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";


const Saldo = ({
  data,
  year,
}: {
  data: any;
  year: string;
}) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const sortableContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState({})
  
  console.log('FOI!')

  useEffect(() => {
    const dataAdmitidos = getDataObj(data.filter((obj: any) => obj['saldomovimentação'] === "Admitidos"))
    const dataDemitidos = getDataObj(data.filter((obj: any) => obj['saldomovimentação'] === "Demitidos"))

    const dataSaldo = getSaldoData(dataAdmitidos, dataDemitidos)

    setChartData(dataSaldo)
  }, [data])

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

      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default Saldo;
