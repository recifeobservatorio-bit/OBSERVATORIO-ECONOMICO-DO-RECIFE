import { IpcaData } from "@/@api/http/to-charts/ipca/IPCAData";
import { IpcaDataResult, IpcaGeralData, IpcaGrupoData } from "@/@types/observatorio/@data/ipcaData";
import { IpcaGeralHeaders, IpcaTabelaHeaders } from "@/@types/observatorio/@fetch/ipca";
import { DataWithFilters, Filters } from "@/@types/observatorio/shared";
import { getRawData } from "@/utils/filters/@data/getRawData";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { filterByYear } from "@/utils/filters/@features/filterByYear";

// IPCA anual por capital: pega, em cada (Ano, Capital), o valor de "Variação acumulado
// no ano" no último mês disponível daquele ano — é a forma padrão de reportar a inflação
// anual do IPCA (soma os "Variação mensal" mês a mês, como o modo "Mês" faz, distorceria
// o resultado por não compor as taxas corretamente). Usada pelo modo "Ano" do toggle Mês/Ano.
function buildIpcaPorAno(rows: IpcaGeralHeaders[]) {
  const byAnoCapital: Record<string, Record<string, { mes: number; valor: number }>> = {};

  rows.forEach((r) => {
    const ano = String(r.Ano);
    const capital = r.Capital;
    if (!byAnoCapital[ano]) byAnoCapital[ano] = {};
    const atual = byAnoCapital[ano][capital];
    if (!atual || r["MÊS"] > atual.mes) {
      byAnoCapital[ano][capital] = { mes: r["MÊS"], valor: r["IPCA - Variação acumulado no ano"] };
    }
  });

  return Object.keys(byAnoCapital).sort().map((ano) => {
    const entry: any = { ano };
    Object.entries(byAnoCapital[ano]).forEach(([capital, v]) => {
      entry[capital] = v.valor;
    });
    return entry;
  });
}

export class IpcaDataService {
  private static instance: IpcaDataService;
  private currentYear: string = "2024";
  private dataCache: Record<string, IpcaDataResult> = {};

  private constructor() {}

  public static getInstance(): IpcaDataService {
    if (!IpcaDataService.instance) {
      IpcaDataService.instance = new IpcaDataService();
    }
    return IpcaDataService.instance;
  }

  public setYear(year: string) {
    this.currentYear = year;
  }

  private getCacheKey(tab: string, filters: Filters): string {
    return `${tab}-${this.currentYear}-${JSON.stringify(
      filters.additionalFilters
    )}`;
  }

  private async fetchIpcaGeralData(filters: Filters): Promise<{ id: "ipca"; geral: IpcaGeralData }> {

    const ipcaService = new IpcaData(this.currentYear);
    const geralAllYears = await ipcaService.fetchProcessedGeralData();
    const geral = filterByYear(geralAllYears, this.currentYear, "Ano");
    const rawData = applyGenericFilters(geral, filters, ['Capital'])
    const geralFiltered = {...applyGenericFilters(geral, filters, ['MÊS']), rawData: rawData.filteredData};

    // Mesmo recorte de geralFiltered, mas com a série histórica completa (todos os anos) —
    // usada pelo modo "Ano" do toggle Mês/Ano (IpcaPorMeses/IpcaBrasilPorMeses).
    const geralPorAnoFiltered = applyGenericFilters(geralAllYears, filters, ['MÊS']);
    const porAno = buildIpcaPorAno(geralPorAnoFiltered.filteredData);

    return { geral: { ...geralFiltered, porAno }, id: "ipca" };
  }

  private async fetchIpcaGruposData(filters: Filters): Promise<{ id: "ipca-grupos"; grupos: IpcaGrupoData }> {
    const ipcaService = new IpcaData(this.currentYear);
    const gruposAllYears = await ipcaService.fetchProcessedGruposData();
    const grupos = filterByYear(gruposAllYears, this.currentYear, "ANO");
    const gruposFiltered = applyGenericFilters(grupos, filters);

    return { grupos: gruposFiltered, id: "ipca-grupos" };
  }

  private async fetchIpcaTabelasData(filters: Filters): Promise<{ id: "ipca-tabelas"; tabelas: DataWithFilters<IpcaTabelaHeaders>; geral: IpcaGeralData }> {
    const ipcaService = new IpcaData(this.currentYear);

    const [tabelasAllYears, geralAllYears] = await Promise.all([
      ipcaService.fetchProcessedTabelasData(),
      ipcaService.fetchProcessedGeralData(),
    ]);
    const tabelas = filterByYear(tabelasAllYears, this.currentYear, "Ano");
    const geral = filterByYear(geralAllYears, this.currentYear, "Ano");

    const tabelasFiltered = applyGenericFilters(tabelas, filters);
    const geralFiltered = applyGenericFilters(geral, filters);

    return { tabelas: tabelasFiltered, geral: geralFiltered, id: "ipca-tabelas" };
  }

  public async fetchDataForTab(tab: string, filters: Filters) {
    // Agora usamos getCacheKey que recebe (tab, filters)
    const cacheKey = this.getCacheKey(tab, filters);

    // Se já existe no cache com as mesmas seleções:
    if (this.dataCache[cacheKey]) {
      return this.dataCache[cacheKey];
    }

    let data;
    if (tab === "analitico") {
      data = await this.fetchIpcaTabelasData(filters);
    } else if (tab === "grupos") {
      data = await this.fetchIpcaGruposData(filters);
    } else {
      data = await this.fetchIpcaGeralData(filters);
    }

    this.dataCache[cacheKey] = data;
    return data;
  }
}

export const ipcaDataService = IpcaDataService.getInstance();
