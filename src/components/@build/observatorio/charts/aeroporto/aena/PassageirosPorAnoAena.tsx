"use client";

import { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AenaPassageirosHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { useDashboard } from "@/context/DashboardContext";
import { processPassageirosPorMesAena } from "@/functions/process_data/observatorio/aeroporto/aena/passageirosPorMesAena";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosAnoAena = ({
  colors = ColorPalette.default,
  title = "Passageiros ao Longo do Ano",
  }: ChartBuild<AenaPassageirosHeaders[]>) => {
    const { filters } = useDashboard();
    const [chartData, setChartData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      // Série histórica completa (todos os anos) — um gráfico de linha nunca deve obedecer
      // ao filtro de ano/mês, senão a série colapsa num ponto só ou fica restrita a um ano.
      new AeroportoData("").fetchAllYearsAenaPassageiros().then((rows) => {
        if (cancelled) return;
        const filtered = applyGenericFilters(rows, filters, ["Mês"]).filteredData;
        setChartData(processPassageirosPorMesAena(filtered));
      });
      return () => {
        cancelled = true;
      };
    }, [filters]);

    if (!chartData) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            colors={colors}
            xKey="mes"
            lines={[{ dataKey: "passageiros", name: "Passageiros", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default PassageirosAnoAena;
