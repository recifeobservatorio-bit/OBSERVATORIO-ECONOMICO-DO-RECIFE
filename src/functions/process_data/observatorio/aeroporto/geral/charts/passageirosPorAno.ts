import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";

export const processPassageirosPorAno = (data: AnacGeralHeaders[]) => {
  const anos = Array.from(new Set(data.map((item) => item["ANO"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({ ano: String(ano), passageiros: 0 }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data.forEach((item: AnacGeralHeaders) => {
    const passageiros = item["PASSAGEIRO"] || 0;
    const index = indexByAno.get(item["ANO"]);
    if (index !== undefined) {
      processedData[index].passageiros += passageiros;
    }
  });

  return processedData;
};
