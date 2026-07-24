import { MicroCagedData } from "@/@api/http/to-charts/micro_caged/MicroCagedData";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { applyHashedFilters } from "@/utils/filters/@features/applyHashedFilters";
import { gropoHash } from "@/utils/hashs/micro-caged/gropoHash";

export class MicroCagedDataService {
  private static instance: MicroCagedDataService;

  private currentYear: string = "2024";

  private dataCache: Record<string, any> = {};

  private constructor() {}

  public static getInstance(): MicroCagedDataService {
    if (!MicroCagedDataService.instance) {
      MicroCagedDataService.instance = new MicroCagedDataService();
    }
    return MicroCagedDataService.instance;
  }

  public setYear(year: string) {
    this.currentYear = year;
  }

  private getCacheKey(tab: string, filters: Record<string, any>): string {
    return `${tab}-${this.currentYear}-${JSON.stringify(filters.additionalFilters)}`;
  }

  private async fetchGeral(filters: any) {
    const filtersHashed = applyHashedFilters(filters, 'grupamento', 'seção', gropoHash)

    const microCagedData = new MicroCagedData(this.currentYear);

    const fetchData = await microCagedData.fetchProcessedDataMicroCaged()

    const filteredData = {
      ...applyGenericFilters(fetchData, filtersHashed, ['grupamento']),
      // Usado só pelo comparativo-mov (ComparativoMovimentacao/ComparativoSaldo, linhas por
      // mês) — ignora também 'mês', senão a linha vira um ponto só quando um mês é selecionado.
      filteredDataSemMes: applyGenericFilters(fetchData, filtersHashed, ['grupamento', 'mês']).filteredData,
    };

    return {
      microCaged: filteredData,
      id: "empregos-micro-caged",
    };
  }

  private async fetchMedia(filters: any) {
    const microCagedData = new MicroCagedData(this.currentYear);
    const pastYear = `${+this.currentYear - 1}`

    const [microCagedCur, microCagedPast] = await Promise.all([microCagedData.fetchProcessedDataMicroCaged(), new MicroCagedData(pastYear).fetchProcessedDataMicroCaged().catch(() => [])])

    // comparativo-med (ComparativoMedia/ComparativoVariacao) só tem gráficos de linha por mês —
    // ignora o filtro de 'mês' aqui, senão a linha vira um ponto só quando um mês é selecionado.
    const filteredDataCur = applyGenericFilters(microCagedCur, filters, ['mês'])
    const filteredDataPast = applyGenericFilters(microCagedPast, filters, ['mês'])

    // const fetchData = await microCagedData.fetchProcessedDataMicroCaged() 

    // const filteredData = applyGenericFilters(fetchData, filters);

    return {
      // microCaged: filteredDataCur,
      microCaged: {
        current: filteredDataCur,
        past: filteredDataPast
      },
      id: "empregos-micro-caged-media",
    };
  }


  public async fetchDataForTab(tab: string, filters: Record<string, any>): Promise<any> {
    const cacheKey = this.getCacheKey(tab, filters);

    if (this.dataCache[cacheKey]) {
      return this.dataCache[cacheKey];
    }

    let data;
    if (tab === "comparativo-med") {
      data = await this.fetchMedia(filters);
    } else {
      data = await this.fetchGeral(filters);
    }

    this.dataCache[cacheKey] = data;
    return data;
  }

  public clearCache() {
    this.dataCache = {};
  }
}

export const microCagedDataService = MicroCagedDataService.getInstance();
