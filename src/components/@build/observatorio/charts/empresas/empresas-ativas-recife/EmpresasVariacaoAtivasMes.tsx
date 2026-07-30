"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { processVariacaoEmpresasAtivasPorAno } from "@/functions/process_data/observatorio/empresas/empresas-ativas-recife/variacaoEmpresasAtivasPorAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const VariacaoEmpresasAtivasRecife = ({
  data = [],
  dataSemMes,
  colors = ColorPalette.default,
  title = "Variação de Empresas Ativas no Recife",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const [anoData, setAnoData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsEmpresasAtivasRecife().then((rows) => {
        if (cancelled) return;
        setAnoData(processVariacaoEmpresasAtivasPorAno(rows));
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

    // Usa dataSemMes (ignora o filtro de MÊS) — precisa enxergar todos os meses pra achar
    // o mês anterior de cada linha, mesmo que o usuário tenha filtrado por um único mês.
    const baseData = dataSemMes ?? data
    const sortedMesData = [...baseData].sort((a: any, b: any) => a['mes'] - b['mes'])
    const mesChartData = sortedMesData.map((dataMap: any) => {
        const mesAnterior = sortedMesData.find((item: any) => item['mes'] === dataMap['mes'] - 1)
        if (mesAnterior) {
           return { mes: dataMap['Mês'], empresas: (((dataMap['Empresas Ativas'] - mesAnterior['Empresas Ativas']) / mesAnterior['Empresas Ativas']) * 100).toFixed(2) }
        }
    }).filter((data: any) => !!data);
    const chartData = mode === "ano" ? anoData : mesChartData;
    const xKey = mode === "ano" ? "ano" : "mes";

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey={xKey}
            lines={[{ dataKey: "empresas", name: "Variação de Empresas Ativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default VariacaoEmpresasAtivasRecife;
