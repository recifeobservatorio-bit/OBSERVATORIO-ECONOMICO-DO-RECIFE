import React from "react";

const cards = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/rfc-locacoes/LocacoesAutorizadas"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/rfc-locacoes/DiasFilmagem"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/rfc-locacoes/SetsAcompanhados"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/rfc-locacoes/DiasParaAutorizacao"
      )
    ),
  },
];

export default cards;
