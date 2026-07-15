"use client";

import { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import BarChart from "@/components/@global/charts/BarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const YEAR = "2026";

const AeroportoMovimentacao = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [voos, setVoos] = useState(0);

  useEffect(() => {
    const service = new AeroportoData(YEAR);
    Promise.all([
      service.fetchProcessedAenaPassageirosData(),
      service.fetchProcessedAenaCargasData(),
      service.fetchProcessedData(),
    ]).then(([passageiros, cargas, anac]) => {
      const totalPassageiros = passageiros
        .filter((r: any) => r.Aeroporto === "Recife")
        .reduce((acc: number, r: any) => acc + (Number(r.Passageiros) || 0), 0);
      const totalCargas = cargas
        .filter((r: any) => r.Aeroporto === "Recife")
        .reduce((acc: number, r: any) => acc + (Number(r.Quantidade) || 0), 0);
      const totalVoos = anac
        .filter((r: any) => r["AEROPORTO NOME"] === "Recife")
        .reduce((acc: number, r: any) => acc + (Number(r.DECOLAGENS) || 0), 0);

      setChartData([{ label: "Recife", passageiros: totalPassageiros, cargas: totalCargas }]);
      setVoos(totalVoos);
    });
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="Movimentação Aeroportos" subtitle={`${voos.toLocaleString("pt-BR")} voos no período`}>
      <BarChart
        data={chartData}
        xKey="label"
        colors={ColorPalette.default}
        bars={[
          { dataKey: "passageiros", name: "Passageiros" },
          { dataKey: "cargas", name: "Cargas" },
        ]}
      />
    </PanoramaCard>
  );
};

export default AeroportoMovimentacao;
