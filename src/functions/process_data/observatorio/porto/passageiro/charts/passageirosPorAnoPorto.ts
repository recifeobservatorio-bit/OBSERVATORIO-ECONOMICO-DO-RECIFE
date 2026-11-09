import { PortoPassageirosHeaders } from "@/@types/observatorio/@fetch/porto";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

interface ProcessedPassageirosAno {
  ano: string;
  passageiros: number;
  variation: number;
}

interface ProcessedPassageirosMes {
  mes: string;
  passageiros: number;
  variation: number | null;
}

// Total de passageiros por mês (série histórica completa, todos os anos) — um ponto por
// mês, usado pelos gráficos de linha. "variation" é a variação % contra o mesmo mês do
// ano anterior (null quando não há mês correspondente no ano anterior).
export const processPassageirosPorMesTodosAnos = (rows: PortoPassageirosHeaders[]): ProcessedPassageirosMes[] => {
  const porMes: Record<string, number> = {};

  rows?.forEach((item) => {
    const ano = Number(item.Ano);
    const mesIndex = Number(item.Mes) - 1;
    if (mesIndex < 0 || mesIndex > 11) return;
    const key = `${ano}-${String(mesIndex).padStart(2, "0")}`;
    porMes[key] = (porMes[key] || 0) + (item.Passageiros || 0);
  });

  const keys = Object.keys(porMes).sort();

  return keys.map((key) => {
    const [anoStr, mesStr] = key.split("-");
    const ano = Number(anoStr);
    const mesIndex = Number(mesStr);
    const passageiros = porMes[key];

    const anoAnteriorKey = `${ano - 1}-${mesStr}`;
    const passageirosAnoAnterior = porMes[anoAnteriorKey];
    const variation = passageirosAnoAnterior
      ? +(((passageiros - passageirosAnoAnterior) / passageirosAnoAnterior) * 100).toFixed(2)
      : null;

    return { mes: `${MESES[mesIndex]}/${ano}`, passageiros, variation };
  });
};

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
