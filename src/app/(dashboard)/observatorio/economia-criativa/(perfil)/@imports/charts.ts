import React from "react";

// Gênero/Faixa Etária/Grau de Instrução reaproveitam os componentes genéricos do RAIS geral
// (mesmas colunas em rais_economia_criativa_{ano}.parquet). Raça e Setor Produtivo têm
// componentes próprios aqui porque o tipo de gráfico é diferente do RAIS geral — no relatório
// de referência (Power BI "Economia Criativa"), Raça é Treemap e Setor Produtivo é Barras,
// enquanto no RAIS geral é o oposto (Raça é Pizza, Setor é Treemap).
const charts = [
  {
    title: "Distribuição do estoque de economia criativa por gênero",
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/demografia/EmpregosGenero"
      )
    ),
  },
  {
    title: "Distribuição do estoque de economia criativa por faixa etária",
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/demografia/EmpregosFaixaEtaria"
      )
    ),
  },
  {
    title: "Distribuição do estoque de economia criativa por grau de instrução",
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/demografia/EmpregosGrauInstrucao"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/perfil/PerfilRaca"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/perfil/PerfilSetor"
      )
    ),
  },
];

export default charts;
