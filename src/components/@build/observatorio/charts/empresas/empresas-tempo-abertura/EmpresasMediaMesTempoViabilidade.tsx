"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { processEmpresasDataLineGraph } from "@/functions/process_data/observatorio/empresas/empresas-tempo-abertura/empresasDataLineGraph";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMediaMesTempoViabilidade = ({
  data,
  colors = ColorPalette.default,
  toCompare,
  title = "Tempo Médio de Viabilidade de Empresas (Horas)",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");

    // "Ano" ignora os filtros ativos (data.rawData é o ano inteiro sem filtro);
    // "Mês" respeita os filtros selecionados (data.empresas já vem filtrado).
    const dataCur = (mode === "mes" ? data['empresas'] : data['rawData']) || {}

    const chartData = processEmpresasDataLineGraph(dataCur, toCompare, 'Tempo Médio de Viabilidade').map((obj) => ({ ...obj, label: monthShortName(+obj.label) }))

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={colors}
            xKey="label"
            lines={[...getDateKeys(toCompare ?? [])]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasMediaMesTempoViabilidade;
