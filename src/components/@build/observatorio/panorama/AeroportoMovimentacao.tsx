"use client";

import { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import BarChart from "@/components/@global/charts/BarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const AeroportoMovimentacao = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [voos, setVoos] = useState(0);

  useEffect(() => {
    setChartData(null);
    const service = new AeroportoData(year);
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
        .filter((r: any) => r["AEROPORTO NOME"] === "Recife" && r["GRUPO DE VOO"] !== "IMPRODUTIVO")
        .reduce((acc: number, r: any) => acc + (Number(r.DECOLAGENS) || 0), 0);

      setChartData([{ label: "Recife", passageiros: totalPassageiros, cargas: totalCargas }]);
      setVoos(totalVoos);
    });
  }, [year]);

  if (!chartData) return <GraphSkeleton />;

  const hasData = chartData.some((d) => d.passageiros > 0 || d.cargas > 0);

  return (
    <PanoramaCard title="Movimentação Aeroportos" subtitle={`${voos.toLocaleString("pt-BR")} voos no período`}>
      {!hasData ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          Sem dados de aeroportos para {year}.
        </p>
      ) : (
        <BarChart
          data={chartData}
          xKey="label"
          colors={ColorPalette.default}
          bars={[
            { dataKey: "passageiros", name: "Passageiros" },
            { dataKey: "cargas", name: "Cargas" },
          ]}
        />
      )}
    </PanoramaCard>
  );
};

export default AeroportoMovimentacao;
