"use client";

import React from "react";

import { RawDataPortos } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processAtracacoesPorMesTodosAnos } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoPorAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const OperacaoCargasAno = ({
  data,
  porto,
  colors = ColorPalette.default,
  title = "Movimentação de Cargas (Ton)"  + ` - ${porto}`,
}: ChartBuild<RawDataPortos>) => {
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
            { dataKey: "cabotagemCarga", name: "Cabotagem (Ton)", strokeWidth: 2 },
            { dataKey: "exportacaoCarga", name: "Exportação (Ton)", strokeWidth: 2 },
            { dataKey: "importacaoCarga", name: "Importação (Ton)", strokeWidth: 2 },
            { dataKey: "outrosCarga", name: "outros (Ton)", strokeWidth: 2 },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default OperacaoCargasAno;
