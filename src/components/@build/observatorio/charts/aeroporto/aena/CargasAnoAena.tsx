"use client";

import { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AenaCargasHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { useDashboard } from "@/context/DashboardContext";
import { processCargaPorMesAena } from "@/functions/process_data/observatorio/aeroporto/aena/cargasPorMesAena";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const CargasAnoAena = ({
    colors = ColorPalette.default,
    title = "Cargas ao Longo do Ano",
  }: ChartBuild<AenaCargasHeaders[]>) => {
    const { filters } = useDashboard();
    const [chartData, setChartData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      // Série histórica completa (todos os anos) — um gráfico de linha nunca deve obedecer
      // ao filtro de ano/mês, senão a série colapsa num ponto só ou fica restrita a um ano.
      new AeroportoData("").fetchAllYearsAenaCargas().then((rows) => {
        if (cancelled) return;
        const filtered = applyGenericFilters(rows, filters, ["Mês"]).filteredData;
        setChartData(processCargaPorMesAena(filtered));
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
            lines={[{ dataKey: "quantidade", name: "Cargas (ton)", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default CargasAnoAena;
