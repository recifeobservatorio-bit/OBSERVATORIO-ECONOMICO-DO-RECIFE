import { PortoPassageirosHeaders } from "@/@types/observatorio/@fetch/porto";

interface ProcessedPassageirosAno {
  ano: string;
  passageiros: number;
  variation: number;
}

// Total de passageiros por ano (série histórica multianual) — usada pelo modo "Ano"
// do toggle Mês/Ano, contraponto ao current-vs-past mensal de processPassageirosAnoPorto.
export const processPassageirosPorAnoPorto = (rows: PortoPassageirosHeaders[]): ProcessedPassageirosAno[] => {
  const porAno: Record<string, number> = {};

  rows?.forEach((item) => {
    const ano = String(item.Ano);
    porAno[ano] = (porAno[ano] || 0) + (item.Passageiros || 0);
  });

  const anos = Object.keys(porAno).sort();

  return anos.map((ano, i) => {
    const passageiros = porAno[ano];
    const anoAnterior = anos[i - 1];
    const passageirosAnoAnterior = anoAnterior ? porAno[anoAnterior] : undefined;
    const variation = passageirosAnoAnterior
      ? +(((passageiros - passageirosAnoAnterior) / passageirosAnoAnterior) * 100).toFixed(2)
      : 0;

    return { ano, passageiros, variation };
  });
};
