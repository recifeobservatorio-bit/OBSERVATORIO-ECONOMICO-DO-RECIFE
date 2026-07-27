import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";

export const processCargaPorAno = (data: AnacGeralHeaders[]) => {
  const anos = Array.from(new Set(data.map((item) => item["ANO"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({ ano: String(ano), carga: 0 }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data.forEach((item: AnacGeralHeaders) => {
    const carga = item["CARGA"] || 0;
    const index = indexByAno.get(item["ANO"]);
    if (index !== undefined) {
      processedData[index].carga += carga;
    }
  });

  return processedData;
};
