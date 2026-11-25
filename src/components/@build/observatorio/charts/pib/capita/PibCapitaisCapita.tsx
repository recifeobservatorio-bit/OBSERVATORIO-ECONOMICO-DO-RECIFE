"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processPibCapitais } from "@/functions/process_data/observatorio/pib/geral/pibCapitais";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PibCapitaisCapita = ({
  data,
  title = "PIB per Capita em Relação às Capitais do País",
}: any) => {
  // Usa o ano inteiro (sem o filtro de município), como no Power BI; Recife fica destacado.
  const chartData = processPibCapitais(data.rawDataCurrent, true);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="group"
          bars={[{ dataKey: "pib", name: "PIB per capita" }]}
          colors={ColorPalette.default}
          heightPerCategory={50}
          highlightValues={["Recife - PE"]}
          highlightColor="#EC6625"
        />
      </ChartGrabber>
    </div>
  );
};

export default PibCapitaisCapita;
