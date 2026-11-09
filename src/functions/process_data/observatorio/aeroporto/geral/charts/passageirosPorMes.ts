import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Série histórica completa (todos os anos), um ponto por mês — usada pelos gráficos de
// linha, que sempre mostram a evolução mensal inteira em vez de só o ano selecionado.
export const processPassageirosPorMes = (data: AnacGeralHeaders[]) => {
  const keys = Array.from(
    new Set(data.map((item) => `${item["ANO"]}-${String(item["MÊS"]).padStart(2, "0")}`))
  ).sort();

  const processedData = keys.map((key) => {
    const [ano, mes] = key.split("-");
    return { mes: `${MESES[Number(mes) - 1]}/${ano}`, passageiros: 0 };
  });
  const indexByKey = new Map(keys.map((key, i) => [key, i]));

  data.forEach((item: AnacGeralHeaders) => {
    const key = `${item["ANO"]}-${String(item["MÊS"]).padStart(2, "0")}`;
    const index = indexByKey.get(key);
    if (index !== undefined) {
      processedData[index].passageiros += item["PASSAGEIRO"] || 0;
    }
  });

  return processedData;
};
