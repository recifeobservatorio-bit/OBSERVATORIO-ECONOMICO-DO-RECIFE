"use client";

import React, { useState } from "react";

import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { ShowPercentages } from "@/components/@global/features/ShowPercentages";
import { contarObrasPor } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Ordem e cores fixas do relatório de referência: Baixo vermelho, Médio bege, Alto verde-água.
const IMPACTO_ORDEM = ["Baixo Impacto", "Médio Impacto", "Alto Impacto"];
const IMPACTO_CORES = ["#E81123", "#EEDD99", "#1AB394"];

const ProducoesImpacto = ({ data = [], title = "Impacto das Filmagens na Rotina da Cidade" }: any) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const acc = contarObrasPor(data, ["PORTE DA PRODUÇÃO (AUTO-DECLARAÇÃO)"]);
  const rank = (label: string) => (IMPACTO_ORDEM.indexOf(label) === -1 ? 99 : IMPACTO_ORDEM.indexOf(label));
  const chartData = getObjToArr<number>(acc["PORTE DA PRODUÇÃO (AUTO-DECLARAÇÃO)"] || {}).sort((a, b) => rank(a.label) - rank(b.label));
  const colors = chartData.map((item, i) => IMPACTO_CORES[IMPACTO_ORDEM.indexOf(item.label)] ?? ColorPalette.default[i]);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <PieChart
          data={chartData}
          title={title}
          underTitle={<ShowPercentages showPercentage={showPercentage} setShowPercentage={setShowPercentage} />}
          dataKey="value"
          nameKey="label"
          colors={colors}
          showPercentages={showPercentage}
          tooltipEntry=""
        />
      </ChartGrabber>
    </div>
  );
};

export default ProducoesImpacto;
