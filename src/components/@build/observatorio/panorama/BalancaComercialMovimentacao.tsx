"use client";

import { useEffect, useState } from "react";

import { BalancaComercialData } from "@/@api/http/to-charts/bal_comercial/BalancaComercialData";
import BarChart from "@/components/@global/charts/BarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const BalancaComercialMovimentacao = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    setChartData(null);
    new BalancaComercialData(year).fetchProcessedData().then((rows: any[]) => {
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
  }, [year]);

  if (!chartData) return <GraphSkeleton />;

  const hasData = chartData.some((d) => d.exportacao > 0 || d.importacao > 0);

  return (
    <PanoramaCard
      title="Balança Comercial (Importação / Exportação)"
      subtitle={`Saldo: US$ ${saldo.toLocaleString("pt-BR")}`}
    >
      {!hasData ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          Sem dados de balança comercial para {year}.
        </p>
      ) : (
        <BarChart
          data={chartData}
          xKey="label"
          colors={ColorPalette.default}
          bars={[
            { dataKey: "exportacao", name: "Exportação" },
            { dataKey: "importacao", name: "Importação" },
          ]}
        />
      )}
    </PanoramaCard>
  );
};

export default BalancaComercialMovimentacao;
