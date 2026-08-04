"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { processEmpresasDataLineGraph, processEmpresasDataLineGraphPorAno } from "@/functions/process_data/observatorio/empresas/empresas-tempo-abertura/empresasDataLineGraph";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import { getGroupValues } from "@/utils/filters/@global/getUniqueValues";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const COLUNA = "Tempo Médio de Abertura";

const EmpresasMediaMesTempoAbertura = ({
  data,
  colors = ColorPalette.default,
  toCompare,
  title = "Tempo Médio de Abertura de Empresas (Horas)",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
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

    if (mode === "ano" && !anoRows) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // "Ano" busca a série histórica multianual (2021-2025), com a média das linhas de cada ano
    // por município; "Mês" respeita os filtros selecionados (data.empresas já vem filtrado).
    const chartData = mode === "ano"
      ? processEmpresasDataLineGraphPorAno(getGroupValues(anoRows ?? [], "Municipio"), toCompare ?? [], COLUNA)
      : processEmpresasDataLineGraph(data['empresas'], toCompare, COLUNA).map((obj) => ({ ...obj, label: monthShortName(+obj.label) }))

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey="label"
            lines={[...getDateKeys(toCompare ?? [])]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMediaMesTempoAbertura;
