import React, { useEffect, useState } from "react";

import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import SelectPrincipal from "@/components/@global/features/SelectPrincipal";
import { BalancaComercialIcon } from "@/components/@global/icons/sectionIcons";
import { getUniqueValues } from "@/utils/filters/@global/getUniqueValues";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import NegociadoPeriodoMes from "@/components/@build/observatorio/charts/balanca-comercial/comercial/NegociadoPeriodoMes";
import tables from "./@imports/tables";

const Analitico = ({
  year,
  data,
  toCompare = getUniqueValues<BalancaHeaders, "Município">(data, "Município"),
  monthRecent,
  comparativo = false,
  dataPast = [],
}: {
  year: string;
  toCompare?: string[];
  data: BalancaHeaders[];
  monthRecent?: number;
  // false = "Balança Analítico" (só Recife, com rosca/pizza); true = "Balança
  // Analítico Comparativo" (busca de municípios e tabelas lado a lado).
  comparativo?: boolean;
  dataPast?: BalancaHeaders[];
}) => {
  const [tempFiltred, setTempFiltred] = useState<string[]>(comparativo ? [] : ["Recife - PE"]);
  const [tablesRender, setTablesRender] = useState(tables);

  // Store selectCountry states for each index
  const [selectCountries, setSelectCountries] = useState<string[]>([]);

  useEffect(() => {
    const getNewTables = tempFiltred.map((val) => {
      // VOU ARRUMAR ESSE FIQUE TRANQUILO
      return {
        Component: React.lazy(
          () =>
            import(
              "@/components/@build/observatorio/tables/balanca-comercial/analitico/BalInfo"
            )
        ),
        Secundary: React.lazy(
          () =>
            import(
              "@/components/@build/observatorio/tables/balanca-comercial/analitico/GroupProdutos"
            )
        ),
      };
    });

    setTablesRender([...getNewTables]);
  }, [tempFiltred]);

  // Update selectCountry for a specific index
  const updateSelectCountry = (index: number, country: string) => {
    setSelectCountries((prev) => {
      const updated = [...prev];
      updated[index] = country; // Update the country for the specific index
      return updated;
    });
  };

  return (
    <FitToScreen>
    <div>
      {comparativo && (
        <SelectPrincipal
          options={toCompare}
          filters={tempFiltred}
          setFilters={setTempFiltred}
          initialValue={["Recife - PE"]}
          noRecife={false}
        />
      )}

      {/* Rosca do período + pizza do mês, como no topo do Balança Analítico do Power BI. */}
      {!comparativo && tempFiltred[0] && (
        <div className="mb-4">
          <NegociadoPeriodoMes data={data} dataPast={dataPast} municipio={tempFiltred[0]} year={year} />
        </div>
      )}
      <div className="flex justify-between items-center gap-2 h-full">
        {/* Tela única: com um município só, as seções Negociações e Grupos de
            Produtos ficam lado a lado (empilhadas a aba não cabia na tela). Com
            comparação, cada seção mostra os dois municípios lado a lado. */}
        <div className={tablesRender.length === 1 ? "grid grid-cols-1 lg:grid-cols-2 gap-4 w-full bi-tables-fill-screen" : "flex flex-col gap-6 w-full"}>
        <div className="flex flex-col gap-3 min-w-0">
         <div className="flex items-center justify-between gap-2">
            <div className="flex-1 h-[1px] bg-gray-800 dark:bg-gray-200"></div>
            <p className="text-gray-800 dark:text-gray-200">Negociações</p>
            <div className="flex-1 h-[1px] bg-gray-800 dark:bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
              {tablesRender.map(({ Component }, index) => {
              if (!selectCountries[index]) {
                selectCountries[index] = "";
              }

              return (
                <React.Suspense fallback={<div>Carregando...</div>} key={index}>
                    <div
                      style={{ backgroundColor: ColorPalette.default[index] }}
                      className="shadow-md rounded-lg w-100 flex flex-col items-center relative"
                    >
                      <SectionIconBadge icon={<BalancaComercialIcon />} />
                      <Component
                        municipio={[...tempFiltred][index]}
                        color={ColorPalette.default[index]}
                        data={data}
                        year={year}
                        selectCountry={(country: string) =>
                          updateSelectCountry(index, country)
                        }
                        monthRecent={monthRecent}
                      />
                    </div>
                </React.Suspense>
              );
            })}
          </div>
          
        </div>
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 h-[1px] bg-gray-800 dark:bg-gray-200"></div>
            <p className="text-gray-800 dark:text-gray-200">Grupos de Produtos</p>
            <div className="flex-1 h-[1px] bg-gray-800 dark:bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
              {tablesRender.map(({ Secundary }, index) => {
              if (!selectCountries[index]) {
                selectCountries[index] = "";
              }

              return (
                <React.Suspense fallback={<div>Carregando...</div>} key={index}>
                    <div className="bg-white shadow-md rounded-lg w-100 flex flex-col items-center relative">
                      <SectionIconBadge icon={<BalancaComercialIcon />} />
                      <Secundary
                        municipio={[...tempFiltred][index]}
                        color={ColorPalette.default[index]}
                        data={data}
                        year={year}
                        country={selectCountries[index]}
                        monthRecent={monthRecent}
                      />
                    </div>
                </React.Suspense>
              );
            })}
          </div>
        </div>
         
        </div>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Analitico;
