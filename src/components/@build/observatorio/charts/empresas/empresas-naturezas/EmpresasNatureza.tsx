"use client";

import React from "react";

import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasNatureza = ({
  data,
  title = "Empresas por Natureza Jurídica",
  year,
}: any) => {
  const dataEmpresas = data['empresas']

  const chartData = getObjToArr<number>(dataEmpresas['Natureza Jurídica'] || {}).sort((a, b) => b.value - a.value)

  // Esse card ocupa 2 linhas do grid — a altura real da linha é ditada pela coluna da
  // esquerda (Quantidade + Município empilhados, ~900px). Calculando heightPerCategory a
  // partir da quantidade real de categorias, as barras esticam pra preencher esse espaço
  // certinho, sem sobrar vazio embaixo nem depender de adivinhar quantas naturezas
  // jurídicas existem.
  const availableHeight = 860
  const heightPerCategory = Math.max(24, Math.min(90, Math.floor(availableHeight / Math.max(chartData.length, 1))))
  const visibleHeight = Math.max(chartData.length * heightPerCategory, 300)

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <VerticalScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          heightPerCategory={heightPerCategory}
          widthY={130}
          left={-15}
          visibleHeight={visibleHeight}
          maxBarSize={Math.max(8, Math.floor(heightPerCategory * 0.4))}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasNatureza;
