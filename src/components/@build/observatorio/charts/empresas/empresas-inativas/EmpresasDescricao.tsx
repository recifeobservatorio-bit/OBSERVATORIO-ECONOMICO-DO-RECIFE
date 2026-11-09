"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasDescricao = ({
  data,
  title = "Empresas por Atividade Econômica",
  year,
}: any) => {
  
  const chartData = getObjToArr<number>(data['desc_atividade'] || {}).sort((a, b) => b.value - a.value)
    
  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          heightPerCategory={24}
          // Nome maior e mais legível — a área do gráfico encolhe pra caber.
          widthY={170}
          yFontSize={14}
          left={-15}
          // Esse card agora ocupa 2 linhas do grid (bem mais alto que o
          // padrão) — sem isso o gráfico ficava pequeno, num box de scroll
          // de 400px, sobrando espaço vazio no resto do card.
          visibleHeight={900}
          maxBarSize={10}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasDescricao;
