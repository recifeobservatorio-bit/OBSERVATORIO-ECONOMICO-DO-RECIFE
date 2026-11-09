import { EmpregosData } from "@/@api/http/to-charts/empregos/EmpregosData";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { computeAvailableYears } from "@/utils/filters/@features/computeAvailableYears";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";

// Soma os campos indicados por (ano, mês) — série histórica completa (todos os anos) por
// mês, usada pelos gráficos de linha RelatorioAno/SaldoAno.
function sumByAnoMes(rows: any[], fields: string[]) {
  const byKey: Record<string, any> = {};
  rows.forEach((r) => {
    const ano = Number(r.Ano);
    const mes = Number(r.Mes);
    const key = `${ano}-${String(mes).padStart(2, "0")}`;
    if (!byKey[key]) byKey[key] = { Ano: ano, Mes: mes, "Mês": `${monthShortName(mes)}/${ano}` };
    fields.forEach((f) => {
      byKey[key][f] = (byKey[key][f] || 0) + (r[f] || 0);
    });
  });
  return Object.values(byKey).sort((a: any, b: any) => a.Ano - b.Ano || a.Mes - b.Mes);
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
    // anos), somada por (ano, mês) — usada pelos gráficos de linha RelatorioAno/SaldoAno, que
    // sempre mostram a série mensal inteira, não só o ano selecionado.
    const allYearsData = await empregosData.fetchAllYearsCaged();
    const filteredMunicipioPorAno = applyGenericFilters(allYearsData, filters, ['Região', 'UF', 'Mes']);
    const municipiosPorMes = sumByAnoMes(filteredMunicipioPorAno.filteredData, ["Saldos", "Admissões", "Demissões"]);
    const yearsOptions = computeAvailableYears(allYearsData, (r: any) => r.Ano);

    return {
        municipios: { ...filteredMunicipioData, yearsOptions },
        municipiosPorMes,
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

    const allYearsDesemprego = await empregosData.fetchAllYearsCagedDesemprego();
    const yearsOptions = computeAvailableYears(allYearsDesemprego, (r: any) => r.Ano);

    // Série histórica (todos os anos) da capital filtrada + Brasil como referência,
    // pro gráfico de linha trimestral — com só o ano selecionado ele virava 1 a 4 pontos.
    const historicoCapital = applyGenericFilters(allYearsDesemprego, filters, ['Região', 'Trimestre']).filteredData;
    const historicoBrasil = allYearsDesemprego.filter((r: any) => r.Capital === 'Brasil');

    return {
        municipios: { ...filteredMunicipioData, yearsOptions },
        historico: { capital: historicoCapital, brasil: historicoBrasil },
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
