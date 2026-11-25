"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Análise Comparativa da Variação do Saldo" do Power BI: saldo mensal (ano filtrado)
// de cada município escolhido na busca da aba Comparativo.
const VariacaoSaldoComparativo = ({
  data = [],
  municipios = [],
  year,
  colors = ColorPalette.default,
  title = "Análise Comparativa da Variação do Saldo",
}: any) => {
  const selected: string[] = municipios.filter(Boolean);
  const byMes = new Map<number, any>();
  (data as any[]).forEach((r) => {
    if (!selected.includes(r.Municipio)) return;
    const mes = Number(r.Mes);
    if (!(mes >= 1 && mes <= 12)) return;
    if (!byMes.has(mes)) {
      const row: any = { mes, label: monthShortName(mes) };
      selected.forEach((m) => (row[m] = 0));
      byMes.set(mes, row);
    }
    byMes.get(mes)[r.Municipio] += Number(r.Saldos) || 0;
  });
  const chartData = Array.from(byMes.values()).sort((a, b) => a.mes - b.mes);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={`${title}${year ? ` - ${year}` : ""}`}
          colors={colors}
          xKey="label"
          lines={selected.map((m) => ({ dataKey: m, name: m, strokeWidth: 2 }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default VariacaoSaldoComparativo;
