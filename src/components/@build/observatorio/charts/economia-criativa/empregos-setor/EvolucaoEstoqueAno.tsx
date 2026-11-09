"use client";

import React, { useEffect, useState } from "react";

import { EconomiaCriativaRaisData } from "@/@api/http/to-charts/economia-criativa/EconomiaCriativaRaisData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ANOS = ["2021", "2022", "2023", "2024", "2025"];

// Único gráfico da Economia Criativa que precisa de todos os anos ao mesmo tempo — o resto da
// app carrega um ano por vez (filtro Ano do DashboardContext). Em vez de reestruturar esse fluxo
// pra toda a aplicação, este componente busca os 5 parquets diretamente (mesmo cache por ano do
// EconomiaCriativaRaisData, reaproveitado pelas outras abas/filtro de Ano — não duplica fetch).
const EvolucaoEstoqueAno = ({
  title = "Evolução do estoque por Ano",
}: any) => {
  const [chartData, setChartData] = useState<{ label: string; value: number; tendencia?: number }[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const porAno = await Promise.all(
        ANOS.map(async (ano) => {
          const rows = await new EconomiaCriativaRaisData(ano).fetchProcessedDataRais();
          const total = rows.filter((r: any) => r["Vínculo Ativo 31/12"] === "1").length;
          return { label: ano, value: total };
        })
      );

      // Linha de tendência: regressão linear simples (mínimos quadrados) sobre o índice do ano.
      const n = porAno.length;
      const xs = porAno.map((_, i) => i);
      const ys = porAno.map((d) => d.value);
      const xMean = xs.reduce((a, b) => a + b, 0) / n;
      const yMean = ys.reduce((a, b) => a + b, 0) / n;
      const den = xs.reduce((acc, x) => acc + (x - xMean) ** 2, 0);
      const slope = den ? xs.reduce((acc, x, i) => acc + (x - xMean) * (ys[i] - yMean), 0) / den : 0;
      const intercept = yMean - slope * xMean;

      const withTrend = porAno.map((d, i) => ({ ...d, tendencia: Math.round(intercept + slope * i) }));

      if (!cancelled) setChartData(withTrend);
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
            { dataKey: "value", name: "Estoque", strokeWidth: 2 },
            { dataKey: "tendencia", name: "Tendência", strokeWidth: 2, dashed: true, showDots: false },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default EvolucaoEstoqueAno;
