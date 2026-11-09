import React from "react";

// Tipos de gráfico confirmados pelo cliente em 2026-09-03 (a aba estava sem dado carregado no
// relatório de referência, então antes disso não tinha como verificar visualmente). Tipo de
// Necessidade Especial e Setor Produtivo têm componentes novos porque o tipo de gráfico difere
// do RAIS geral (aqui é barra horizontal / barra vertical; no RAIS geral era barra vertical /
// Treemap, respectivamente) — Grau de Instrução, Grupo de Empresas e Gênero já batiam e continuam
// reaproveitando os componentes do RAIS geral.
const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/diversidade/DiversidadeTipoDeficiencia"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/diversidade/DiversidadeGrauInstrucao"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/diversidade/DiversidadeDistribuicao"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/diversidade/DiversidadeGenero"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/diversidade/DiversidadeSetorProdutivo"
      )
    ),
  },
];

export default charts;
