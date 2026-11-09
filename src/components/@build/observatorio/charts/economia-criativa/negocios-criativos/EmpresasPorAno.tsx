"use client";

import React, { useEffect, useState } from "react";

import { fetchCnaeHistoricoRaw } from "@/@api/http/to-charts/economia-criativa/CnaeHistoricoData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// O `data` recebido via prop já vem filtrado pelo Ano selecionado (default 2025) — pra montar a
// série 2023-2025 este gráfico busca o parquet completo direto (mesmo cache em módulo de
// CnaeHistoricoData.ts, então não duplica fetch de rede se outro componente já carregou).
const EmpresasPorAno = ({
  title = "Total de Empresas por Ano",
}: any) => {
  const [chartData, setChartData] = useState<{ label: string; value: number; tendencia?: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = (await fetchCnaeHistoricoRaw()) || [];
      const porAno: Record<string, number> = {};
      for (const r of rows) {
        const ano = r["Ano"];
        if (!ano) continue;
        porAno[ano] = (porAno[ano] || 0) + 1;
      }

      const anos = Object.keys(porAno).sort();
      const n = anos.length;
      const ys = anos.map((a) => porAno[a]);
      const xs = anos.map((_, i) => i);
      const xMean = xs.reduce((a, b) => a + b, 0) / n;
      const yMean = ys.reduce((a, b) => a + b, 0) / n;
      const den = xs.reduce((acc, x) => acc + (x - xMean) ** 2, 0);
      const slope = den ? xs.reduce((acc, x, i) => acc + (x - xMean) * (ys[i] - yMean), 0) / den : 0;
      const intercept = yMean - slope * xMean;

      const result = anos.map((ano, i) => ({ label: ano, value: porAno[ano], tendencia: Math.round(intercept + slope * i) }));
      if (!cancelled) setChartData(result);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={ColorPalette.default}
          xKey="label"
          lines={[
            { dataKey: "value", name: "Empresas", strokeWidth: 2 },
            { dataKey: "tendencia", name: "Tendência", strokeWidth: 2, dashed: true, showDots: false },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasPorAno;
