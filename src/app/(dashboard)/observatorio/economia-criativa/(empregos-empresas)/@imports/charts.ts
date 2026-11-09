import React from "react";

// Natureza Jurídica (lista horizontal) e Tamanho do Estabelecimento (barras verticais) são
// componentes novos porque não existem equivalentes no RAIS geral com o mesmo tipo de gráfico do
// relatório de referência. CEI vinculado e Simples Nacional reaproveitam os componentes do RAIS
// geral (aba Estoque) — mesmos dois gráficos de pizza, batendo com o relatório.
const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/empregos-empresas/NaturezaJuridica"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/estoque/EstoqueCeiVinculado"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/estoque/EstoqueSimplesNacional"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/empregos-empresas/TamanhoEstabelecimento"
      )
    ),
  },
];

export default charts;
