import React from "react";

const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-producoes/ProducoesImpacto"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-producoes/ProducoesStatus"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-producoes/ProducoesAoLongoDoTempo"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-producoes/ProducoesCidade"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-producoes/ProducoesPorMes"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-producoes/ProducoesTipo"
      )
    ),
  },
];

export default charts;
