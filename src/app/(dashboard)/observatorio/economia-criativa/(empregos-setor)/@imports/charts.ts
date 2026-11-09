import React from "react";

// Tipos de gráfico confirmados pelo cliente em 2026-09-03. Setor Produtivo (barra vertical) e
// Descrição Seção (barra horizontal) têm componentes novos porque o RAIS geral usava Treemap e
// barra vertical respectivamente, diferente do relatório de referência. Evolução do Estoque por
// Ano é novo — antes tinha ficado de fora (arquitetura de um ano por vez); agora busca os 5 anos
// direto no componente (ver EvolucaoEstoqueAno.tsx). Gênero e Profissão já batiam e continuam
// reaproveitando os componentes do RAIS geral.
const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/demografia/EmpregosGenero"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/empregos-setor/EstoqueSetorProdutivo"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/empregos-setor/EvolucaoEstoqueAno"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/empregos-setor/EstoqueSetorSecao"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/grupo/GruposDistribuicaoClasses"
      )
    ),
  },
];

export default charts;
