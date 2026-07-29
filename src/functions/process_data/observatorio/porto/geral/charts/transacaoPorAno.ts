import { PortoAtracacaoHeaders, PortoCargaHeaders } from "@/@types/observatorio/@fetch/porto";

// Mesma lógica de processAtracacoesPorMes, mas agrupando por "Ano" em vez de "Mes" —
// usada pelo modo "Ano" do toggle Mês/Ano (série histórica multianual).
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
