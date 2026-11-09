"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMesAtivasInativas = ({
  colors = [ColorPalette.status.good, ColorPalette.status.badLine],
  municipio,
  title = "Quantidade de Empresas Abertas e Fechadas",
  }: any) => {
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

    if (!anoRows) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // Série histórica multianual (empresas_abertas.parquet / empresas_fechadas.parquet têm
    // 2021-2026), agrupada por mês — ignora o filtro de ano/mês da aba, filtra só pelo
    // município selecionado.
    const byYearMonth = new Map<string, any>()
    const order = new Map<string, number>()

    ;(anoRows?.abertas || []).filter((r: any) => r['Município'] === municipio).forEach((r: any) => {
      const mes = monthOptionIndex(r['mes'])
      if (r['Ano'] == null || mes < 1 || mes > 12) return
      const key = `${r['Ano']}-${mes}`
      const label = `${monthShortName(mes)}/${r['Ano']}`
      if (!byYearMonth.has(key)) byYearMonth.set(key, { label, ativa: 0, inativa: 0 })
      byYearMonth.get(key).ativa += r['Quantidade de Empresas'] || 0
      order.set(key, r['Ano'] * 100 + mes)
    })

    ;(anoRows?.fechadas || []).filter((r: any) => r['Município'] === municipio).forEach((r: any) => {
      const mes = monthOptionIndex(r['mes'])
      if (r['Ano de Baixa'] == null || mes < 1 || mes > 12) return
      const key = `${r['Ano de Baixa']}-${mes}`
      const label = `${monthShortName(mes)}/${r['Ano de Baixa']}`
      if (!byYearMonth.has(key)) byYearMonth.set(key, { label, ativa: 0, inativa: 0 })
      byYearMonth.get(key).inativa += r['Quantidade de Empresas'] || 0
      order.set(key, r['Ano de Baixa'] * 100 + mes)
    })

    const chartData = Array.from(byYearMonth.entries())
      .sort((a, b) => (order.get(a[0]) ?? 0) - (order.get(b[0]) ?? 0))
      .map(([, value]) => value)

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title + ` - (${municipio})`}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "ativa", name: "Empresas Ativas", strokeWidth: 2 }, { dataKey: "inativa", name: "Empresas Inativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMesAtivasInativas;
