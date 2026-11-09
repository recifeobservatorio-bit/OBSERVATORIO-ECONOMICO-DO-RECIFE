import { PortoAtracacaoHeaders, PortoCargaHeaders } from "@/@types/observatorio/@fetch/porto";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Mesma lógica de processAtracacoesPorMes, mas agrupando por (Ano, Mes) em vez de só "Mes" —
// série histórica completa (todos os anos), um ponto por mês, usada pelos gráficos de linha.
export const processAtracacoesPorMesTodosAnos = (atracacoes: PortoAtracacaoHeaders[], cargas: PortoCargaHeaders[]) => {
  const cargasFiltradas = cargas.filter((carga) =>
    atracacoes.some((atracacao) => Number(atracacao.IDAtracacao) === Number(carga.IDAtracacao))
  );

  const porMes: Record<string, any> = {};

  cargasFiltradas.forEach((carga) => {
    const vlPesoCargaBruta = carga.VLPesoCargaBruta || 0;
    const atracacao = atracacoes.find((a) => +a.IDAtracacao === +carga.IDAtracacao);
    if (!atracacao) return;

    const ano = Number(atracacao.Ano);
    const mesIndex = Number(atracacao.Mes) - 1;
    if (mesIndex < 0 || mesIndex > 11) return;

    const key = `${ano}-${String(mesIndex).padStart(2, "0")}`;
    if (!porMes[key]) {
      porMes[key] = {
        mes: `${MESES[mesIndex]}/${ano}`,
        totalVLPesoCargaBruta: 0,
        outrosCarga: 0,
        cabotagemCarga: 0,
        exportacaoCarga: 0,
        importacaoCarga: 0,
      };
    }

    porMes[key].totalVLPesoCargaBruta += vlPesoCargaBruta;

    switch (carga["Tipo Operação da Carga"].toLowerCase()) {
      case "apoio":
      case "outros":
        porMes[key].outrosCarga += vlPesoCargaBruta;
        break;
      case "cabotagem":
        porMes[key].cabotagemCarga += vlPesoCargaBruta;
        break;
      case "longo curso exportação":
        porMes[key].exportacaoCarga += vlPesoCargaBruta;
        break;
      case "longo curso importação":
        porMes[key].importacaoCarga += vlPesoCargaBruta;
        break;
    }
  });

  return Object.keys(porMes)
    .sort()
    .map((key) => porMes[key]);
};

// Mesma lógica de processAtracacoesPorMes, mas agrupando por "Ano" em vez de "Mes" —
// mantida por compatibilidade (não usada pelos gráficos de linha, que agora mostram
// sempre a série completa por mês via processAtracacoesPorMesTodosAnos).
export const processAtracacoesPorAno = (atracacoes: PortoAtracacaoHeaders[], cargas: PortoCargaHeaders[]) => {
  const cargasFiltradas = cargas.filter((carga) =>
    atracacoes.some((atracacao) => Number(atracacao.IDAtracacao) === Number(carga.IDAtracacao))
  );

  const porAno: Record<string, any> = {};

  cargasFiltradas.forEach((carga) => {
    const vlPesoCargaBruta = carga.VLPesoCargaBruta || 0;
    const atracacao = atracacoes.find((a) => +a.IDAtracacao === +carga.IDAtracacao);
    if (!atracacao) return;

    const ano = String(atracacao.Ano);
    if (!porAno[ano]) {
      porAno[ano] = {
        ano,
        totalVLPesoCargaBruta: 0,
        outrosCarga: 0,
        cabotagemCarga: 0,
        exportacaoCarga: 0,
        importacaoCarga: 0,
      };
    }

    porAno[ano].totalVLPesoCargaBruta += vlPesoCargaBruta;

    switch (carga["Tipo Operação da Carga"].toLowerCase()) {
      case "apoio":
      case "outros":
        porAno[ano].outrosCarga += vlPesoCargaBruta;
        break;
      case "cabotagem":
        porAno[ano].cabotagemCarga += vlPesoCargaBruta;
        break;
      case "longo curso exportação":
        porAno[ano].exportacaoCarga += vlPesoCargaBruta;
        break;
      case "longo curso importação":
        porAno[ano].importacaoCarga += vlPesoCargaBruta;
        break;
    }
  });

  return Object.values(porAno).sort((a: any, b: any) => a.ano.localeCompare(b.ano));
};
