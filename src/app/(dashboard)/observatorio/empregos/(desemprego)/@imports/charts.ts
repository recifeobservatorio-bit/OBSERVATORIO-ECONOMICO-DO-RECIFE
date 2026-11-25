import React from "react";

const charts = [
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empregos/desemprego/TaxaDesempregoAno"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empregos/desemprego/TaxaDesempregoCapitais"
      )
    ),
  },
  {
    Component: React.lazy(() =>
      import(
        "@/components/@build/observatorio/charts/empregos/desemprego/TaxaDesempregoComparativo"
      )
    ),
  },
];

export default charts;
