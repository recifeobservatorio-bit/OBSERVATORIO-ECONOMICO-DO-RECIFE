import React from "react";

const cards = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/rfc-producoes/ProducoesTotal"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/rfc-producoes/PessoasEnvolvidas"
      )
    ),
  },
];

export default cards;
