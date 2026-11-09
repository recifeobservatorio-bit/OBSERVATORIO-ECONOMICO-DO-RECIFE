"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Cada linha já é uma locação (diferente de RFC Produções, sem dedupe por ID) — conta por mês da
// DATA DA AUTORIZAÇÃO. Usa dataSemMes (ignora o filtro de Mês) — um gráfico de linha nunca deve
// obedecer ao filtro de mês, senão a série colapsa num ponto só quando um mês é selecionado.
const LocacoesAoLongoDoTempo = ({ data = [], dataSemMes, title = "Locações Autorizadas" }: any) => {
  const porMes: Record<string, number> = {};
  for (const item of (dataSemMes ?? data)) {
    const dataAutorizacao = item["DATA DA AUTORIZAÇÃO"];
    if (!dataAutorizacao) continue;
    const date = new Date(dataAutorizacao);
    const mesAno = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    porMes[mesAno] = (porMes[mesAno] || 0) + 1;
  }

  const chartData = Object.entries(porMes)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([mesAno, value]) => {
      const [ano, mes] = mesAno.split("-");
      return { label: `${monthShortName(+mes)}/${ano.slice(2)}`, value };
    });

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={ColorPalette.default}
          xKey="label"
          lines={[{ dataKey: "value", name: "Locações", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default LocacoesAoLongoDoTempo;
