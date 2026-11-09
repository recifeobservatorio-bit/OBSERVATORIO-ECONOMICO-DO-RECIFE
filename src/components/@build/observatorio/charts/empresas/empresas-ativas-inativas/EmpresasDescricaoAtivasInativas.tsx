"use client";

import React from "react";

import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";
import StackedBarChart from "@/components/@global/charts/StackedVerticalBarChart";

const EmpresasDescricaoAtivasInativas = ({
  data,
  colors = [ColorPalette.status.good, ColorPalette.status.bad],
  title = "Empresas por Descrição",
  year,
}: any) => {
  const uniqueArrays = Array.from(new Set([...Object.keys(data['ativas']['desc_atividade']), ...Object.keys(data['inativas']['desc_atividade'])]))

  const chartData = uniqueArrays.map((key: string) => {
    const ativaNum = data['ativas']['desc_atividade'][key] || 0
    const inativaNum = data['inativas']['desc_atividade'][key] || 0

    return { label: key, ativa: ativaNum, inativa: inativaNum } 
  }).sort((a, b) => (b['ativa'] + b['inativa']) - (a['ativa'] + a['inativa']))

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <StackedBarChart
        data={chartData}
        title={title}
        colors={colors}
        xKey="label"
        bars={[
          { 
            dataKey: "ativa", 
            name: "Ativas",
          },
          { 
            dataKey: "inativa", 
            name: "Inativas",
          },
        ]}
        tooltipEntry=""
        heightPerCategory={30} // Barra mais fina — cabem várias categorias sem ficar grossa
        // Esse card agora ocupa 2 linhas do grid (Mes + Bairro empilhados ao
        // lado) — sem isso o gráfico ficava pequeno, sobrando espaço vazio.
        visibleHeight={900}
        // Reduz a área das barras pra dar mais espaço ao nome da categoria.
        widthY={220}
        // Nome maior e mais legível — a área do gráfico encolhe pra caber.
        yFontSize={14}
        barSize={16}
      />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasDescricaoAtivasInativas;

