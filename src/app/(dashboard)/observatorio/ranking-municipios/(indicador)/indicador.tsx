import React, { useState, useEffect } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { RankingMunicipiosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { useDashboard } from "@/context/DashboardContext";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import charts from "./@imports/charts";
import tables from "./@imports/tables";


const Indicador = ({
  year,
  rawData,
}: {
  year: string;
  data: any[];
  rawData: any[];
}) => {
  const { data, isLoading } = useDashboard() as any;
  const [indicadorData, setIndicadorData] = useState([]);

  useEffect(() => {
    if (data) {
      const indicadorData = data.indicador || {};

      setIndicadorData(indicadorData.filteredData || []);
    }
  }, [data]);


  return (
    <FitToScreen>
      <div className="pb-4">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full bi-table-fill">
            {tables.map(({ Component }, index) => (
              <div key={index} className="h-full relative">
                <SectionIconBadge icon={<RankingMunicipiosIcon />} />
                <React.Suspense fallback={<div>Carregando...</div>}>
                  <Component
                    color={ColorPalette.default[4]}
                    data={rawData}
                    year={year}
                  />
                </React.Suspense>
              </div>
            ))}
          </div>

          <div className="flex flex-col w-full gap-6">
            <div className="grid grid-cols-1 gap-6 h-full">
              {charts.map(({ Component }, index) => (
                <div
                  key={index}
                  className="chart-content-wrapper relative"
                >
                  <SectionIconBadge icon={<RankingMunicipiosIcon />} />
                  <React.Suspense fallback={<GraphSkeleton />}>
                    <Component data={indicadorData} />
                  </React.Suspense>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FitToScreen>
  );
};

export default Indicador;
