import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Série histórica completa (todos os anos), um ponto por mês, por aeroporto comparado.
export const processCargasPorMesComparativo = (
  data: AnacGeralHeaders[],
  aeroportos: string[]
): { mes: string; [key: string]: number | string }[] => {
  const keys = Array.from(
    new Set(data.map((item) => `${item["ANO"]}-${String(item["MÊS"]).padStart(2, "0")}`))
  ).sort();

  const processedData = keys.map((key) => {
    const [ano, mes] = key.split("-");
    const result: { mes: string; [key: string]: number | string } = { mes: `${MESES[Number(mes) - 1]}/${ano}` };
    aeroportos.forEach((aeroporto) => {
      result[aeroporto] = 0;
    });
    return result;
  });
  const indexByKey = new Map(keys.map((key, i) => [key, i]));

  data.forEach((item: AnacGeralHeaders) => {
    const carga = parseFloat((item["CARGA"] || "0").toString());
    const aeroportoNome = item["AEROPORTO NOME"];

    if (aeroportos.includes(aeroportoNome)) {
      const key = `${item["ANO"]}-${String(item["MÊS"]).padStart(2, "0")}`;
      const index = indexByKey.get(key);
      if (index !== undefined) {
        processedData[index][aeroportoNome] = (processedData[index][aeroportoNome] as number) + carga;
      }
    }
  });

  return processedData;
};
