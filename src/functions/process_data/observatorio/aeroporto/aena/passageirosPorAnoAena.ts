import { AenaPassageirosHeaders } from "@/@types/observatorio/@fetch/aeroporto";

export const processPassageirosPorAnoAena = (data: AenaPassageirosHeaders[]) => {
  const anos = Array.from(new Set(data.map((item) => item["Ano"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({ ano: String(ano), passageiros: 0 }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data?.forEach((item: AenaPassageirosHeaders) => {
    const passageiros = item["Passageiros"] || 0;
    const index = indexByAno.get(item["Ano"]);
    if (index !== undefined) {
      processedData[index].passageiros += passageiros;
    }
  });

  return processedData;
};
