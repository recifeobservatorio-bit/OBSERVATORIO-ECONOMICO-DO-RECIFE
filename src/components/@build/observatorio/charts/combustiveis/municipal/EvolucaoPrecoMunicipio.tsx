"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EvolucaoPrecoMunicipio = ({ data, title = "Evolução do Preço Médio por Município", colors = ColorPalette.default }: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("ano");

  const evolucao: any[] = data?.evolucao ?? [];
  const porMes: any[] = data?.porMes ?? [];
  const chartData = mode === "ano" ? evolucao : porMes;
  const xKey = mode === "ano" ? "ano" : "mes";

  const municipios: string[] = chartData.length > 0
    ? Object.keys(chartData[0]).filter((k) => k !== "ano" && k !== "mes")
    : [];

  // "Recife" sempre em azul, os demais municípios seguem a paleta padrão
  const lineColors = municipios.map((m, i) => (m.includes("Recife") ? "#0155AE" : colors[i % colors.length]));

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
          lines={municipios.map((m) => ({ dataKey: m, name: m, strokeWidth: 2 }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default EvolucaoPrecoMunicipio;
