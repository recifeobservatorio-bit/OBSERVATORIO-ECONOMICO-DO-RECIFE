import { fetchRfcRaw } from "@/@api/http/to-charts/economia-criativa/RfcData";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";

// Decora com "Ano"/"Mês" (a partir de DATA DA SOLICITAÇÃO — é a data-base do relatório de
// referência: o "Período" do cabeçalho dele, 22/04/2025 a 24/08/2026, é exatamente o intervalo
// dessa coluna; colunas DATE do parquet chegam como
// algo aceito por `new Date(...)`, não string ISO pronta pra slice, ver EmpresasPorAno.tsx) e
// aliases amigáveis pros 3 campos que já existiam crus (Tipo de Obra/Porte/Status de Aprovação) —
// os 5 filtros do relatório de referência (Ano/Mês/Tipo de Obra/Porte/Status de Aprovação).
function decorateRows(rows: any[]): any[] {
  return rows.map((row) => {
    const dataSolicitacao = row["DATA DA SOLICITAÇÃO"];
    const date = dataSolicitacao ? new Date(dataSolicitacao) : null;
    return {
      ...row,
      Ano: date ? String(date.getUTCFullYear()) : null,
      Mês: date ? monthShortName(date.getUTCMonth() + 1) : null,
      "Tipo de Obra": row["TIPO DE OBRA"],
      Porte: row["PORTE DA PRODUÇÃO (AUTO-DECLARAÇÃO)"],
      "Status de Aprovação": row["Status Autorização"],
      Produção: row["NOME DA OBRA ATENDIDA"],
    };
  });
}

export class RfcDataService {
  private static instance: RfcDataService;

  // Cacheia só as linhas decoradas — reaplica applyGenericFilters a cada chamada, senão trocar
  // um checkbox de filtro não muda o resultado (mesmo motivo do
  // empresasEconomiaCriativaDataService).
  private rowsCache: any[] | null = null;

  private constructor() {}

  public static getInstance(): RfcDataService {
    if (!RfcDataService.instance) {
      RfcDataService.instance = new RfcDataService();
    }
    return RfcDataService.instance;
  }

  // rfc.parquet não é particionado por ano — no-op pra satisfazer a interface Service<T>. O
  // filtro "Ano" da aba é feito via additionalFilters (campo decorado), não via esse mecanismo.
  public setYear(_year: string) {}

  public async fetchDataForTab(_tab: string, filters: any): Promise<any> {
    if (!this.rowsCache) {
      this.rowsCache = decorateRows((await fetchRfcRaw()) || []);
    }

    // Mesmo motivo do empresasEconomiaCriativaDataService: DashboardContext espera
    // {filteredData, additionalFiltersOptions}, não um array cru.
    return {
      rfc: {
        ...applyGenericFilters(this.rowsCache, filters),
        // Para os gráficos de linha (ex.: Locações/Produções ao longo do tempo) — um gráfico
        // de linha nunca deve obedecer ao filtro de mês, senão a série colapsa num ponto só
        // quando um mês é selecionado.
        filteredDataSemMes: applyGenericFilters(this.rowsCache, filters, ["Mês"]).filteredData,
      },
      id: "rfc",
    };
  }

  public clearCache() {
    this.rowsCache = null;
  }
}

export const rfcDataService = RfcDataService.getInstance();
