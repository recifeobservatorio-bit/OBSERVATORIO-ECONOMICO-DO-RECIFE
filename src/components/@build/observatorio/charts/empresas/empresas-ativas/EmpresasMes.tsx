"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { countByAno } from "@/functions/process_data/observatorio/empresas/countByAno";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMes = ({
  data,
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Ativas no Recife",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const [anoData, setAnoData] = useState<{ ano: string; value: number }[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsEmpresasAtivas().then((rows) => {
        if (cancelled) return;
        setAnoData(countByAno(rows));
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

    // "Mês" respeita o filtro de mês selecionado (data.mesFiltrado já vem filtrado assim);
    // "Ano" busca a série histórica multianual acima, um ponto por ano.
    const mesChartData = getObjToArr<number>(data["mesFiltrado"] || {}).sort((a, b) => +a.label - +b.label).map((dataMap) => ({ ...dataMap, label: monthShortName(+dataMap.label)}))

    const chartData = mode === "ano" ? anoData ?? [] : mesChartData
    const xKey = mode === "ano" ? "ano" : "label"

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey={xKey}
            lines={[{ dataKey: "value", name: "Empresas Ativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default EmpresasMes;
