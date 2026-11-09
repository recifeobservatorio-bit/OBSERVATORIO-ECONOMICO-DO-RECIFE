"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { processEmpresasDataLineGraphPorAnoMes } from "@/functions/process_data/observatorio/empresas/empresas-tempo-abertura/empresasDataLineGraph";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import { getGroupValues } from "@/utils/filters/@global/getUniqueValues";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const COLUNA = "Tempo Médio de Abertura";

const EmpresasMediaMesTempoAbertura = ({
  colors = ColorPalette.default,
  toCompare,
  title = "Tempo Médio de Abertura de Empresas (Horas)",
  }: any) => {
    const [anoRows, setAnoRows] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsTempoMedio().then((rows) => {
        if (cancelled) return;
        setAnoRows(rows);
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (!anoRows) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // Série histórica completa (todos os anos), agrupada por mês — um gráfico de linha nunca
    // deve obedecer ao filtro de mês/ano, senão a série colapsa num ponto só.
    const chartData = processEmpresasDataLineGraphPorAnoMes(getGroupValues(anoRows ?? [], "Municipio"), toCompare ?? [], COLUNA)

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            colors={colors}
            xKey="label"
            lines={[...getDateKeys(toCompare ?? [])]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMediaMesTempoAbertura;
