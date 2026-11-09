import React from "react";

const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-locacoes/LocacoesAoLongoDoTempo"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-locacoes/PrincipaisLocacoes"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-locacoes/Produtores"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/economia-criativa/rfc-locacoes/EmissaoRuidos"
      )
    ),
  },
];

export default charts;
