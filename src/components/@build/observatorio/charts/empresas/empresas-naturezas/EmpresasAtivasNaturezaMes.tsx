"use client";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Aba "Empresas Naturezas" exige ano + mês juntos, então essa linha do tempo mostra só a
// visão por mês (sem o toggle Mês/Ano) — visão por ano isolado foi removida de propósito.
const EmpresasAtivasNaturezaMes = ({
  data,
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Ativas no Recife",
  }: any) => {
    // Ignora o filtro de mês (data.rawData.mes já vem sem esse filtro aplicado) e mostra
    // todos os meses do ano selecionado no filtro.
    const monthValues = data['rawData']?.['mes']?.['mes']
    const chartData = getObjToArr<number>(monthValues || {}).sort((a, b) => +a.label - +b.label).map((dataMap) => ({ ...dataMap, label: monthShortName(+dataMap.label)}))

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "value", name: "Empresas Ativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasAtivasNaturezaMes;
