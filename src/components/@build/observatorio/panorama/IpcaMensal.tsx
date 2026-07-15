"use client";

import { useEffect, useState } from "react";

import { IpcaData } from "@/@api/http/to-charts/ipca/IPCAData";
import LineChart from "@/components/@global/charts/LineChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const IpcaMensal = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    new IpcaData("2024").fetchProcessedGeralData().then((rows: any[]) => {
      const recife = rows
        .filter((r) => r.Capital === "Recife")
        .sort((a, b) => a.Ano - b.Ano || a.MÊS - b.MÊS)
        .map((r) => ({
          mes: `${String(r.MÊS).padStart(2, "0")}/${r.Ano}`,
          variacao: r["IPCA - Variação mensal"],
        }));
      setChartData(recife);
    });
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="IPCA Índice Mensal Recife">
      <LineChart
        data={chartData}
        xKey="mes"
        colors={ColorPalette.default}
        lines={[{ dataKey: "variacao", name: "Variação Mensal (%)" }]}
      />
    </PanoramaCard>
  );
};

export default IpcaMensal;
