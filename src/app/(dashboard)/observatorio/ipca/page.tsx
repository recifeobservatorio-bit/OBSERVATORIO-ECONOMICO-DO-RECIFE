"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { IpcaGeralHeaders } from "@/@types/observatorio/@fetch/ipca";
import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import Analitico from "./(analitico)/analitico";
import Geral from "./(geral)/geral";
import Grupos from "./(grupos)/grupos";


const IpcaPage = () => {
  const searchParams = useSearchParams();
  const { isLoading, data, filters } = useDashboard();
  const [ipca, setIpca] = useState<IpcaGeralHeaders[]>([]);
  const [ipcaRawData, setIpcaRawData] = useState<IpcaGeralHeaders[]>([]);
  const [ipcaPorAno, setIpcaPorAno] = useState<any[]>([]);
  const [ipcaPorMes, setIpcaPorMes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("geral");
  const router = useRouter();

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
    if (data?.id === "ipca") {
      const ipcaData = data?.geral as any;
      setIpca(ipcaData?.filteredData || []);
      setIpcaRawData(ipcaData?.rawData || []);
      setIpcaPorAno(ipcaData?.porAno || []);
      setIpcaPorMes(ipcaData?.porMes || []);
    }

  }, [data]);

  const renderContent = () => {
    if (!data || !ipca || !ipcaRawData) {
      return (
        <div className="text-center text-gray-600">Construindo gráficos...</div>
      );
    }

    switch (activeTab) {
      // Aba "IPCA" do Power BI: resumo + grupos na mesma página (a antiga aba
      // "Por Grupos" abre aqui também).
      case "geral":
      case "grupos":
        return <Geral
            data={ipca || {}}
            rawData={ipcaRawData || {}}
            porAno={ipcaPorAno}
            porMes={ipcaPorMes}
            months={getMonths(filters)}
            extra={<Grupos noFit />}
          />

      case "analitico":
        return <Analitico
            year={getYearSelected(filters)}
          />
      default:
        return <Geral
          data={ipca}
          rawData={ipcaRawData || {}}
          porAno={ipcaPorAno}
          porMes={ipcaPorMes}
          months={getMonths(filters)}
        />
    }
  };

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        IPCA
      </h1>
      {/* Abas na ordem e com os nomes do Power BI. */}
      <div className="bi-tabs">
        {[
          { key: "geral", label: "IPCA" },
          { key: "analitico", label: "IPCA Analítico" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleNavigation(t.key)}
            className={`bi-tab ${activeTab === t.key || (t.key === "geral" && activeTab === "grupos") ? "bi-tab-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default IpcaPage;
