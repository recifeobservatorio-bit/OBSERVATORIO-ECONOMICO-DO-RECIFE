"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EvolucaoPrecoEstado = ({ data, title = "Evolução do Preço Médio por Estado", colors = ColorPalette.default }: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("ano");

  const evolucao: any[] = data?.evolucao ?? [];
  const porMes: any[] = data?.porMes ?? [];
  const chartData = mode === "ano" ? evolucao : porMes;
  const xKey = mode === "ano" ? "ano" : "mes";

  const estados: string[] = chartData.length > 0
    ? Object.keys(chartData[0]).filter((k) => k !== "ano" && k !== "mes")
    : [];

  // "PE" sempre em azul, os demais seguem a paleta padrão
  const lineColors = estados.map((e, i) => (e === "PE" ? "#0155AE" : colors[i % colors.length]));

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={lineColors}
          xKey={xKey}
          tooltipEntry="R$"
          height={500}
          lines={estados.map((e) => ({ dataKey: e, name: e, strokeWidth: 2 }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default EvolucaoPrecoEstado;
