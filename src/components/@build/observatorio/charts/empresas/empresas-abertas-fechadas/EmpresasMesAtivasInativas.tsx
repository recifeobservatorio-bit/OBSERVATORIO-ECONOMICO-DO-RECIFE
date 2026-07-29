"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMesAtivasInativas = ({
  data,
  colors = ColorPalette.default,
  municipio,
  title = "Quantidade de Empresas Abertas e Fechadas",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const monthKey = mode === "mes" ? "mesFiltrado" : "mes";

    const dataAtivas = data?.['ativas']?.[monthKey] || {}
    const dataInativas = data?.['inativas']?.[monthKey] || {}

    const uniqueArrays = Array.from(new Set([...Object.keys(dataAtivas), ...Object.keys(dataInativas)]))

    const chartData = uniqueArrays.map((key: string) => {
      const ativaNum = dataAtivas[key] || 0
      const inativaNum = dataInativas[key] || 0

      return { label: key, ativa: ativaNum, inativa: inativaNum }
    }).sort((a, b) => +a['label'] - +b['label']).map((obj) => ({ ...obj, label: monthShortName(+obj.label) }))

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title + ` - (${municipio})`}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "ativa", name: "Empresas Ativas", strokeWidth: 2 }, { dataKey: "inativa", name: "Empresas Inativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMesAtivasInativas;
