"use client";

import { useEffect, useState } from "react";

import { EmpregosData } from "@/@api/http/to-charts/empregos/EmpregosData";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const EmpregosMovimentacao = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    setChartData(null);
    new EmpregosData(year).fetchProcessedDataCaged().then((rows: any[]) => {
      let admissoes = 0;
      let demissoes = 0;
      let saldos = 0;
      for (const r of rows) {
        admissoes += Number(r["Admissões"]) || 0;
        demissoes += Number(r["Demissões"]) || 0;
        saldos += Number(r["Saldos"]) || 0;
      }
      setChartData([
        { label: "Admissões", value: admissoes },
        { label: "Demissões", value: demissoes },
      ]);
      setSaldo(saldos);
    });
  }, [year]);

  if (!chartData) return <GraphSkeleton />;

  const hasData = chartData.some((d) => d.value > 0);

  return (
    <PanoramaCard title="Movimentação de Empregos" subtitle={`Saldo: ${saldo.toLocaleString("pt-BR")} vagas`}>
      {!hasData ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          Sem dados de empregos para {year}.
        </p>
      ) : (
        <VerticalScrollableBarChart
          data={chartData}
          xKey="label"
          colors={ColorPalette.default}
          bars={[{ dataKey: "value", name: "Pessoas" }]}
          highlightValues={[]}
          visibleHeight={280}
          widthY={130}
        />
      )}
    </PanoramaCard>
  );
};

export default EmpregosMovimentacao;
