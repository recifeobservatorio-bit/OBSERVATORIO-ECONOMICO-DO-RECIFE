"use client";

import React, { useState } from "react";

import { RawDataPortos } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { processAtracacoesPorAno } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoPorAno";
import { processAtracacoesPorMes } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoPorMes";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const OperacaoCargasAno = ({
  data,
  porto,
  colors = ColorPalette.default,
  title = "Movimentação de Cargas (Ton)"  + ` - ${porto}`,
  months
}: ChartBuild<RawDataPortos>) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData = processAtracacoesPorMes(data.atracacao, data.carga)
  const updatedMesData = updatedMonthChartData(mesChartData, months ?? 1);

  const anoChartData = processAtracacoesPorAno(data.atracacaoPorAno ?? [], data.cargaPorAno ?? []);

  const updatedData = mode === "ano" ? anoChartData : updatedMesData;
  const xKey = mode === "ano" ? "ano" : "mes";

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={updatedData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
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
