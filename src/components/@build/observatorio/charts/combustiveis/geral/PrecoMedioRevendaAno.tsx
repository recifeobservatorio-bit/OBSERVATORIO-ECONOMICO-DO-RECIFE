"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PrecoMedioRevendaAno = ({
  data,
  title = "Preço Médio de Revenda por Ano",
  colors = ColorPalette.default,
}: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData: any[] = data?.linhaPrecoMedio ?? [];
  const anoChartData: any[] = data?.linhaPrecoMedioPorAno ?? [];
  const chartData = mode === "ano" ? anoChartData : mesChartData;
  const xKey = mode === "ano" ? "ano" : "mes";

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={colors}
          xKey={xKey}
          tooltipEntry="R$"
          lines={[{ dataKey: "preco", name: "Preço Médio (R$)", strokeWidth: 2 }]}
          yAxis={mode === "mes" ? { domain: [4, 8] } : undefined}
        />
      </ChartGrabber>
    </div>
  );
};

export default PrecoMedioRevendaAno;
