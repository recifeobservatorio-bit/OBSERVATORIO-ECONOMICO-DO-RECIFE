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
  municipio,
  title = "Quantidade de Empresas Abertas e Fechadas",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const [anoRows, setAnoRows] = useState<{ abertas: any[]; fechadas: any[] } | null>(null);

    useEffect(() => {
      let cancelled = false;
      Promise.all([
        new EmpresasData("").fetchAllYearsAbertas(),
        new EmpresasData("").fetchAllYearsFechadas(),
      ]).then(([abertas, fechadas]) => {
        if (cancelled) return;
        setAnoRows({ abertas, fechadas });
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
      // Série histórica multianual (empresas_abertas.parquet / empresas_fechadas.parquet têm
      // 2021-2026) — ignora o filtro de ano/mês da aba, filtra só pelo município selecionado.
      const byYear = new Map<string, any>()

      ;(anoRows?.abertas || []).filter((r: any) => r['Município'] === municipio).forEach((r: any) => {
        const ano = String(r['Ano'])
        if (!byYear.has(ano)) byYear.set(ano, { label: ano, ativa: 0, inativa: 0 })
        byYear.get(ano).ativa += r['Quantidade de Empresas'] || 0
      })

      ;(anoRows?.fechadas || []).filter((r: any) => r['Município'] === municipio).forEach((r: any) => {
        const ano = String(r['Ano de Baixa'])
        if (!byYear.has(ano)) byYear.set(ano, { label: ano, ativa: 0, inativa: 0 })
        byYear.get(ano).inativa += r['Quantidade de Empresas'] || 0
      })

      chartData = Array.from(byYear.values()).sort((a, b) => +a.label - +b.label)
    } else {
      // "Mês" ignora o filtro de mês ('mes' já vem sem esse filtro aplicado) e mostra todos
      // os meses do ano selecionado no filtro.
      const dataAtivas = data?.['ativas']?.['mes'] || {}
      const dataInativas = data?.['inativas']?.['mes'] || {}

      const uniqueArrays = Array.from(new Set([...Object.keys(dataAtivas), ...Object.keys(dataInativas)]))

      chartData = uniqueArrays.map((key: string) => {
        const ativaNum = dataAtivas[key] || 0
        const inativaNum = dataInativas[key] || 0

        return { label: key, ativa: ativaNum, inativa: inativaNum }
      }).sort((a, b) => +a['label'] - +b['label']).map((obj) => ({ ...obj, label: monthShortName(+obj.label) }))
    }

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title + ` - (${municipio})`}
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
