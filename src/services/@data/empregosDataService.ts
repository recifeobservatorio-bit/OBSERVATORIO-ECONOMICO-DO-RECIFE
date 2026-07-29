import { EmpregosData } from "@/@api/http/to-charts/empregos/EmpregosData";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";

// Soma os campos indicados por ano — usada pela série histórica multianual do toggle Mês/Ano.
function sumByAno(rows: any[], fields: string[]) {
  const byAno: Record<string, any> = {};
  rows.forEach((r) => {
    const ano = String(r.Ano);
    if (!byAno[ano]) byAno[ano] = { Ano: ano };
    fields.forEach((f) => {
      byAno[ano][f] = (byAno[ano][f] || 0) + (r[f] || 0);
    });
  });
  return Object.values(byAno).sort((a: any, b: any) => String(a.Ano).localeCompare(String(b.Ano)));
}

export class EmpregosDataService {
  private static instance: EmpregosDataService;

  private currentYear: string = "2024";

  private dataCache: Record<string, any> = {};

  private constructor() {}

  public static getInstance(): EmpregosDataService {
    if (!EmpregosDataService.instance) {
      EmpregosDataService.instance = new EmpregosDataService();
    }
    return EmpregosDataService.instance;
  }

  public setYear(year: string) {
    this.currentYear = year;
  }

  private getCacheKey(tab: string, filters: Record<string, any>): string {
    return `${tab}-${this.currentYear}-${JSON.stringify(filters.additionalFilters)}`;
  }

  private async fetchGeralCaged(filters: any) {
    const empregosData = new EmpregosData(this.currentYear);
    // const pastYear = `${+this.currentYear - 1}`;

    const fetchData = await empregosData.fetchProcessedDataCaged();

    // tanto faz, o ideial é filtrar somente por municipio. Ignora também 'Mes' porque
    // esse campo alimenta gráficos de linha (RelatorioAno/SaldoAno) que mostram o ano inteiro —
    // filtrar por um mês selecionado faria a linha virar um ponto só.
    const filteredMunicipioData = applyGenericFilters(fetchData,  filters, ['Região', 'UF', 'Mes']);
    // tudo menos filtrar por municipio
    const filteredCagedData = applyGenericFilters(fetchData, filters, ['Municipio']);

    // Mesmo recorte de filteredMunicipioData, mas com a série histórica completa (todos os
    // anos), somada por ano — usada pelo modo "Ano" do toggle Mês/Ano (RelatorioAno/SaldoAno).
    const allYearsData = await empregosData.fetchAllYearsCaged();
    const filteredMunicipioPorAno = applyGenericFilters(allYearsData, filters, ['Região', 'UF', 'Mes']);
    const municipiosPorAno = sumByAno(filteredMunicipioPorAno.filteredData, ["Saldos", "Admissões", "Demissões"]);

    return {
        municipios: filteredMunicipioData,
        municipiosPorAno,
        caged: filteredCagedData,
        id: "empregos-caged"
    };
  }

  private async fetchGeralCagedDesemprego(filters: any) {
    const empregosData = new EmpregosData(this.currentYear);
    const pastYear = `${+this.currentYear - 1}`;

    // const fetchData = await empregosData.fetchProcessedDataCagedDesemprego();

    const [
      empregosCur,
      empregosPast,
    ] = await Promise.all([
      empregosData.fetchProcessedDataCagedDesemprego(),
      new EmpregosData(pastYear).fetchProcessedDataCagedDesemprego().catch(() => []),
    ]);

    
    // tanto faz, o ideial é filtrar somente por municipio
    const filteredMunicipioData = applyGenericFilters(empregosCur, filters, ['Região', 'Trimestre']);
    const filteredMunicipioPastData = applyGenericFilters(empregosPast, filters, ['Região', 'Trimestre'], ['Trimestre']);
    const filteredMunicipioTrimestreData = applyGenericFilters(empregosCur, filters, ['Região']);
    // tudo menos filtrar por municipio
    const filteredDesempregoData = applyGenericFilters(empregosCur, filters, ['Capital']);
    
    return {
        municipios: filteredMunicipioData,
        desemprego: filteredDesempregoData,
        trimestre: {
          municipiosTrimestre: filteredMunicipioTrimestreData,
          municipiosTrimestrePast: filteredMunicipioPastData,
        },
        id: "dempregos-caged"
    };
  }

  public async fetchDataForTab(tab: string, filters: Record<string, any>): Promise<any> {
    const cacheKey = this.getCacheKey(tab, filters);

    if (this.dataCache[cacheKey]) {
      return this.dataCache[cacheKey];
    }

    let data;
    if (tab === "desemprego") {
      data = await this.fetchGeralCagedDesemprego(filters);
    } else {
      data = await this.fetchGeralCaged(filters);
    }

    this.dataCache[cacheKey] = data;
    return data;
  }

  public clearCache() {
    this.dataCache = {};
  }
}

export const empregosDataService = EmpregosDataService.getInstance();
