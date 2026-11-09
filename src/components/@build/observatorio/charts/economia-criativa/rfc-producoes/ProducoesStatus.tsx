"use client";

import React from "react";

import TreeMapChart from "@/components/@global/charts/TreeMapChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { contarObrasPor } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Cores do relatório de referência: Aprovado verde-água, Desistiu da gravação vermelho.
const STATUS_CORES: Record<string, string> = { Aprovado: "#1AB394", "Desistiu da gravação": "#E81123" };

const ProducoesStatus = ({ data = [], title = "Status das Produções" }: any) => {
  const acc = contarObrasPor(data, ["Status Autorização"]);
  const chartData = getObjToArr<number>(acc["Status Autorização"] || {}).sort((a, b) => b.value - a.value);
  const colors = chartData.map((item, i) => STATUS_CORES[item.label] ?? ColorPalette.default[i]);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <TreeMapChart data={chartData} title={title} colors={colors} xKey="label" dataKey="value" />
      </ChartGrabber>
    </div>
  );
};

export default ProducoesStatus;
