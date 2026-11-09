"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processDesempregoTaxaAno } from "@/functions/process_data/observatorio/empregos/desemprego/desempregoTaxaAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Recife-PE" → "Recife" na legenda.
const capitalName = (value: string) => value.replace(/-[A-Z]{2}$/, "");

const TaxaDesempregoAno = ({
  data,
  nameKey = "label",
  colors = [ColorPalette.status.badLine, ColorPalette.status.neutral],
  title = "Taxa de Desemprego por Trimestre",
}: any) => {
  const capitalRows = data?.["historico"]?.["capital"] ?? [];
  const brasilRows = data?.["historico"]?.["brasil"] ?? [];
  const chartData = processDesempregoTaxaAno(capitalRows, brasilRows);

  const capitals = Array.from(new Set(capitalRows.map((row: any) => row["Capital"]))) as string[];
  const onlyBrasil = capitals.length === 1 && capitals[0] === "Brasil";
  const capitalLabel = capitals.length === 1 ? capitalName(capitals[0]) : "Média das capitais";

  // Brasil tracejado como referência (some se o próprio filtro já for Brasil).
  const lines = [
    // Sem conexão no vão da pandemia (sem divulgação por capital): a linha não inventa a ponte 2020→2022.
    { dataKey: "value", name: capitalLabel, connectNulls: false },
    ...(onlyBrasil ? [] : [{ dataKey: "brasil", name: "Brasil", dashed: true }]),
  ];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={colors}
          xKey={nameKey}
          lines={lines}
          tooltipEntry="%"
          yAxis={{ tickFormatter: (value: any) => `${value}%` }}
          height={440}
        />
      </ChartGrabber>
    </div>
  );
};

export default TaxaDesempregoAno;
