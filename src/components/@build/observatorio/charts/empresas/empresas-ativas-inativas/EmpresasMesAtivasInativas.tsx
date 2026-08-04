"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMesAtivasInativas = ({
  data,
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Ativas e Inativas",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const [anoRows, setAnoRows] = useState<{ ativas: any[]; inativas: any[] } | null>(null);

    useEffect(() => {
      let cancelled = false;
      Promise.all([
        new EmpresasData("").fetchAllYearsEmpresasAtivas(),
        new EmpresasData("").fetchAllYearsEmpresasInativas(),
      ]).then(([ativas, inativas]) => {
        if (cancelled) return;
        setAnoRows({ ativas, inativas });
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

    let chartData: any[] = []

    if (mode === "ano") {
      // Série histórica multianual — um ponto por ano, ignora os filtros de ano/mês da aba.
      const byYear = new Map<string, any>()

      ;(anoRows?.ativas || []).forEach((r: any) => {
        if (r['Ano'] == null) return
        const ano = String(r['Ano'])
        if (!byYear.has(ano)) byYear.set(ano, { label: ano, ativa: 0, inativa: 0 })
        byYear.get(ano).ativa += 1
      })

      ;(anoRows?.inativas || []).forEach((r: any) => {
        if (r['Ano'] == null) return
        const ano = String(r['Ano'])
        if (!byYear.has(ano)) byYear.set(ano, { label: ano, ativa: 0, inativa: 0 })
        byYear.get(ano).inativa += 1
      })

      chartData = Array.from(byYear.values()).sort((a, b) => +a.label - +b.label)
    } else {
      // "Mês" respeita o filtro de mês selecionado (mesFiltrado já vem filtrado assim).
      const ativasData = data['ativas']?.['mesFiltrado'] || {};
      const inativasData = data['inativas']?.['mesFiltrado'] || {};

      const uniqueArrays = Array.from(new Set([...Object.keys(ativasData), ...Object.keys(inativasData)]))

      chartData = uniqueArrays.map((key: string) => {
        const ativaNum = ativasData[key] || 0
        const inativaNum = inativasData[key] || 0

        return { label: key, ativa: ativaNum, inativa: inativaNum }
      }).sort((a, b) => +a['label'] - +b['label']).map((obj) => ({ ...obj, label: monthShortName(+obj.label) }))
    }

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "ativa", name: "Empresas Ativas", strokeWidth: 2 }, { dataKey: "inativa", name: "Empresas Inativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMesAtivasInativas;
