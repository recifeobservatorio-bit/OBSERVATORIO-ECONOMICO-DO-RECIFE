import React from "react";

const charts = [
  // Bairro ocupa as 2 primeiras colunas da linha 1.
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-inativas/EmpresasBairro"
      )
    ),
    colSpan: 2,
  },
  // Atividade Econômica fica na 3ª coluna, ocupando as linhas 1 e 2.
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-inativas/EmpresasDescricao"
      )
    ),
    rowSpan: 2,
  },
  // Preenchem a linha 2, colunas 1 e 2.
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-inativas/EmpresaGrupo"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-inativas/EmpresasMes"
      )
    ),
  },
];

export default charts;