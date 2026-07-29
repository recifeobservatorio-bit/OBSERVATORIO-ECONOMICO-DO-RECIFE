"use client";

import React, { useState } from "react";

import { PortoGeralData } from "@/@types/observatorio/@data/portoData";
import { PortoAtracacaoHeaders } from "@/@types/observatorio/@fetch/porto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { processAtracacoesPorAno } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoPorAno";
import { processAtracacoesPorMes } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoPorMes";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const CargasAno = ({
  data,
  colors = ColorPalette.default,
  title = "Movimentação de Cargas (Ton)",
  months
}: ChartBuild<PortoGeralData>) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData = processAtracacoesPorMes(
    (data.atracacaoSemMes ?? data.atracacao) as PortoAtracacaoHeaders[],
    data.cargaSemMes ?? data.carga
  )
  const updatedMesData = updatedMonthChartData(mesChartData, months?.options.length);

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
            { dataKey: "totalVLPesoCargaBruta", name: "Carga (Ton)", strokeWidth: 2 },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default CargasAno;
