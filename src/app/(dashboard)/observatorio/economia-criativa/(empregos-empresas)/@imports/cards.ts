import React from "react";

const cards = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/empregos-empresas/TotalCeiVinculoAtivo"
      )
    ),
  },
];

export default cards;
