import React from "react";

// Todos os 5 gráficos batem exatamente com o tipo usado no relatório de referência (Motivo =
// barra horizontal, Ano = linha, Gênero = pizza, Faixa Etária = barra horizontal, Setor =
// Treemap) — diferente de Perfil, aqui não foi preciso nenhum componente novo.
const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/desligamento/DesligamentosMotivo"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/desligamento/DesligamentosAno"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/desligamento/DesligamentosGenero"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/desligamento/DesligamentosFaixaEtaria"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/rais/desligamento/DesligamentosSetor"
      )
    ),
  },
];

export default charts;
