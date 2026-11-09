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
  title = "Quantidade de Empresas Ativas e Inativas",
  }: any) => {
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

    if (!anoRows) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // Série histórica completa (todos os anos), agrupada por mês — ignora os filtros de
    // ano/mês da aba (um gráfico de linha nunca deve obedecer a eles, senão a série colapsa
    // num ponto só).
    const byYearMonth = new Map<string, any>()
    const order = new Map<string, number>()

    ;(anoRows?.ativas || []).forEach((r: any) => {
      if (r['Ano'] == null) return
      const mes = monthOptionIndex(r['mes'])
      if (mes < 1 || mes > 12) return
      const key = `${r['Ano']}-${mes}`
      const label = `${monthShortName(mes)}/${r['Ano']}`
      if (!byYearMonth.has(key)) byYearMonth.set(key, { label, ativa: 0, inativa: 0 })
      byYearMonth.get(key).ativa += 1
      order.set(key, r['Ano'] * 100 + mes)
    })

    ;(anoRows?.inativas || []).forEach((r: any) => {
      if (r['Ano'] == null) return
      const mes = monthOptionIndex(r['mes'])
      if (mes < 1 || mes > 12) return
      const key = `${r['Ano']}-${mes}`
      const label = `${monthShortName(mes)}/${r['Ano']}`
      if (!byYearMonth.has(key)) byYearMonth.set(key, { label, ativa: 0, inativa: 0 })
      byYearMonth.get(key).inativa += 1
      order.set(key, r['Ano'] * 100 + mes)
    })

    const chartData = Array.from(byYearMonth.entries())
      .sort((a, b) => (order.get(a[0]) ?? 0) - (order.get(b[0]) ?? 0))
      .map(([, value]) => value)

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "ativa", name: "Empresas Ativas", strokeWidth: 2 }, { dataKey: "inativa", name: "Empresas Inativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMesAtivasInativas;
