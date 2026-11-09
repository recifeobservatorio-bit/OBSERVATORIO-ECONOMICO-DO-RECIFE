import { geralAccFunction } from "../../rais/demografia/geralFuncition";
import { getAccSalario } from "../getAccSalario";

// Nomes completos (como vêm na coluna "mês") -> índice 0-based do mês.
// Mapeamento próprio (não usa monthToNumber, que tem um bug conhecido em "março").
const NOME_MES_PARA_INDICE: { [key: string]: number } = {
  janeiro: 0,
  fevereiro: 1,
  março: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

export const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Chave "AAAA-MM" (mês 0-based, 2 dígitos) usada para agrupar e ordenar cronologicamente.
export function anoMesKey(ano: string | number, mesNome: string): string | null {
  const idx = NOME_MES_PARA_INDICE[String(mesNome).toLowerCase()];
  if (idx === undefined || ano == null) return null;
  return `${ano}-${String(idx).padStart(2, "0")}`;
}

export function anoMesKeyToLabel(key: string): string {
  const [ano, mesIdx] = key.split("-");
  return `${MESES_ABREV[Number(mesIdx)]}/${ano}`;
}

// Mesma lógica de getMunicipiosAnoData (getAnoValues.ts), mas agrupando por "Ano"+"mês"
// em vez de só "Ano" — série histórica completa (todos os anos), por mês.
export const getMunicipiosAnoMesData = (data: any, municipios: string[]) => {
  if (!data.length) return;

  const dataMuni: { [key: string]: { [anoMes: string]: any } } = {};

  municipios.forEach((muni: string) => {
    const dataFiltredMuni = data?.filter((micro: any) => micro["município"] === muni) || [];
    if (!dataMuni[muni]) dataMuni[muni] = {};

    const keysObj = ["__anoMes"];
    const comChave = dataFiltredMuni
      .map((row: any) => ({ ...row, __anoMes: anoMesKey(row["Ano"], row["mês"]) }))
      .filter((row: any) => row.__anoMes != null);

    const dataSalario = getAccSalario(comChave, keysObj);
    const dataAcc = geralAccFunction(comChave, keysObj);

    const muniAcc = dataAcc.__anoMes || {};
    const muniSalario = dataSalario.__anoMes || {};

    for (const key in muniAcc) {
      dataMuni[muni][key] = muniSalario[key] / muniAcc[key];
    }
  });

  return dataMuni;
};

// Mesma lógica de processMunicipiosAnoValues (municipiosAnoValues.ts), mas pivotando pela
// chave "Ano-Mês" e rotulando como "Mmm/AAAA", ordenado cronologicamente.
export const processMunicipiosAnoMesValues = (data: any, toCompare: string[]) => {
  const dataFull: any[] = [];

  for (const keyMuni in data) {
    if (toCompare.includes(keyMuni)) {
      for (const keyAnoMes in data[keyMuni]) {
        const dataIndex = dataFull.findIndex((obj: any) => obj.__key === keyAnoMes);

        if (dataIndex === -1) {
          dataFull.push({ __key: keyAnoMes, mes: anoMesKeyToLabel(keyAnoMes), [keyMuni]: data[keyMuni][keyAnoMes] });
        } else {
          dataFull[dataIndex] = { ...dataFull[dataIndex], [keyMuni]: data[keyMuni][keyAnoMes] };
        }
      }
    }
  }

  return dataFull
    .sort((a, b) => (a.__key < b.__key ? -1 : a.__key > b.__key ? 1 : 0))
    .map(({ __key, ...rest }) => rest);
};
