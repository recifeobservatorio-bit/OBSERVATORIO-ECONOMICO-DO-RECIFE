import React, { useEffect, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import SelectPrincipal from "@/components/@global/features/SelectPrincipal";
import { PibIcon } from "@/components/@global/icons/sectionIcons";
import { getUniqueValues } from "@/utils/filters/@global/getUniqueValues";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import tables from "./@imports/tables";

const Analitico = ({
  year,
  data,
  toCompare = getUniqueValues<any, "Município">(data, "Município"),
  monthRecent,
}: {
  year: string;
  toCompare?: any;
  data: any[];
  monthRecent?: number;
}) => {
  const [tempFiltred, setTempFiltred] = useState([]);
  const [tablesRender, setTablesRender] = useState(tables);

  // Store selectCountry states for each index
  const [selectCountries, setSelectCountries] = useState<string[]>([]);

  useEffect(() => {
    const getNewTables = tempFiltred.map((val) => {
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
      <SelectPrincipal
        options={toCompare}
        filters={tempFiltred}
        setFilters={setTempFiltred}
        initialValue={["Recife - PE"]}
      />

      <div className="flex justify-between items-center gap-2 h-full">
        <div className="flex flex-col gap-6">
          {tablesRender.map(({ Component, Secundary }, index) => {
            // Ensure selectCountry has an initial empty string value
            if (!selectCountries[index]) {
              selectCountries[index] = "";
            }

            return (
              <React.Suspense fallback={<div>Carregando...</div>} key={index}>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    style={{ backgroundColor: ColorPalette.default[index] }}
                    className="shadow-md rounded-lg w-100 flex flex-col items-center relative"
                  >
                    <SectionIconBadge icon={<PibIcon />} />
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

                  <div className="bg-white shadow-md rounded-lg w-100 flex flex-col items-center relative">
                    <SectionIconBadge icon={<PibIcon />} />
                    <Secundary
                      municipio={[...tempFiltred][index]}
                      color={ColorPalette.default[index]}
                      data={data}
                      year={year}
                      country={selectCountries[index]}
                      monthRecent={monthRecent}
                    />
                  </div>
                </div>
              </React.Suspense>
            );
          })}
        </div>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Analitico;
