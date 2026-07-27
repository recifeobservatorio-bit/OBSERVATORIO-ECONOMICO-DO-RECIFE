export const processEmpresasAtivasPorAno = (
  data: any[]
): { ano: string; empresas: number }[] => {

  const anos = Array.from(new Set(data.map((item) => item["Ano"]))).sort((a, b) => a - b);

  const processedData = anos.map((ano) => ({ ano: String(ano), empresas: 0 }));
  const indexByAno = new Map(anos.map((ano, i) => [ano, i]));

  data.forEach((item) => {
    const empresas = item["Empresas Ativas"] || 0;
    const index = indexByAno.get(item["Ano"]);
    if (index !== undefined) {
      processedData[index].empresas += empresas;
    }
  });

  return processedData;
};
