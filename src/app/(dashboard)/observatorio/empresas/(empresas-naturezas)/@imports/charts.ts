import React from "react";

const charts = [
  // Quantidade ocupa a 1ª coluna, linha 1.
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-naturezas/EmpresasAtivasNaturezaMes"
      )
    ),
  },
  // Natureza Jurídica ocupa a 2ª coluna, linhas 1 e 2 (mesma largura de Quantidade, mas
  // com o dobro da altura — o espaço de dois gráficos).
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-naturezas/EmpresasNatureza"
      )
    ),
    rowSpan: 2,
  },
  // Município preenche o espaço que sobra embaixo de Quantidade, na 1ª coluna, linha 2.
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empresas/empresas-naturezas/EmpresasMunicipioNatureza"
      )
    ),
  },
  // {
  //   Component: React.lazy(() =>
  //     import(
  //       "@/components/@build/observatorio/charts/empresas/empresas-ativas/EmpresasBairro"
  //     )
  //   ),
  // },
  // {
  //   Component: React.lazy(() =>
  //     import(
  //       "@/components/@build/observatorio/charts/empresas/empresas-ativas/EmpresaGrupo"
  //     )
  //   ),
  // },  
  // {
  //   Component: React.lazy(() =>
  //     import(
  //       "@/components/@build/observatorio/charts/empresas/empresas-ativas/EmpresasDescricao"
  //     )
  //   ),
  // },  
  // {
  //   Component: React.lazy(() =>
  //     import(
  //       "@/components/@build/observatorio/charts/empresas/empresas-ativas/EmpresasMes"
  //     )
  //   ),
  // },
];

export default charts;