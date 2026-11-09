import { EconomiaCriativaRaisData } from "@/@api/http/to-charts/economia-criativa/EconomiaCriativaRaisData";
import { raisGrupoDicts } from "@/utils/dicts/rais/raisGrupoDicts";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";

// Mesmos ranges de "divisão" CNAE usados por cnaeAccFunction (geralFuncition.ts), mas em Title
// Case porque aqui vira opção de filtro visível ao usuário (os gráficos usam a versão minúscula
// do cnaeAccFunction, que é um cálculo separado — não precisa bater com esse texto).
function classificarSetorProdutivo(divisao: number): string {
  if (divisao >= 1 && divisao <= 3) return "Agricultura";
  if (divisao >= 5 && divisao <= 39) return "Indústria";
  if (divisao >= 41 && divisao <= 43) return "Construção";
  if (divisao >= 45 && divisao <= 47) return "Comércio";
  if (divisao >= 49 && divisao <= 99) return "Serviço";
  return "Não identificado";
}

// Decora cada linha com "Setor Produtivo" (grande grupo CNAE), "Categoria" (grupo CNAE de 3
// dígitos, via o mesmo dicionário usado pelos gráficos de Grupo do RAIS geral) e "Subclasse"
// (cópia de "CNAE Código" com rótulo amigável) — os 3 filtros extras do relatório de referência,
// que só existem como campos derivados (não vêm prontos do parquet).
function decorateRows(rows: any[]): any[] {
  return rows.map((row) => {
    const cnae = row["CNAE Código"];
    if (!cnae) return row;
    return {
      ...row,
      "Setor Produtivo": classificarSetorProdutivo(Number(cnae.slice(0, 2))),
      Categoria: raisGrupoDicts[cnae.slice(0, 3)] || "Não identificado",
      Subclasse: cnae,
    };
  });
}

export class EconomiaCriativaDataService {
  private static instance: EconomiaCriativaDataService;

  private currentYear: string = "2025";

  private dataCache: Record<string, any> = {};

  private constructor() {}

  public static getInstance(): EconomiaCriativaDataService {
    if (!EconomiaCriativaDataService.instance) {
      EconomiaCriativaDataService.instance = new EconomiaCriativaDataService();
    }
    return EconomiaCriativaDataService.instance;
  }

  public setYear(year: string) {
    this.currentYear = year;
  }

  private getCacheKey(tab: string, filters: Record<string, any>): string {
    return `${tab}-${this.currentYear}-${JSON.stringify(filters.additionalFilters)}`;
  }

  // "ativ" (Vínculo Ativo 31/12 = '1') alimenta Perfil / Empregos por Setor / Empregos por
  // Empresas / Salários / Negócios Criativos; "noAtiv" (= '0') alimenta a aba Movimentação — mesma
  // separação usada pelo RAIS geral (raisDataService.ts), validada batendo com os KPIs do Power BI
  // de referência (24.880 ativos / 9.085 desligamentos em 2025, ver conversa/memória do projeto).
  private async fetchGeral(filters: any) {
    const raisData = new EconomiaCriativaRaisData(this.currentYear);

    const fetchData = decorateRows(await raisData.fetchProcessedDataRais());
    const yearsOptions = await EconomiaCriativaRaisData.probeAvailableYears();

    const filteredDataAtiv = { ...applyGenericFilters(fetchData.filter((data) => data["Vínculo Ativo 31/12"] == "1"), filters), yearsOptions };
    const filteredDataNoAtiv = applyGenericFilters(fetchData.filter((data) => data["Vínculo Ativo 31/12"] == "0"), filters);

    return {
      economiaCriativa: {
        ativ: filteredDataAtiv,
        noAtiv: filteredDataNoAtiv,
      },
      id: "economia-criativa-rais",
    };
  }

  public async fetchDataForTab(tab: string, filters: Record<string, any>): Promise<any> {
    const cacheKey = this.getCacheKey(tab, filters);

    if (this.dataCache[cacheKey]) {
      return this.dataCache[cacheKey];
    }

    const data = await this.fetchGeral(filters);

    this.dataCache[cacheKey] = data;
    return data;
  }

  public clearCache() {
    this.dataCache = {};
  }
}

export const economiaCriativaDataService = EconomiaCriativaDataService.getInstance();
