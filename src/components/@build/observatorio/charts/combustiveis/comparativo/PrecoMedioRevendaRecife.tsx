"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PrecoMedioRevendaRecife = ({
  data,
  title = "Preço Médio de Revenda — Recife",
  colors = ColorPalette.default,
}: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData: any[] = data?.linhaRecife ?? data?.comparacao?.map((d: any) => ({
    mes: d.municipio ?? "",
    preco: d.preco ?? 0,
  })) ?? [];
  const anoChartData: any[] = data?.linhaRecifePorAno ?? [];
  const chartData = mode === "ano" ? anoChartData : mesChartData;
  const xKey = mode === "ano" ? "ano" : "mes";

  // Mesma escala do Y usada no painel do município comparado, pra dar pra comparar visualmente
  const comparativoData = mode === "ano" ? (data?.linhaComparativoPorAno ?? []) : (data?.linhaComparativo ?? []);
  const allPrecos = [...chartData, ...comparativoData].map((d: any) => d.preco).filter((v: number) => v != null);
  const yDomain = allPrecos.length
    ? [parseFloat((Math.min(...allPrecos) * 0.98).toFixed(2)), parseFloat((Math.max(...allPrecos) * 1.01).toFixed(2))]
    : undefined;

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
          yAxis={yDomain ? { domain: yDomain } : undefined}
          lines={[{ dataKey: "preco", name: "Recife (R$)", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PrecoMedioRevendaRecife;
