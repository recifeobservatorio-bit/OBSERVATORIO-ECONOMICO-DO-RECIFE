"use client";

import React from "react";

import IptuPesquisaTable from "@/components/@build/observatorio/tables/tributos/iptu/IptuPesquisaTable";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { TributosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const IptuPesquisa = ({ data }: { data: any }) => {
  return (
    <FitToScreen>
    {/* Tabela até o fim da tela (sem isso ficava na metade de cima). 400px:
        cabeçalho e busca acima da lista + paginação embaixo. */}
    <div className="pb-4 relative bi-tables-fill-screen" style={{ "--bi-fill-offset": "400px" } as React.CSSProperties}>
      <SectionIconBadge icon={<TributosIcon />} />
      <React.Suspense fallback={<GraphSkeleton />}>
        <ErrorBoundary>
          <IptuPesquisaTable data={data} color={ColorPalette.default[0]} />
        </ErrorBoundary>
      </React.Suspense>
    </div>
    </FitToScreen>
  );
};

export default IptuPesquisa;
