import { AenaCargasHeaders } from "@/@types/observatorio/@fetch/aeroporto";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Série histórica completa (todos os anos), um ponto por mês — usada pelos gráficos de
// linha, que sempre mostram a evolução mensal inteira em vez de só o ano selecionado.
export const processCargaPorMesAena = (data: AenaCargasHeaders[]) => {
  const keys = Array.from(
    new Set(data.map((item) => `${item["Ano"]}-${String(item["Mês"]).padStart(2, "0")}`))
  ).sort();

  const processedData = keys.map((key) => {
    const [ano, mes] = key.split("-");
    return { mes: `${MESES[Number(mes) - 1]}/${ano}`, quantidade: 0 };
  });
  const indexByKey = new Map(keys.map((key, i) => [key, i]));

  data.forEach((item: AenaCargasHeaders) => {
    const key = `${item["Ano"]}-${String(item["Mês"]).padStart(2, "0")}`;
    const index = indexByKey.get(key);
    if (index !== undefined) {
      processedData[index].quantidade += item["Quantidade"] || 0;
    }
  });

  return processedData;
};
