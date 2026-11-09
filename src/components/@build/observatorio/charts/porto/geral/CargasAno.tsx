"use client";

import React from "react";

import { PortoGeralData } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processAtracacoesPorMesTodosAnos } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoPorAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const CargasAno = ({
  data,
  colors = ColorPalette.default,
  title = "Movimentação de Cargas (Ton)",
}: ChartBuild<PortoGeralData>) => {
  const updatedData = processAtracacoesPorMesTodosAnos(data.atracacaoPorAno ?? [], data.cargaPorAno ?? []);
  const xKey = "mes";

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={updatedData}
          title={title}
          colors={colors}
          xKey={xKey}
          lines={[
            { dataKey: "totalVLPesoCargaBruta", name: "Carga (Ton)", strokeWidth: 2 },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default CargasAno;
