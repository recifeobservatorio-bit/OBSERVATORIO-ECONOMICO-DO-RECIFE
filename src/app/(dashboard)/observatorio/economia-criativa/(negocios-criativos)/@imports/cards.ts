import React from "react";

const cards = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/negocios-criativos/EmpresasTotal"
      )
    ),
  },
];

export default cards;
