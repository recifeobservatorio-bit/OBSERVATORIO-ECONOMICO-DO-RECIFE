import { readParquetFromBuffer } from "@/@api/config/parquetReader";
import { PortoAtracacaoHeaders, PortoCargaHeaders, PortoCoordHeaders, PortoDestinoHeaders, PortoMercadoHeaders, PortoOrigemDestinoHeaders, PortoPassageirosHeaders } from "@/@types/observatorio/@fetch/porto";

function normalizeBigInt(rows: any[]) {
  return rows.map((row) => {
    const normalized: any = {};
    for (const key of Object.keys(row)) {
      const v = row[key];
      normalized[key] = typeof v === "bigint" ? Number(v) : v;
    }
    return normalized;
  });
}

function makeFlatFetcher(fileName: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/${fileName}`;
  let cache: any[] | null = null;
  let fetching: Promise<any[]> | null = null;

  return {
    async fetchAll(): Promise<any[]> {
      if (cache) return cache;
      if (fetching) return fetching;
      fetching = (async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
        const rows = normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
        cache = rows;
        return rows;
      })();
      return fetching;
    },
    clearCache() {
      cache = null;
      fetching = null;
    },
  };
}

const atracacaoFetcher = makeFlatFetcher("porto_atracacao.parquet");
const cargaFetcher = makeFlatFetcher("porto_cargas.parquet");
const passageirosFetcher = makeFlatFetcher("porto_passageiros.parquet");
const mercadoriaFetcher = makeFlatFetcher("porto_mercadoria.parquet");
const origemFetcher = makeFlatFetcher("porto_instalacao_origem.parquet");
const destinoFetcher = makeFlatFetcher("porto_instalacao_destino.parquet");

// "Data Atracação" chega como "14/02/2023 10:35:00" — extrai o mês (não veio pronto do backend).
function mesFromDataAtracacao(str: string): number | null {
  const m = String(str).match(/^\d{1,2}\/(\d{1,2})\/\d{4}/);
  return m ? parseInt(m[1], 10) : null;
}

function parsePesoBruto(v: any): number {
  if (v == null) return 0;
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function filterByYear(rows: any[], year: string, field = "Ano"): any[] {
  return rows.filter((r) => String(r[field]) === String(year));
}

export class PortoData {
  constructor(public year: string) {}

  async fetchAtracacaoPorAno(): Promise<PortoAtracacaoHeaders[]> {
    const all = await atracacaoFetcher.fetchAll();
    return filterByYear(all, this.year).map((r) => ({ ...r, Mes: mesFromDataAtracacao(r["Data Atracação"]) }));
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAtracacaoAllYears(): Promise<PortoAtracacaoHeaders[]> {
    const all = await atracacaoFetcher.fetchAll();
    return all.map((r) => ({ ...r, Mes: mesFromDataAtracacao(r["Data Atracação"]) }));
  }

  // O escopo por ano já é aplicado via interseção com os IDs de atracação do ano
  // (feito em portoDataService.ts) — aqui basta devolver a base de cargas de PE inteira.
  async fetchCargaPorAno(): Promise<PortoCargaHeaders[]> {
    return cargaFetcher.fetchAll();
  }

  async fetchPassageirosPorAno(): Promise<PortoPassageirosHeaders[]> {
    return filterByYear(await passageirosFetcher.fetchAll(), this.year);
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchPassageirosAllYears(): Promise<PortoPassageirosHeaders[]> {
    return passageirosFetcher.fetchAll();
  }

  async fetchOrigemDictionary(): Promise<PortoOrigemDestinoHeaders[]> {
    return origemFetcher.fetchAll();
  }

  async fetchDestinoDictionary(): Promise<PortoDestinoHeaders[]> {
    return destinoFetcher.fetchAll();
  }

  async fetchMercadoriaDictionary(): Promise<PortoMercadoHeaders[]> {
    return mercadoriaFetcher.fetchAll();
  }

  // Não existe endpoint/arquivo de coordenadas pronto — construído aqui juntando
  // atracação (lat/long/porto/mês) com o peso bruto somado das cargas daquele ano.
  async fetchCoordinates(): Promise<PortoCoordHeaders[]> {
    const [atracacaoAno, carga] = await Promise.all([this.fetchAtracacaoPorAno(), cargaFetcher.fetchAll()]);

    const pesoPorAtracacao = new Map<number, number>();
    for (const c of carga) {
      if (!c.FlagMCOperacaoCarga) continue;
      const atual = pesoPorAtracacao.get(c.IDAtracacao) ?? 0;
      pesoPorAtracacao.set(c.IDAtracacao, atual + parsePesoBruto(c.VLPesoCargaBruta));
    }

    return atracacaoAno.map((a: any) => ({
      "Porto Atracação": a["Porto Atracação"],
      Mes: a.Mes,
      Latitude: a.Latitude,
      Longitude: a.Longitude,
      VLPesoCargaBruta: pesoPorAtracacao.get(a.IDAtracacao) ?? 0,
    }));
  }

  clearCache(): void {
    atracacaoFetcher.clearCache();
    cargaFetcher.clearCache();
    passageirosFetcher.clearCache();
    mercadoriaFetcher.clearCache();
    origemFetcher.clearCache();
    destinoFetcher.clearCache();
  }
}
