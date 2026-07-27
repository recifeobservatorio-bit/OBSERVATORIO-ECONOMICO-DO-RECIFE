import { AenaCargasHeaders } from "@/@types/observatorio/@fetch/aeroporto";

export const processCargaPorAnoAena = (data: AenaCargasHeaders[]) => {
  const anos = Array.from(new Set(data.map((item) => item["Ano"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({ ano: String(ano), quantidade: 0 }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data.forEach((item: AenaCargasHeaders) => {
    const quantidade = item["Quantidade"] || 0;
    const index = indexByAno.get(item["Ano"]);
    if (index !== undefined) {
      processedData[index].quantidade += quantidade;
    }
  });

  return processedData;
};
