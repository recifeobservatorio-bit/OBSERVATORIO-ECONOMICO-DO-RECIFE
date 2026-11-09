"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { dataSolicitacao, dedupeProducoesPorMes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Agrupa por mês da DATA DA SOLICITAÇÃO somando pessoas envolvidas (cada obra uma vez por mês) —
// mesma lógica de "Pessoas envolvidas nas Produções" do relatório de referência, que bate ponto a
// ponto com ele, ordenado cronologicamente (não por número
// de mês isolado, já que o período cobre mais de 12 meses). O parquet reader entrega colunas DATE
// como algo aceito por `new Date(...)` (mesmo padrão de EmpresasPorAno.tsx / EmpresasData.ts),
// não uma string ISO pronta pra slice.
// Usa dataSemMes (ignora o filtro de Mês) — um gráfico de linha nunca deve obedecer ao filtro de
// mês, senão a série colapsa num ponto só quando um mês é selecionado.
const ProducoesAoLongoDoTempo = ({ data = [], dataSemMes, title = "Pessoas envolvidas nas Produções" }: any) => {
  const producoes = dedupeProducoesPorMes(dataSemMes ?? data);

  const porMes: Record<string, number> = {};
  for (const item of producoes) {
    const date = dataSolicitacao(item);
    if (!date) continue;
    const mesAno = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    porMes[mesAno] = (porMes[mesAno] || 0) + (item["QTD. DE PESSOAS NA EQUIPE"] || 0);
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
          lines={[{ dataKey: "value", name: "Pessoas Envolvidas", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default ProducoesAoLongoDoTempo;
