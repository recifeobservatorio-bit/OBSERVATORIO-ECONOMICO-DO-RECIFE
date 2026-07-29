"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMes = ({
  data,
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Inativas no Recife",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");

    const chartData = getObjToArr<number>(data[mode === "mes" ? "mesFiltrado" : "mes"] || {}).sort((a, b) => +a.label - +b.label).map((dataMap) => ({ ...dataMap, label: monthShortName(+dataMap.label)}))

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "value", name: "Empresas Inativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default EmpresasMes;
