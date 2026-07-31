"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { processEmpresasClassesPorAno } from "@/functions/process_data/observatorio/empresas/empresas-classes/empresasClassesPorAno";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasAtivasClassesMes = ({
  data,
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Classes no Recife",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const [anoData, setAnoData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsClasses().then((rows) => {
        if (cancelled) return;
        setAnoData(processEmpresasClassesPorAno(rows));
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (mode === "ano" && !anoData) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // "Mês" ignora o filtro de mês (data.rawData.mes já vem sem esse filtro aplicado) e mostra
    // todos os meses do ano selecionado no filtro; "Ano" busca a série histórica multianual,
    // com um ponto por ano.
    const monthValues = data['rawData']?.['mes']?.['mes']
    const mesChartData = getObjToArr<number>(monthValues || {}).sort((a, b) => +a.label - +b.label).map((dataMap) => ({ ...dataMap, label: monthShortName(+dataMap.label)}))

    const chartData = mode === "ano" ? anoData : mesChartData
    const xKey = mode === "ano" ? "ano" : "label"
    const dataKey = mode === "ano" ? "empresas" : "value"

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey={xKey}
            lines={[{ dataKey, name: "Empresas Ativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasAtivasClassesMes;
