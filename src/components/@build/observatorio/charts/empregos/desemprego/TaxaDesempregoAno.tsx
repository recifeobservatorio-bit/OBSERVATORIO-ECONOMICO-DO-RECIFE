"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processDesempregoTaxaAno, withGapBridge } from "@/functions/process_data/observatorio/empregos/desemprego/desempregoTaxaAno";
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
  // Vão 2º tri/2020–1º tri/2022: a base traz taxa 0 nas 27 capitais (sem dado) — ponte tracejada.
  const chartData = withGapBridge(processDesempregoTaxaAno(capitalRows, brasilRows), "value", "semDado");

  const capitals = Array.from(new Set(capitalRows.map((row: any) => row["Capital"]))) as string[];
  const onlyBrasil = capitals.length === 1 && capitals[0] === "Brasil";
  const capitalLabel = capitals.length === 1 ? capitalName(capitals[0]) : "Média das capitais";

  // Brasil tracejado como referência (some se o próprio filtro já for Brasil).
  const lines = [
    // Vão sem dado: a série real não liga as pontas; a ponte tracejada (mesma cor da capital) indica a falta.
    { dataKey: "value", name: capitalLabel, connectNulls: false },
    ...(chartData.some((d: any) => d.semDado != null) ? [{ dataKey: "semDado", name: "Sem dado na base", dashed: true, connectNulls: false, hideInTooltip: true }] : []),
    ...(onlyBrasil ? [] : [{ dataKey: "brasil", name: "Brasil", dashed: true }]),
  ];
  // Cor por série: ponte = cor da capital, Brasil = cinza.
  const lineColors = lines.map((l) => (l.dataKey === "brasil" ? colors[1] : colors[0]));

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={lineColors}
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
