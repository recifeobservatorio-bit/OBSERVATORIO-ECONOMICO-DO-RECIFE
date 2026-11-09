import React from "react";

// Grade 2×2: linha de cima = coluna (Médio) + linha; embaixo = coluna (Máximo) + barra (Mínimo)
const charts = [
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/combustiveis/regional/PrecoMedioPorRegiao")), title: "Preço Médio por Região" },
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/combustiveis/regional/EvolucaoPrecoRegiao")), title: "Evolução do Preço por Região" },
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/combustiveis/regional/PrecoMaximoPorRegiao")), title: "Preço Máximo por Região" },
  { Component: React.lazy(() => import("@/components/@build/observatorio/charts/combustiveis/regional/PrecoMinimoPorRegiao")), title: "Preço Mínimo por Região" },
];

export default charts;
