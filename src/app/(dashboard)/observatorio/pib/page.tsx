"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import Capita from "./(capita)/capita";
import Comparativo from "./(comparativo)/comparativo";
import Geral from "./(geral)/geral";

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
        rawDataCurrent: data?.rawDataCurrent
      });

    } else {
      setPibData(defaultData);
    }

    }, [data]);

  const renderContent = () => {
    if (!data || !pibData.geral || !pibData.current || !pibData.past || !pibData.rawDataCurrent) {
      return <div className="text-center text-gray-600">Construindo gráficos...</div>;
    }

    switch (activeTab) {
      case "geral":
        return (
          <Geral
            data={pibData}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        );
      case "capita":
        return (
          <Capita
            data={pibData}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        );
      case "comparativo":
        return <Comparativo
          data={pibData} 
          year={getYearSelected(filters)}
        />;
      default:
        return (
          <Geral
            data={pibData}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        );
    }
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
        <button
          onClick={() => handleNavigation("geral")}
          className={`bi-tab ${
            activeTab === "geral"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Geral
        </button>
        <button
          onClick={() => handleNavigation("capita")}
          className={`bi-tab ${
            activeTab === "capita"
              ? "bi-tab-active"
              : ""
          }`}
        >
          PIB Per Capita
        </button>
        <button
          onClick={() => handleNavigation("comparativo")}
          className={`bi-tab ${
            activeTab === "comparativo"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Comparativo
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default PibPage;
