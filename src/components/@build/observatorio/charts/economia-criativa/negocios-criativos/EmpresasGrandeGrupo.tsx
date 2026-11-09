"use client";

import React, { useState } from "react";

import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { ShowPercentages } from "@/components/@global/features/ShowPercentages";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Grande Grupo" já vem pronto em dados_recife_cnae_historico.parquet (Serviços/Indústria,
// validado batendo exato com o relatório de referência) — não precisa mais derivar da divisão
// CNAE como na versão anterior baseada em Empresas.parquet.
const EmpresasGrandeGrupo = ({
  data = [],
  title = "Economia Criativa por Grande Grupo",
}: any) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const acc = geralAccFunction(data, ["Grande Grupo"]);
  const chartData = getObjToArr<number>(acc["Grande Grupo"] || {});

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <PieChart
          data={chartData}
          title={title}
          underTitle={
            <ShowPercentages showPercentage={showPercentage} setShowPercentage={setShowPercentage} />
          }
          dataKey="value"
          nameKey="label"
          colors={ColorPalette.default}
          showPercentages={showPercentage}
          tooltipEntry=""
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasGrandeGrupo;
