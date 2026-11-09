"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Classe" já vem pronta em dados_recife_cnae_historico.parquet (Publicidade e serviços
// empresariais, Desenvolvimento de Softwares e Jogos Digitais...), validada batendo exata com o
// relatório de referência.
const EmpresasPorClasse = ({
  data = [],
  title = "Total de Empresas Criativas por Classe",
}: any) => {
  const acc = geralAccFunction(data, ["Classe"]);
  const chartData = getObjToArr<number>(acc["Classe"] || {}).sort((a, b) => b.value - a.value);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasPorClasse;
