export const processVariacaoEmpresasAtivasPorAno = (
  data: any[]
): { ano: string; empresas: string }[] => {

  const anos = Array.from(new Set(data.map((item) => item["Ano"]))).sort((a, b) => a - b);

  const totalPorAno = new Map<number, number>();
  anos.forEach((ano) => totalPorAno.set(ano, 0));
  data.forEach((item) => {
    const empresas = item["Empresas Ativas"] || 0;
    totalPorAno.set(item["Ano"], (totalPorAno.get(item["Ano"]) || 0) + empresas);
  });

  return anos.slice(1).map((ano, i) => {
    const anterior = totalPorAno.get(anos[i]) || 0;
    const atual = totalPorAno.get(ano) || 0;
    const variacao = anterior !== 0 ? ((atual - anterior) / anterior) * 100 : 0;
    return { ano: String(ano), empresas: variacao.toFixed(2) };
  });
};
