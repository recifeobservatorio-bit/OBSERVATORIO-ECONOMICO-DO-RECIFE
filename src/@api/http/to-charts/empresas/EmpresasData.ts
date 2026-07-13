import { readParquetFromBuffer } from "@/@api/config/parquetReader";

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

// Registro (ativas/inativas) é um retrato atual da base, não uma série por ano —
// servido sempre inteiro, sem filtro de ano.
const ativasRegistroFetcher = makeFlatFetcher("empresas_ativas.parquet");
const inativasFetcher = makeFlatFetcher("empresas_inativas.parquet");

// Estes têm uma coluna Ano real e são filtrados pelo ano selecionado na aba.
const ativasRecifeFetcher = makeFlatFetcher("empresas_ativas_recife.parquet");
const naturezasFetcher = makeFlatFetcher("empresas_naturezas.parquet");
const classesFetcher = makeFlatFetcher("empresas_classes.parquet");
const abertasFetcher = makeFlatFetcher("empresas_abertas.parquet");
const fechadasFetcher = makeFlatFetcher("empresas_fechadas.parquet");
const tempoMedioFetcher = makeFlatFetcher("empresas_tempo_medio.parquet");

function filterByYear(rows: any[], year: string, field: string): any[] {
  return rows.filter((r) => String(r[field]) === String(year));
}

export class EmpresasData {
  constructor(private year: string) {}

  async fetchProcessedEmpresasAtivasRecife(): Promise<any[]> {
    return filterByYear(await ativasRecifeFetcher.fetchAll(), this.year, "Ano");
  }

  async fetchProcessedEmpresasAtivas(): Promise<any[]> {
    return ativasRegistroFetcher.fetchAll();
  }

  async fetchProcessedEmpresasInativas(): Promise<any[]> {
    return inativasFetcher.fetchAll();
  }

  async fetchProcessedNaturezas(): Promise<any[]> {
    return filterByYear(await naturezasFetcher.fetchAll(), this.year, "Ano");
  }

  async fetchProcessedClasses(): Promise<any[]> {
    return filterByYear(await classesFetcher.fetchAll(), this.year, "Ano");
  }

  async fetchProcessedEmpresasAbertas(): Promise<any[]> {
    return filterByYear(await abertasFetcher.fetchAll(), this.year, "Ano");
  }

  async fetchProcessedEmpresasFechadas(): Promise<any[]> {
    return filterByYear(await fechadasFetcher.fetchAll(), this.year, "Ano de Baixa");
  }

  async fetchProcessedTempoMedio(): Promise<any[]> {
    return filterByYear(await tempoMedioFetcher.fetchAll(), this.year, "Ano");
  }

  clearCache(): void {
    ativasRegistroFetcher.clearCache();
    inativasFetcher.clearCache();
    ativasRecifeFetcher.clearCache();
    naturezasFetcher.clearCache();
    classesFetcher.clearCache();
    abertasFetcher.clearCache();
    fechadasFetcher.clearCache();
    tempoMedioFetcher.clearCache();
  }
}
