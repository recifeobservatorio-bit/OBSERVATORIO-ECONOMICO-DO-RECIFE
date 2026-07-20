"use client";

import { useEffect, useState } from "react";

import { EmpregosData } from "@/@api/http/to-charts/empregos/EmpregosData";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const YEAR = "2026";

const EmpregosMovimentacao = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    new EmpregosData(YEAR).fetchProcessedDataCaged().then((rows: any[]) => {
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
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="Movimentação de Empregos" subtitle={`Saldo: ${saldo.toLocaleString("pt-BR")} vagas`}>
      <VerticalScrollableBarChart
        data={chartData}
        xKey="label"
        colors={ColorPalette.default}
        bars={[{ dataKey: "value", name: "Pessoas" }]}
        highlightValues={[]}
        visibleHeight={280}
        widthY={130}
      />
    </PanoramaCard>
  );
};

export default EmpregosMovimentacao;
