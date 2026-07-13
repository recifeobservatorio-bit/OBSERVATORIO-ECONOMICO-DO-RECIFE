import { IpcaData } from "@/@api/http/to-charts/ipca/IPCAData";
import { IpcaDataResult, IpcaGeralData, IpcaGrupoData } from "@/@types/observatorio/@data/ipcaData";
import { IpcaTabelaHeaders } from "@/@types/observatorio/@fetch/ipca";
import { DataWithFilters, Filters } from "@/@types/observatorio/shared";
import { getRawData } from "@/utils/filters/@data/getRawData";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { filterByYear } from "@/utils/filters/@features/filterByYear";

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

    return { geral: geralFiltered, id: "ipca" };
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
