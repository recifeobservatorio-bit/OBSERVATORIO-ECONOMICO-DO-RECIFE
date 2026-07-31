export const processEmpresasClassesPorAno = (
  data: any[]
): { ano: string; empresas: number }[] => {
  const recife = data.filter((item) => item["Municipio"] === "Recife");

  const anos = Array.from(new Set(recife.map((item) => item["Ano"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({ ano: String(ano), empresas: 0 }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  recife.forEach((item) => {
    const empresas = item["Estabelecimentos"] || 0;
    const index = indexByAno.get(item["Ano"]);
    if (index !== undefined) {
      processedData[index].empresas += empresas;
    }
  });

  return processedData;
};
