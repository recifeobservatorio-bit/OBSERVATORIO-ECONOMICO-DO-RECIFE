import React from "react";

const charts = [
  // Tela única, 2×2 como no Power BI: Mediana + Zona em cima, Bairro + Tabela
  // embaixo (com as seções em largura total a aba só cabia reduzida a ~80%).
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/tributos/itbiAvaliacoes/MedianaAvaliacoes")), title: "Mediana das Avaliações dos Imóveis" },
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/tributos/itbiAvaliacoes/MedianaPorZona")), title: "Valor Médio (Mediana) por Zona" },
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/tributos/itbiAvaliacoes/MedianaPorBairro")), title: "Mediana do Valor de Transmissão por Bairro" },
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/tributos/itbiAvaliacoes/TabelaTransacoes")), title: "Transações Imobiliárias" },
];

export default charts;
