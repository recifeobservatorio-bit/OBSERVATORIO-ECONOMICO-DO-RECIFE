import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";

export const processValoresImportacaoExportacaoPorAno = (
  data: BalancaHeaders[]
): { ano: string; importacao: number; exportacao: number }[] => {

  const anos = Array.from(new Set(data.map((item) => item["Ano"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({
    ano: String(ano),
    importacao: 0,
    exportacao: 0,
  }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data.forEach((item) => {
    const valor = item["Valor US$"] || 0;
    const tipo = item["tipo"];

    const index = indexByAno.get(item["Ano"]);
    if (index !== undefined) {
      if (tipo === "Importação") {
        processedData[index].importacao += valor;
      } else if (tipo === "Exportação") {
        processedData[index].exportacao += valor;
      }
    }
  });

  return processedData;
};
