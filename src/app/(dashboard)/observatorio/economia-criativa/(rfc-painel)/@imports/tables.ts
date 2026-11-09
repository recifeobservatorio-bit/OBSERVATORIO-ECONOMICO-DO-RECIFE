import React from "react";

const tables = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/tables/economia-criativa/rfc-painel/RfcPainelTable"
      )
    ),
  },
];

export default tables;
