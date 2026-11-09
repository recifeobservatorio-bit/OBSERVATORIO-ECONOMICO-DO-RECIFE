"use client";

import React from "react";

import { PortoGeralData } from "@/@types/observatorio/@data/portoData";
import { PortoAtracacaoHeaders } from "@/@types/observatorio/@fetch/porto";
import { ChartBuild } from "@/@types/observatorio/shared";
import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processAtracacoesPorCarga } from "@/functions/process_data/observatorio/porto/geral/charts/transacaoProdutos";
import { getPortoProductNameByCode } from "@/utils/formatters/getPortoProductNameByCode";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PrincipaisProdutos = ({
  data,
  title = "Produtos Comercializados (Ton)",
}: ChartBuild<PortoGeralData>) => {
  
  const chartData = getPortoProductNameByCode(processAtracacoesPorCarga(data.atracacao as PortoAtracacaoHeaders[], data.carga), data.dictionaries.mercado)

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="CDMercadoria"
          bars={[{ dataKey: "totalVLPesoCargaBruta", name: "Carga (Ton)" }]}
          colors={ColorPalette.default}
          heightPerCategory={40}
        />
      </ChartGrabber>
    </div>
  );
};

export default PrincipaisProdutos;
