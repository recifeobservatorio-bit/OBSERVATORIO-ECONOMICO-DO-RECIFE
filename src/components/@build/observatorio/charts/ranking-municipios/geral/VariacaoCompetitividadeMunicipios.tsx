"use client";

import React from "react";

import WaterfallChart from "@/components/@global/charts/WaterfallChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processVariacaoPosicao } from "@/functions/process_data/observatorio/ranking-municipios/geral/charts/variacaoCompetitividadeMunicipios";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

interface Props {
  data: any[];  // filteredData
  colors?: string[];
  title?: string;
}

const GraficoMunicipiosPorAno: React.FC<Props> = ({
  data = [],
  colors = ColorPalette.default,
  title = "Variação da Posição no Ranking Geral de Competitividade dos Municípios",
}) => {
  const chartData = processVariacaoPosicao(data);

  if (!chartData || chartData.length === 0) {
    return <p>Nenhum dado disponível.</p>;
  }

  const allKeys = Object.keys(chartData[0]);
  const municipios = allKeys.filter((key) => key !== "ano");

  // Cascata como no Power BI: um município por vez (Recife, se estiver nos dados filtrados).
  const municipio = municipios.find((m) => /recife/i.test(m)) ?? municipios[0];
  const waterfallData = chartData.map((row: any) => ({ ano: row.ano, delta: Number(row[municipio]) || 0 }));

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <WaterfallChart
          data={waterfallData}
          title={`${title} - ${municipio}`}
          xKey="ano"
          valueKey="delta"
          totalLabel="Acumulado"
        />
      </ChartGrabber>
    </div>
  );
};

export default GraficoMunicipiosPorAno;
