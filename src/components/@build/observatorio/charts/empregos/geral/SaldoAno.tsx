"use client";

import React, { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const SaldoAno = ({
  data,
  nameKey = "Mês",
  colors = ColorPalette.default,
  title = "Saldo ao Longo do Ano",
  months,
}: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData = (data['municipios'] ?? []).sort((a: any, b: any) => a["Mes"] - b["Mes"]).map((data: any) => ({ ...data, "Mês": monthShortName(data['Mes'])}));
  const updatedMesData = updatedMonthChartData(mesChartData, months ?? 1);

  const anoChartData = data['municipiosPorAno'] ?? [];

  const updatedData = mode === "ano" ? anoChartData : updatedMesData;
  const xKey = mode === "ano" ? "Ano" : nameKey;

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={updatedData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={colors}
          xKey={xKey}
          lines={[{ dataKey: "Saldos", name: "Saldo", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default SaldoAno;
