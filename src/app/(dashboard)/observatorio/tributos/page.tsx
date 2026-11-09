"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { TributosDataResult } from "@/@types/observatorio/@data/tributosData";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import ItbiContribuintes from "./(itbi-contribuintes)/itbi-contribuintes";
import ItbiAvaliacoes from "./(itbi-avaliacoes)/itbi-avaliacoes";
import ItbiPesquisa from "./(itbi-pesquisa)/itbi-pesquisa";
import IptuContribuintes from "./(iptu-contribuintes)/iptu-contribuintes";
import IptuValores from "./(iptu-valores)/iptu-valores";
import IptuPesquisa from "./(iptu-pesquisa)/iptu-pesquisa";

const TABS = [
  { key: "mercado-imobiliario",            label: "MERCADO IMOBILIÁRIO",            gradient: "from-orange-500 to-orange-700" },
  { key: "mercado-imobiliario-avaliacoes", label: "MERCADO IMOBILIÁRIO AVALIAÇÕES", gradient: "from-blue-500 to-blue-700" },
  { key: "mercado-imobiliario-pesquisa",   label: "MERCADO IMOBILIÁRIO PESQUISA",   gradient: "from-green-500 to-green-700" },
  { key: "iptu-contribuintes",             label: "IPTU CONTRIBUINTES",             gradient: "from-purple-500 to-purple-700" },
  { key: "iptu-valores",                   label: "IPTU VALORES",                  gradient: "from-red-500 to-red-700" },
  { key: "iptu-pesquisa",                  label: "IPTU PESQUISA",                 gradient: "from-teal-500 to-teal-700" },
];

const TributosPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoading, data, filters } = useDashboard();
  const [activeTab, setActiveTab] = useState("mercado-imobiliario");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab("mercado-imobiliario");
      router.replace("?tab=mercado-imobiliario");
    }
  }, [searchParams]);

  const handleNavigation = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  const year = getYearSelected(filters);
  const tributosData = data as TributosDataResult | null;

  const renderContent = () => {
    if (!tributosData) return <div className="text-center text-gray-600 dark:text-gray-400 mt-12">Carregando dados...</div>;

    switch (activeTab) {
      case "mercado-imobiliario-avaliacoes":
        return <ItbiAvaliacoes data={tributosData?.itbiAvaliacoes} year={year} />;
      case "mercado-imobiliario-pesquisa":
        return <ItbiPesquisa data={tributosData?.itbiPesquisa} />;
      case "iptu-contribuintes":
        return <IptuContribuintes data={tributosData?.iptuContribuintes} year={year} />;
      case "iptu-valores":
        return <IptuValores data={tributosData?.iptuValores} year={year} />;
      case "iptu-pesquisa":
        return <IptuPesquisa data={tributosData?.iptuPesquisa} />;
      default:
        return <ItbiContribuintes data={tributosData?.itbiContribuintes} year={year} />;
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Mercado Imobiliário e IPTU
      </h1>

      {/* Abas */}
      <div className="bi-tabs">
        {TABS.map(({ key, label, gradient }) => (
          <button
            key={key}
            onClick={() => handleNavigation(key)}
            className={`bi-tab ${
              activeTab === key
                ? "bi-tab-active"
                : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default TributosPage;
