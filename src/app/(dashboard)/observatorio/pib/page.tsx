"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import PibPainel from "./(geral)/PibPainel";

const PibPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isLoading, data, filters } = useDashboard() as any;

  const [activeTab, setActiveTab] = useState("geral");
  const [pibData, setPibData] = useState({} as any)

  const defaultData: any = {
    geral: [],
    current: [],
    past: [],
    rawDataCurrent: []
  };

  useEffect(() => {
      const tab = searchParams.get("tab");
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      } else if (!tab) {
        setActiveTab('geral');
        router.replace(`?tab=geral`);
      }
    }, [searchParams, activeTab, router]);
    
  useEffect(() => {
    if (data?.geral) {
      setPibData({
        geral: data?.geral?.filteredData,
        current: data?.current?.filteredData,
        past: data?.past?.filteredData,
        rawDataCurrent: data?.rawDataCurrent,
        allData: data?.allData ?? [],
      });

    } else {
      setPibData(defaultData);
    }

    }, [data]);

  const renderContent = () => {
    if (!data || !pibData.geral || !pibData.current || !pibData.past || !pibData.rawDataCurrent) {
      return <div className="text-center text-gray-600">Construindo gráficos...</div>;
    }

    // Duas páginas como no Power BI ("PIB" e "PIB Per Capita"); a comparação com
    // outra cidade fica dentro de cada uma (a antiga aba Comparativo abre o PIB).
    return (
      <PibPainel
        data={pibData}
        year={getYearSelected(filters)}
        capita={activeTab === "capita"}
      />
    );
  };

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        PIB
      </h1>

      <div className="bi-tabs">
        {[
          { key: "geral", label: "PIB" },
          { key: "capita", label: "PIB Per Capita" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleNavigation(t.key)}
            className={`bi-tab ${activeTab === t.key || (t.key === "geral" && activeTab === "comparativo") ? "bi-tab-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default PibPage;
