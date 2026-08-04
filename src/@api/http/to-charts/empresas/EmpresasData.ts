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
const abertasSecaoFetcher = makeFlatFetcher("empresas_abertas_secao.parquet");
const fechadasFetcher = makeFlatFetcher("empresas_fechadas.parquet");
const tempoMedioFetcher = makeFlatFetcher("empresas_tempo_medio.parquet");

function filterByYear(rows: any[], year: string, field: string): any[] {
  return rows.filter((r) => String(r[field]) === String(year));
}

// empresas_ativas.parquet não tem coluna "Ano" pronta, mas tem a data completa de abertura
// (data_abertura_empresa) — o Power BI já deriva o ano dessa coluna automaticamente, então
// fazemos o mesmo aqui pra permitir filtrar por ano de abertura. A coluna 'mes' crua já vem
// baseada na mesma data (abertura), então não precisa de ajuste aqui.
function withAnoAbertura(rows: any[]): any[] {
  return rows.map((row) => ({
    ...row,
    // getUTCFullYear, não getFullYear — a data vem em UTC meia-noite; em horário local
    // (UTC-3) isso desloca a virada de mês/ano 3h pra trás e empurra empresas abertas no
    // dia 1 pro mês/ano anterior (mesma classe de bug de timezone já visto em Combustíveis).
    Ano: row.data_abertura_empresa ? new Date(row.data_abertura_empresa).getUTCFullYear() : null,
  }));
}

// empresas_inativas.parquet não tem coluna "Ano" pronta. A coluna 'mes' crua já vem do
// ENCERRAMENTO (mês em que a empresa fechou, presente em só ~16,5% dos registros — os
// demais não têm data_encerramento preenchida e por isso não entram em nenhum filtro de
// ano/mês específico). Pra bater com valores de referência conferidos (ex.: Junho/2026 = 37,
// Junho/2025 = 113), o "Ano" precisa vir da MESMA data (encerramento), não da abertura.
function withAnoEncerramento(rows: any[]): any[] {
  return rows.map((row) => ({
    ...row,
    Ano: row.data_encerramento ? new Date(row.data_encerramento).getUTCFullYear() : null,
  }));
}

export class EmpresasData {
  constructor(private year: string) {}

  async fetchProcessedEmpresasAtivasRecife(): Promise<any[]> {
    return filterByYear(await ativasRecifeFetcher.fetchAll(), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsEmpresasAtivasRecife(): Promise<any[]> {
    return ativasRecifeFetcher.fetchAll();
  }

  async fetchProcessedEmpresasAtivas(): Promise<any[]> {
    return ativasRegistroFetcher.fetchAll();
  }

  // Igual a fetchProcessedEmpresasAtivas, mas com "Ano" derivado de data_abertura_empresa e
  // já filtrado pelo ano selecionado — usado pela aba "Empresas Ativas", que tem filtro de ANO.
  async fetchProcessedEmpresasAtivasPorAno(): Promise<any[]> {
    return filterByYear(withAnoAbertura(await ativasRegistroFetcher.fetchAll()), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsEmpresasAtivas(): Promise<any[]> {
    return withAnoAbertura(await ativasRegistroFetcher.fetchAll());
  }

  async fetchProcessedEmpresasInativas(): Promise<any[]> {
    return inativasFetcher.fetchAll();
  }

  // Igual a fetchProcessedEmpresasInativas, mas com "Ano" derivado de data_encerramento (ano
  // em que a empresa fechou, consistente com a coluna 'mes' crua) e já filtrado pelo ano
  // selecionado.
  async fetchProcessedEmpresasInativasPorAno(): Promise<any[]> {
    return filterByYear(withAnoEncerramento(await inativasFetcher.fetchAll()), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsEmpresasInativas(): Promise<any[]> {
    return withAnoEncerramento(await inativasFetcher.fetchAll());
  }

  async fetchProcessedNaturezas(): Promise<any[]> {
    return filterByYear(await naturezasFetcher.fetchAll(), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsNaturezas(): Promise<any[]> {
    return naturezasFetcher.fetchAll();
  }

  async fetchProcessedClasses(): Promise<any[]> {
    return filterByYear(await classesFetcher.fetchAll(), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsClasses(): Promise<any[]> {
    return classesFetcher.fetchAll();
  }

  async fetchProcessedEmpresasAbertas(): Promise<any[]> {
    return filterByYear(await abertasFetcher.fetchAll(), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsAbertas(): Promise<any[]> {
    return abertasFetcher.fetchAll();
  }

  async fetchProcessedAbertasPorSecao(): Promise<any[]> {
    return filterByYear(await abertasSecaoFetcher.fetchAll(), this.year, "Ano");
  }

  async fetchProcessedEmpresasFechadas(): Promise<any[]> {
    return filterByYear(await fechadasFetcher.fetchAll(), this.year, "Ano de Baixa");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsFechadas(): Promise<any[]> {
    return fechadasFetcher.fetchAll();
  }

  async fetchProcessedTempoMedio(): Promise<any[]> {
    return filterByYear(await tempoMedioFetcher.fetchAll(), this.year, "Ano");
  }

  // Sem filtro de ano — usada pela série histórica multianual ("Ano" no toggle Mês/Ano).
  async fetchAllYearsTempoMedio(): Promise<any[]> {
    return tempoMedioFetcher.fetchAll();
  }

  clearCache(): void {
    ativasRegistroFetcher.clearCache();
    inativasFetcher.clearCache();
    ativasRecifeFetcher.clearCache();
    naturezasFetcher.clearCache();
    classesFetcher.clearCache();
    abertasFetcher.clearCache();
    abertasSecaoFetcher.clearCache();
    fechadasFetcher.clearCache();
    tempoMedioFetcher.clearCache();
  }
}
