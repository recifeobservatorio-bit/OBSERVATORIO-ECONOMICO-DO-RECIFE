"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { processEmpresasClassesPorAnoMes } from "@/functions/process_data/observatorio/empresas/empresas-classes/empresasClassesPorAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasAtivasClassesMes = ({
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Classes no Recife",
  }: any) => {
    const [anoData, setAnoData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsClasses().then((rows) => {
        if (cancelled) return;
        setAnoData(processEmpresasClassesPorAnoMes(rows));
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (!anoData) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // Série histórica completa (todos os anos), agrupada por mês — um gráfico de linha nunca
    // deve obedecer ao filtro de mês/ano, senão a série colapsa num ponto só.
    const chartData = anoData
    const xKey = "label"

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            colors={colors}
            xKey={xKey}
            lines={[{ dataKey: "empresas", name: "Empresas Ativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasAtivasClassesMes;
