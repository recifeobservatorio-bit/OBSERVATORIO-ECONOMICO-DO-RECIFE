import { fetchCombustiveisRaw } from "@/@api/http/to-charts/combustiveis/CombustiveisData";
import { Filters } from "@/@types/observatorio/shared";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const REGIOES = ["Norte", "Nordeste", "Centro Oeste", "Sudeste", "Sul"];

// Empty selections (e.g. a produto with no rows for the chosen município/mês, like
// "Óleo Diesel" for Recife once ANP moved to reporting only "Óleo Diesel S10") must be
// distinguished from a real 0 price. Returning null here — instead of 0 — lets the "—"
// fallback in the card components actually trigger instead of rendering "R$ 0,00".
function avg(arr: (number | null | undefined)[]): number | null {
  const valid = arr.filter((v): v is number => v != null && !isNaN(v as number));
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
}

function safeMin(arr: (number | null | undefined)[]): number | null {
  const valid = arr.filter((v): v is number => v != null && !isNaN(v as number));
  return valid.length ? valid.reduce((a, b) => (b < a ? b : a), valid[0]) : null;
}

function safeMax(arr: (number | null | undefined)[]): number | null {
  const valid = arr.filter((v): v is number => v != null && !isNaN(v as number));
  return valid.length ? valid.reduce((a, b) => (b > a ? b : a), valid[0]) : null;
}

// avg/safeMin/safeMax now return null for "no data" instead of 0 — round() keeps that
// null through the toFixed/parseFloat rounding step instead of crashing on it.
function round(v: number | null): number | null {
  return v == null ? null : parseFloat(v.toFixed(2));
}

function getYear(row: any) {
  // ANP timestamps are UTC midnight on the 1st of the month (e.g. "2026-06-01T00:00:00Z").
  // Reading with local getFullYear/getMonth shifts them into the previous day in any
  // negative-UTC timezone (like America/Sao_Paulo), which lands on the previous month —
  // or previous year, at the Jan 1st boundary. Use UTC accessors instead.
  return new Date(row.Data).getUTCFullYear().toString();
}

function getMonth(row: any) {
  return new Date(row.Data).getUTCMonth(); // 0-indexed
}

function getFiltersFromState(filters: Filters) {
  const get = (label: string) =>
    filters.additionalFilters?.find((f) => f.label === label)?.selected ?? [];
  // Sem PRODUTO selecionado, usa Gasolina Comum como padrão em todas as abas
  const produtos = get("PRODUTO");
  return {
    year: filters.year ?? filters.years?.[filters.years.length - 1] ?? "2026",
    meses: get("MÊS"),
    regioes: get("REGIÃO"),
    estados: get("ESTADO"),
    municipios: get("MUNICÍPIO"),
    produtos: produtos.length ? produtos : ["Gasolina Comum"],
    municipio: get("MUNICÍPIO")[0] ?? null,
  };
}

function applyFilters(rows: any[], f: ReturnType<typeof getFiltersFromState>, opts: { allYears?: boolean } = {}) {
  return rows.filter((r) => {
    // allYears: usado pelo modo "Ano" dos gráficos que por padrão só mostram o ano
    // selecionado — ignora o filtro de ano pra trazer a série histórica completa.
    if (!opts.allYears && getYear(r) !== f.year) return false;
    if (f.meses.length && !f.meses.includes(String(getMonth(r) + 1).padStart(2, "0"))) return false;
    if (f.regioes.length && !f.regioes.includes(r["REGIÃO"])) return false;
    if (f.estados.length && !f.estados.includes(r.ESTADO) && !f.estados.includes(r.UF)) return false;
    if (f.municipios.length && !f.municipios.includes(r["MUNICÍPIO"])) return false;
    if (f.produtos.length && !f.produtos.includes(r.PRODUTO)) return false;
    return true;
  });
}

function groupBy<T>(arr: T[], key: (r: T) => string): Record<string, T[]> {
  return arr.reduce((acc: any, r) => {
    const k = key(r);
    if (!acc[k]) acc[k] = [];
    acc[k].push(r);
    return acc;
  }, {});
}

function processGeral(rows: any[], capitaisRows: any[], regiaoRows: any[], rowsSemMes: any[] = rows, mesesFiltro: string[] = [], rowsPorAno: any[] = rowsSemMes) {
  const precoMedio = avg(rows.map((r) => r["PREÇO MÉDIO REVENDA"]));
  const precoMin = safeMin(rows.map((r) => r["PREÇO MÍNIMO REVENDA"]));
  const precoMax = safeMax(rows.map((r) => r["PREÇO MÁXIMO REVENDA"]));

  // Mês anterior: usa rowsSemMes (ignora o filtro de MÊS nos agrupamentos) — senão, com um
  // mês específico selecionado, sobra só um mês na lista e "Mês anterior" acaba repetindo
  // o valor do mês atual. Quando um mês está selecionado no filtro, ele vira o "atual" e
  // buscamos o mês civil imediatamente anterior disponível; sem filtro, cai para os dois
  // últimos meses do próprio dataset.
  const byMonth = groupBy(rowsSemMes, (r) => getMonth(r).toString());
  const months = Object.keys(byMonth).map(Number).sort((a, b) => a - b);
  let lastMonth: number | undefined;
  let prevMonth: number | undefined;
  if (mesesFiltro.length) {
    const selecionado = Number(mesesFiltro[mesesFiltro.length - 1]) - 1;
    lastMonth = months.includes(selecionado) ? selecionado : undefined;
    const anteriores = months.filter((m) => m < selecionado);
    prevMonth = anteriores.length ? anteriores[anteriores.length - 1] : undefined;
  } else {
    lastMonth = months[months.length - 1];
    prevMonth = months[months.length - 2];
  }
  const precoMesAtual = lastMonth !== undefined ? avg(byMonth[lastMonth].map((r) => r["PREÇO MÉDIO REVENDA"])) : precoMedio;
  const precoMesAnterior = prevMonth !== undefined ? avg(byMonth[prevMonth].map((r) => r["PREÇO MÉDIO REVENDA"])) : precoMesAtual;
  const variacao =
    precoMesAnterior != null && precoMesAtual != null && precoMesAnterior !== 0
      ? ((precoMesAtual - precoMesAnterior) / precoMesAnterior) * 100
      : null;

  const cards = [
    { title: "Preço médio", value: round(precoMedio) },
    { title: "Mês anterior", value: round(precoMesAnterior) },
    { title: "Variação", value: round(variacao) },
    { title: "Preço mínimo", value: round(precoMin) },
    { title: "Preço máximo", value: round(precoMax) },
  ];

  // Linha preço médio por mês — ignora o filtro de MÊS (senão a linha vira um ponto só)
  const byMonthSemMes = groupBy(rowsSemMes, (r) => getMonth(r).toString());
  const monthsSemMes = Object.keys(byMonthSemMes).map(Number).sort((a, b) => a - b);
  const linhaPrecoMedio = monthsSemMes.map((m) => ({
    mes: MESES[m],
    preco: round(avg(byMonthSemMes[m].map((r) => r["PREÇO MÉDIO REVENDA"]))),
  }));

  // Mesma linha, mas por ano (toda a série histórica) — usada pelo modo "Ano" do toggle
  const byYearGeral = groupBy(rowsPorAno, getYear);
  const anosGeral = Object.keys(byYearGeral).sort();
  const linhaPrecoMedioPorAno = anosGeral.map((ano) => ({
    ano,
    preco: round(avg(byYearGeral[ano].map((r) => r["PREÇO MÉDIO REVENDA"]))),
  }));

  // Dispersão: preço médio x postos por produto
  const byProduto = groupBy(rows, (r) => r.PRODUTO);
  const dispersao = Object.entries(byProduto).map(([prod, rs]) => ({
    precoMedio: round(avg((rs as any[]).map((r) => r["PREÇO MÉDIO REVENDA"]))),
    postos: (rs as any[]).reduce((s, r) => s + (r["NÚMERO DE POSTOS PESQUISADOS"] || 0), 0),
    produto: prod,
  }));

  // Treemap por região — sempre todas as regiões, não muda com o filtro de município nem de estado
  const byRegiao = groupBy(regiaoRows, (r) => r["REGIÃO"]);
  const porRegiao = Object.entries(byRegiao).map(([nome, rs]) => ({
    nome,
    preco: round(avg((rs as any[]).map((r) => r["PREÇO MÉDIO REVENDA"]))),
  }));

  // Barras capitais (CAPITAL === "S") — sempre todas as capitais, não muda com o filtro de município
  const capitais = capitaisRows.filter((r) => r.CAPITAL === "S");
  const byCapital = groupBy(capitais, (r) => r.UF);
  const porEstado = Object.entries(byCapital)
    .map(([nome, rs]) => ({
      nome,
      preco: round(avg((rs as any[]).map((r) => r["PREÇO MÉDIO REVENDA"]))),
    }))
    .sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  // Barras por estado (todos os estados) — sempre todos, não muda com o filtro de município
  const byTodosEstados = groupBy(capitaisRows, (r) => r.UF);
  const porTodosEstados = Object.entries(byTodosEstados)
    .map(([nome, rs]) => ({
      nome,
      preco: round(avg((rs as any[]).map((r) => r["PREÇO MÉDIO REVENDA"]))),
    }))
    .sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  return { cards, linhaPrecoMedio, linhaPrecoMedioPorAno, dispersao, porRegiao, porEstado, porTodosEstados };
}

function processComparativo(rows: any[], barRows: any[], municipio?: string | null, rowsSemMes: any[] = rows, rowsPorAno: any[] = rowsSemMes) {
  const recife = rows.filter((r) => r["MUNICÍPIO"]?.includes("Recife") && r.UF === "PE");

  // Linhas (Recife e comparativo) ignoram o filtro de MÊS — senão viram um ponto só
  const recifeSemMes = rowsSemMes.filter((r) => r["MUNICÍPIO"]?.includes("Recife") && r.UF === "PE");
  const byMonth = groupBy(recifeSemMes, (r) => getMonth(r).toString());
  const months = Object.keys(byMonth).map(Number).sort((a, b) => a - b);

  const linhaRecife = months.map((m) => ({
    mes: MESES[m],
    preco: round(avg(byMonth[m].map((r) => r["PREÇO MÉDIO REVENDA"]))),
  }));

  // Mesma linha, mas por ano (toda a série histórica) — usada pelo modo "Ano" do toggle
  const recifePorAno = rowsPorAno.filter((r) => r["MUNICÍPIO"]?.includes("Recife") && r.UF === "PE");
  const byYearRecife = groupBy(recifePorAno, getYear);
  const anosRecife = Object.keys(byYearRecife).sort();
  const linhaRecifePorAno = anosRecife.map((ano) => ({
    ano,
    preco: round(avg(byYearRecife[ano].map((r) => r["PREÇO MÉDIO REVENDA"]))),
  }));

  // Gráfico de barra (por produto) é estático: só reage a ano/mês, ignora região/estado/produto/município
  const recifeBars = barRows.filter((r) => r["MUNICÍPIO"]?.includes("Recife") && r.UF === "PE");
  const byProdutoRecife = groupBy(recifeBars, (r) => r.PRODUTO);
  const produtosRecife = Object.entries(byProdutoRecife).map(([produto, rs]) => ({
    produto,
    preco: round(avg((rs as any[]).map((r) => r["PREÇO MÉDIO REVENDA"]))),
  }));

  const recifePrecoMedio = round(avg(recife.map((r) => r["PREÇO MÉDIO REVENDA"])));
  const recifePostos = recife.reduce((s, r) => s + (r["NÚMERO DE POSTOS PESQUISADOS"] || 0), 0);

  let linhaComparativo: any[] = [];
  let linhaComparativoPorAno: any[] = [];
  let produtosComparativo: any[] = [];
  let municipioPrecoMedio: number | null | undefined;
  let municipioPostos: number | undefined;

  if (municipio) {
    const mun = rows.filter((r) => r["MUNICÍPIO"] === municipio);
    const munSemMes = rowsSemMes.filter((r) => r["MUNICÍPIO"] === municipio);
    const byMonthMun = groupBy(munSemMes, (r) => getMonth(r).toString());
    const monthsMun = Object.keys(byMonthMun).map(Number).sort((a, b) => a - b);
    linhaComparativo = monthsMun.map((m) => ({
      mes: MESES[m],
      preco: round(avg(byMonthMun[m].map((r) => r["PREÇO MÉDIO REVENDA"]))),
    }));

    const munPorAno = rowsPorAno.filter((r) => r["MUNICÍPIO"] === municipio);
    const byYearMun = groupBy(munPorAno, getYear);
    const anosMun = Object.keys(byYearMun).sort();
    linhaComparativoPorAno = anosMun.map((ano) => ({
      ano,
      preco: round(avg(byYearMun[ano].map((r) => r["PREÇO MÉDIO REVENDA"]))),
    }));

    const munBars = barRows.filter((r) => r["MUNICÍPIO"] === municipio);
    const byProdutoMun = groupBy(munBars, (r) => r.PRODUTO);
    produtosComparativo = Object.entries(byProdutoMun).map(([produto, rs]) => ({
      produto,
      preco: round(avg((rs as any[]).map((r) => r["PREÇO MÉDIO REVENDA"]))),
    }));

    municipioPrecoMedio = round(avg(mun.map((r) => r["PREÇO MÉDIO REVENDA"])));
    municipioPostos = mun.reduce((s, r) => s + (r["NÚMERO DE POSTOS PESQUISADOS"] || 0), 0);
  }

  return {
    recife: { precoMedio: recifePrecoMedio, postos: recifePostos },
    municipio: { precoMedio: municipioPrecoMedio, postos: municipioPostos },
    linhaRecife,
    linhaRecifePorAno,
    produtosRecife,
    linhaComparativo,
    linhaComparativoPorAno,
    produtosComparativo,
  };
}

function processRegional(rows: any[], allRows: any[], rowsSemMes: any[] = rows) {
  const byRegiao = groupBy(rows, (r) => r["REGIÃO"]);
  const precoMedio = REGIOES.filter((r) => byRegiao[r]).map((r) => ({
    regiao: r,
    preco: round(avg(byRegiao[r].map((x: any) => x["PREÇO MÉDIO REVENDA"]))),
  }));
  const precoMaximo = REGIOES.filter((r) => byRegiao[r]).map((r) => ({
    regiao: r,
    preco: round(safeMax(byRegiao[r].map((x: any) => x["PREÇO MÁXIMO REVENDA"]))),
  }));
  const precoMinimo = REGIOES.filter((r) => byRegiao[r]).map((r) => ({
    regiao: r,
    preco: round(safeMin(byRegiao[r].map((x: any) => x["PREÇO MÍNIMO REVENDA"]))),
  }));

  // Evolução por ano
  const byYear = groupBy(allRows, getYear);
  const years = Object.keys(byYear).sort();
  const evolucao = years.map((ano) => {
    const byR = groupBy(byYear[ano], (r) => r["REGIÃO"]);
    const entry: any = { ano };
    REGIOES.forEach((reg) => {
      entry[reg] = byR[reg] ? round(avg(byR[reg].map((r) => r["PREÇO MÉDIO REVENDA"]))) : null;
    });
    return entry;
  });

  // Preço médio por mês (ano selecionado) — usada pelo modo "Mês" do toggle. Ignora o
  // filtro de MÊS (senão a linha vira um ponto só quando um mês é selecionado).
  const byMonthRegiao = groupBy(rowsSemMes, (r) => getMonth(r).toString());
  const monthsRegiao = Object.keys(byMonthRegiao).map(Number).sort((a, b) => a - b);
  const porMes = monthsRegiao.map((m) => {
    const byR = groupBy(byMonthRegiao[m], (r) => r["REGIÃO"]);
    const entry: any = { mes: MESES[m] };
    REGIOES.forEach((reg) => {
      entry[reg] = byR[reg] ? round(avg(byR[reg].map((r) => r["PREÇO MÉDIO REVENDA"]))) : null;
    });
    return entry;
  });

  return { precoMedio, precoMaximo, precoMinimo, evolucao, porMes };
}

function processEstadual(rows: any[], allRows: any[], rowsSemMes: any[] = rows) {
  const byEstado = groupBy(rows, (r) => r.UF);
  const estados = Object.keys(byEstado).sort();

  const precoMedio = estados.map((e) => ({
    estado: e,
    preco: round(avg(byEstado[e].map((r: any) => r["PREÇO MÉDIO REVENDA"]))),
  })).sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  const precoMaximo = estados.map((e) => ({
    estado: e,
    preco: round(safeMax(byEstado[e].map((r: any) => r["PREÇO MÁXIMO REVENDA"]))),
  })).sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  const precoMinimo = estados.map((e) => ({
    estado: e,
    preco: round(safeMin(byEstado[e].map((r: any) => r["PREÇO MÍNIMO REVENDA"]))),
  })).sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  const byYear = groupBy(allRows, getYear);
  const years = Object.keys(byYear).sort();
  const evolucao = years.map((ano) => {
    const byE = groupBy(byYear[ano], (r) => r.UF);
    const entry: any = { ano };
    estados.forEach((e) => {
      entry[e] = byE[e] ? round(avg(byE[e].map((r) => r["PREÇO MÉDIO REVENDA"]))) : null;
    });
    return entry;
  });

  // Preço médio por mês (ano selecionado) — usada pelo modo "Mês" do toggle
  const byMonthEstado = groupBy(rowsSemMes, (r) => getMonth(r).toString());
  const monthsEstado = Object.keys(byMonthEstado).map(Number).sort((a, b) => a - b);
  const estadosSemMes = Array.from(new Set(rowsSemMes.map((r) => r.UF))).sort();
  const porMes = monthsEstado.map((m) => {
    const byE = groupBy(byMonthEstado[m], (r) => r.UF);
    const entry: any = { mes: MESES[m] };
    estadosSemMes.forEach((e) => {
      entry[e] = byE[e] ? round(avg(byE[e].map((r) => r["PREÇO MÉDIO REVENDA"]))) : null;
    });
    return entry;
  });

  return { precoMedio, precoMaximo, precoMinimo, evolucao, porMes };
}

function processMunicipal(rows: any[], allRows: any[], estado?: string, rowsSemMes: any[] = rows) {
  const filtered = estado ? rows.filter((r) => r.UF === estado || r.ESTADO === estado) : rows;
  const byMun = groupBy(filtered, (r) => r["MUNICÍPIO"]);
  const municipios = Object.keys(byMun).sort();

  const precoMedio = municipios.map((m) => ({
    municipio: m,
    preco: round(avg(byMun[m].map((r: any) => r["PREÇO MÉDIO REVENDA"]))),
  })).sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  const precoMaximo = municipios.map((m) => ({
    municipio: m,
    preco: round(safeMax(byMun[m].map((r: any) => r["PREÇO MÁXIMO REVENDA"]))),
  })).sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  const precoMinimo = municipios.map((m) => ({
    municipio: m,
    preco: round(safeMin(byMun[m].map((r: any) => r["PREÇO MÍNIMO REVENDA"]))),
  })).sort((a, b) => (b.preco ?? -Infinity) - (a.preco ?? -Infinity));

  const top10 = precoMedio.slice(0, 10).map((m) => m.municipio);
  const byYear = groupBy(allRows, getYear);
  const years = Object.keys(byYear).sort();
  const evolucao = years.map((ano) => {
    const byM = groupBy(byYear[ano], (r) => r["MUNICÍPIO"]);
    const entry: any = { ano };
    top10.forEach((m) => {
      entry[m] = byM[m] ? round(avg(byM[m].map((r) => r["PREÇO MÉDIO REVENDA"]))) : null;
    });
    return entry;
  });

  // Preço médio por mês (ano selecionado), mesmos top10 municípios — usada pelo modo "Mês" do toggle
  const filteredSemMes = estado ? rowsSemMes.filter((r) => r.UF === estado || r.ESTADO === estado) : rowsSemMes;
  const byMonthMun = groupBy(filteredSemMes, (r) => getMonth(r).toString());
  const monthsMun = Object.keys(byMonthMun).map(Number).sort((a, b) => a - b);
  const porMes = monthsMun.map((m) => {
    const byM = groupBy(byMonthMun[m], (r) => r["MUNICÍPIO"]);
    const entry: any = { mes: MESES[m] };
    top10.forEach((mun) => {
      entry[mun] = byM[mun] ? round(avg(byM[mun].map((r) => r["PREÇO MÉDIO REVENDA"]))) : null;
    });
    return entry;
  });

  return { precoMedio, precoMaximo, precoMinimo, evolucao, porMes };
}

export class CombustiveisDataService {
  private static instance: CombustiveisDataService;
  private currentYear: string = "2026";
  private dataCache: Record<string, any> = {};

  private constructor() {}

  public static getInstance(): CombustiveisDataService {
    if (!CombustiveisDataService.instance) {
      CombustiveisDataService.instance = new CombustiveisDataService();
    }
    return CombustiveisDataService.instance;
  }

  public setYear(year: string) {
    this.currentYear = year;
  }

  private getCacheKey(tab: string, filters: Filters): string {
    return `${tab}-${this.currentYear}-${JSON.stringify(filters.additionalFilters)}`;
  }

  public async fetchDataForTab(tab: string, filters: Filters) {
    const cacheKey = this.getCacheKey(tab, filters);
    if (this.dataCache[cacheKey]) return this.dataCache[cacheKey];

    const allRows: any[] = await fetchCombustiveisRaw();
    const f = getFiltersFromState({ ...filters, year: this.currentYear });

    // Linhas filtradas pelo ano (e demais filtros)
    const filtered = applyFilters(allRows, f);

    // Opções de todos os filtros da aba. ESTADO e MUNICÍPIO são extraídos de todo o
    // dataset (não só do filtrado); os demais mantêm a lista fixa original.
    const additionalFiltersOptions = [
      {
        label: "MÊS",
        options: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      },
      {
        label: "REGIÃO",
        options: ["Norte", "Nordeste", "Centro Oeste", "Sudeste", "Sul"],
      },
      {
        label: "ESTADO",
        options: Array.from(
          new Set(allRows.map((r) => r.ESTADO ?? r.UF).filter((v) => v != null))
        ).sort(),
      },
      {
        label: "MUNICÍPIO",
        options: Array.from(
          new Set(allRows.map((r) => r["MUNICÍPIO"]).filter((v) => v != null))
        ).sort(),
      },
      {
        label: "PRODUTO",
        options: ["Etanol Hidratado", "Gasolina Aditivada", "Gasolina Comum", "Glp", "Gnv", "Oleo Diesel", "Oleo Diesel S10"],
      },
    ];

    let processed: any;
    switch (tab) {
      case "comparativo": {
        // O lado de Recife sempre usa o mesmo recorte, ignorando o filtro de município
        // (que aqui serve só para escolher a cidade do outro lado da comparação)
        const comparativoRows = applyFilters(allRows, { ...f, municipios: [] });
        // Mesmo recorte, mas ignorando também o filtro de MÊS — usado só pelas linhas
        // (linhaRecife/linhaComparativo), pra não colapsar num ponto só quando um mês é selecionado
        const comparativoRowsSemMes = applyFilters(allRows, { ...f, municipios: [], meses: [] });
        // Mesmo recorte, mas ignorando ano e mês — série histórica completa, usada pelo modo "Ano" do toggle
        const comparativoRowsPorAno = applyFilters(allRows, { ...f, municipios: [], meses: [] }, { allYears: true });
        // Gráfico de barra (preço médio por produto) é estático: só muda com ano/mês
        const barRows = applyFilters(allRows, { ...f, regioes: [], estados: [], municipios: [], produtos: [] });
        processed = { id: "combustiveis", comparativo: { ...processComparativo(comparativoRows, barRows, f.municipio, comparativoRowsSemMes, comparativoRowsPorAno), additionalFiltersOptions } };
        break;
      }
      case "regional": {
        const filteredSemMes = applyFilters(allRows, { ...f, meses: [] });
        processed = { id: "combustiveis", regional: { ...processRegional(filtered, allRows, filteredSemMes), additionalFiltersOptions } };
        break;
      }
      case "estadual": {
        const filteredSemMes = applyFilters(allRows, { ...f, meses: [] });
        processed = { id: "combustiveis", estadual: { ...processEstadual(filtered, allRows, filteredSemMes), additionalFiltersOptions } };
        break;
      }
      case "municipal": {
        const estadoFilter = filters.additionalFilters?.find((f) => f.label === "ESTADO")?.selected?.[0];
        const filteredSemMes = applyFilters(allRows, { ...f, meses: [] });
        processed = { id: "combustiveis", municipal: { ...processMunicipal(filtered, allRows, estadoFilter, filteredSemMes), additionalFiltersOptions } };
        break;
      }
      default: {
        // Sem município selecionado, os cards/linha/dispersão usam Recife como padrão
        const geralRows = f.municipios.length
          ? filtered
          : filtered.filter((r) => r["MUNICÍPIO"]?.includes("Recife"));

        // Mesmo recorte, mas ignorando o filtro de MÊS — usado só pela linha de preço médio,
        // pra não colapsar num ponto só quando um mês é selecionado
        const filteredSemMes = applyFilters(allRows, { ...f, meses: [] });
        const geralRowsSemMes = f.municipios.length
          ? filteredSemMes
          : filteredSemMes.filter((r) => r["MUNICÍPIO"]?.includes("Recife"));

        // Mesmo recorte, mas ignorando ano e mês — série histórica completa, usada pelo modo "Ano" do toggle
        const filteredPorAno = applyFilters(allRows, { ...f, meses: [] }, { allYears: true });
        const geralRowsPorAno = f.municipios.length
          ? filteredPorAno
          : filteredPorAno.filter((r) => r["MUNICÍPIO"]?.includes("Recife"));

        // O gráfico de capitais e o de todos os estados sempre mostram tudo, ignorando o filtro de município
        const capitaisRows = applyFilters(allRows, { ...f, municipios: [] });

        // O treemap por região sempre mostra todas as regiões, ignorando os filtros de município e de estado
        const regiaoRows = applyFilters(allRows, { ...f, municipios: [], estados: [] });

        processed = { id: "combustiveis", geral: { ...processGeral(geralRows, capitaisRows, regiaoRows, geralRowsSemMes, f.meses, geralRowsPorAno), additionalFiltersOptions } };
      }
    }

    this.dataCache[cacheKey] = processed;
    return processed;
  }
}

export const combustiveisDataService = CombustiveisDataService.getInstance();
