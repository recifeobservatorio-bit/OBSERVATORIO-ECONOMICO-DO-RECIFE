import { fetchCnaeHistoricoRaw } from "@/@api/http/to-charts/economia-criativa/CnaeHistoricoData";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";

// Decora só um alias amigável — "Subclasse" em vez do nome de coluna literal do parquet (que
// tem espaço/hífen e não daria um rótulo de filtro legível).
function decorateRows(rows: any[]): any[] {
  return rows.map((row) => ({
    ...row,
    Subclasse: row["CNAE 2.0 Subclasse - Codigo"],
    Categoria: row["Classe"],
  }));
}

export class CnaeHistoricoDataService {
  private static instance: CnaeHistoricoDataService;

  // Cacheia só as linhas decoradas — reaplica applyGenericFilters a cada chamada, senão trocar
  // um checkbox de filtro não muda o resultado.
  private rowsCache: any[] | null = null;

  private constructor() {}

  public static getInstance(): CnaeHistoricoDataService {
    if (!CnaeHistoricoDataService.instance) {
      CnaeHistoricoDataService.instance = new CnaeHistoricoDataService();
    }
    return CnaeHistoricoDataService.instance;
  }

  // O parquet já tem uma coluna "Ano" real e o filtro é feito via additionalFilters (seleção
  // default 2025 em cnaeHistoricoFilters.ts) — não pelo seletor especial de Ano do topo.
  public setYear(_year: string) {}

  public async fetchDataForTab(_tab: string, filters: any): Promise<any> {
    if (!this.rowsCache) {
      this.rowsCache = decorateRows((await fetchCnaeHistoricoRaw()) || []);
    }

    // Mesma chave "empresasEconomiaCriativa" de antes — mantém page.tsx/routeServicesMap sem
    // precisar trocar o nome em cascata.
    return {
      empresasEconomiaCriativa: applyGenericFilters(this.rowsCache, filters),
      id: "cnae-historico",
    };
  }

  public clearCache() {
    this.rowsCache = null;
  }
}

export const cnaeHistoricoDataService = CnaeHistoricoDataService.getInstance();
