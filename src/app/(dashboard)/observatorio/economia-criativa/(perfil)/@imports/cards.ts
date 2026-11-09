import React from "react";

const cards = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/perfil/PerfilGeral"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/perfil/EstoqueTotal"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/cards/economia-criativa/perfil/NotaTecnica"
      )
    ),
  },
];

export default cards;
