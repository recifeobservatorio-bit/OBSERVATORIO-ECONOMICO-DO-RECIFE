import { monthShortName } from "@/utils/formatters/@global/monthShortName";

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

// Igual a processEmpresasDataLineGraphPorAno, mas agrupando por (Ano, mês) — série
// histórica completa, um ponto pra cada mês de cada ano disponível.
export const processEmpresasClassesPorAnoMes = (
  data: any[]
): { label: string; empresas: number }[] => {
  const recife = data.filter((item) => item["Municipio"] === "Recife");

  const sums = new Map<string, { ano: number; mes: number; empresas: number }>();

  recife.forEach((item) => {
    const ano = item["Ano"];
    const mes = Number(item["mes"]);
    if (ano == null || !mes || mes < 1 || mes > 12) return;
    const key = `${ano}-${mes}`;
    const acc = sums.get(key) || { ano, mes, empresas: 0 };
    acc.empresas += item["Estabelecimentos"] || 0;
    sums.set(key, acc);
  });

  return Array.from(sums.values())
    .sort((a, b) => a.ano * 100 + a.mes - (b.ano * 100 + b.mes))
    .map(({ ano, mes, empresas }) => ({
      label: `${monthShortName(mes)}/${ano}`,
      empresas,
    }));
};
