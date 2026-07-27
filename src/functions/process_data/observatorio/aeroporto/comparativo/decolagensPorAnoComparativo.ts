import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";

export const processDecolagensPorAnoComparativo = (
  data: AnacGeralHeaders[],
  aeroportos: string[]
): { ano: string; [key: string]: number | string }[] => {

  const anos = Array.from(new Set(data.map((item) => item["ANO"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => {
    const result: { ano: string; [key: string]: number | string } = { ano: String(ano) };
    aeroportos.forEach((aeroporto) => {
      result[aeroporto] = 0;
    });
    return result;
  });
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data.forEach((item: AnacGeralHeaders) => {
    const decolagens = parseFloat((item["DECOLAGENS"] || "0").toString());

    const aeroportoNome = item["AEROPORTO NOME"];

    if (aeroportos.includes(aeroportoNome)) {
      const index = indexByAno.get(item["ANO"]);
      if (index !== undefined) {
        processedData[index][aeroportoNome] =
          (processedData[index][aeroportoNome] as number) + decolagens;
      }
    }
  });

  return processedData;
};
