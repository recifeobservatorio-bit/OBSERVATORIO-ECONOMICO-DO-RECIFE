import React, { useRef, useState } from "react";

import { IpcaGeralHeaders } from "@/@types/observatorio/@fetch/ipca";
import { ChartBuild } from "@/@types/observatorio/shared";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { IpcaIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ErrorBoundary from "@/utils/loader/errorBoundary";

import charts from "./@imports/charts";

const Geral = ({
  data,
  rawData,
  porAno,
  porMes,
  months,
}: ChartBuild<IpcaGeralHeaders[]> & { porAno?: any[]; porMes?: any[] }) => {
  const [chartOrder, setChartOrder] = useState(charts.map((_, index) => index));
  const sortableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <FitToScreen>
    <div className="pb-4">
      <SortableDiv chartOrder={chartOrder} setChartOrder={setChartOrder} sortableContainerRef={sortableContainerRef} style="grid items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
      {chartOrder.map((index) => {
          const { Component } = charts[index];
          return (
            <div key={index} className={`chart-content-wrapper relative`}>
              <SectionIconBadge icon={<IpcaIcon />} />
              <React.Suspense fallback={<GraphSkeleton />}>
                <ErrorBoundary>
                  <Component data={data} rawData={rawData} porAno={porAno} porMes={porMes} months={months} />
                </ErrorBoundary>
              </React.Suspense>
            </div>
          );
        })}
       </SortableDiv>
    </div>
    </FitToScreen>
  );
};

export default Geral;
