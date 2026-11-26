import React from "react";

const charts = [
  {
    Component: React.lazy(
      () =>
        import(
          "@/components/@build/observatorio/charts/ipca/geral/IpcaPorMeses"
        )
    ),
    title: "Ipca Anual de Selecionados",
    // Recife x Brasil num gráfico só (o "Variação Mensal do IPCA no Brasil" saiu daqui);
    // ocupa 2 colunas para a grade de 3 fechar em 2 linhas.
    wide: true,
  },
  {
    Component: React.lazy(
      () =>
        import("@/components/@build/observatorio/charts/ipca/geral/IpcaNoAno")
    ),
    title: "Ipca Anual do Brasil",
  },
  {
    Component: React.lazy(
      () =>
        import(
          "@/components/@build/observatorio/charts/ipca/geral/IpcaBrasilNoAno"
        )
    ),
    title: "Ipca Anual do Brasil",
  },
  {
    Component: React.lazy(
      () =>
        import(
          "@/components/@build/observatorio/charts/ipca/geral/Ipca12Meses"
        )
    ),
    title: "Ipca Anual do Brasil",
  },
  {
    Component: React.lazy(
      () =>
        import(
          "@/components/@build/observatorio/charts/ipca/geral/IpcaBrasil12Meses"
        )
    ),
    title: "Ipca Anual do Brasil",
  },
];

export default charts;
