"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasAtivasClassesMes = ({
  data,
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Classes no Recife",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");

    // "Ano" ignora o filtro de mês (data.rawData.mes já vem sem esse filtro aplicado);
    // "Mês" respeita o filtro de mês selecionado (data.empresas já vem filtrado por tudo).
    const monthValues = mode === "mes" ? data['empresas']?.['mes'] : data['rawData']?.['mes']?.['mes']

    const chartData = getObjToArr<number>(monthValues || {}).sort((a, b) => +a.label - +b.label).map((dataMap) => ({ ...dataMap, label: monthShortName(+dataMap.label)}))

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "value", name: "Empresas Ativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default EmpresasAtivasClassesMes;
