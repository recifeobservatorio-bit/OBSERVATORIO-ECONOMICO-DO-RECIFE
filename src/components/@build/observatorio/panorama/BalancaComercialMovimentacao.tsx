"use client";

import { useEffect, useState } from "react";

import { BalancaComercialData } from "@/@api/http/to-charts/bal_comercial/BalancaComercialData";
import BarChart from "@/components/@global/charts/BarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const YEAR = "2026";

const BalancaComercialMovimentacao = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    new BalancaComercialData(YEAR).fetchProcessedData().then((rows: any[]) => {
      let exportacao = 0;
      let importacao = 0;
      for (const r of rows) {
        const valor = Number(r["Valor US$"]) || 0;
        if (r.tipo === "Exportação") exportacao += valor;
        else if (r.tipo === "Importação") importacao += valor;
      }
      setChartData([{ label: "Recife", exportacao, importacao }]);
      setSaldo(importacao - exportacao);
    });
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard
      title="Balança Comercial (Importação / Exportação)"
      subtitle={`Saldo: US$ ${saldo.toLocaleString("pt-BR")}`}
    >
      <BarChart
        data={chartData}
        xKey="label"
        colors={ColorPalette.default}
        bars={[
          { dataKey: "exportacao", name: "Exportação" },
          { dataKey: "importacao", name: "Importação" },
        ]}
      />
    </PanoramaCard>
  );
};

export default BalancaComercialMovimentacao;
