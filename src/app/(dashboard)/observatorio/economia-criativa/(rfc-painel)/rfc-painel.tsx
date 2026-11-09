"use client";

import React from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { EconomiaCriativaIcon } from "@/components/@global/icons/sectionIcons";
import ErrorBoundary from "@/utils/loader/errorBoundary";

import tables from "./@imports/tables";

const RfcPainel = ({ data }: { data: any[] }) => {
  return (
    <FitToScreen>
      {/* Tabela até o fim da tela (sem isso ficava na metade de cima). */}
      <div className="flex flex-col gap-6 pb-4 bi-tables-fill-screen" style={{ "--bi-fill-offset": "400px" } as React.CSSProperties}>
        {tables.map(({ Component }, index) => (
          <div key={index} className="bg-white dark:bg-[#0C1B2B] shadow-md rounded-lg flex flex-col items-center w-full relative">
            <SectionIconBadge icon={<EconomiaCriativaIcon />} />
            <React.Suspense fallback={<div>Carregando...</div>}>
              <ErrorBoundary>
                <Component data={data || []} />
              </ErrorBoundary>
            </React.Suspense>
          </div>
        ))}
      </div>
    </FitToScreen>
  );
};

export default RfcPainel;
