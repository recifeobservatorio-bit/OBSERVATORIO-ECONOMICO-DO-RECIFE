// PIB (total ou per capita) das 27 capitais no ano — gráfico
// "PIB em relação às capitais do país" do Power BI.

const CAPITAIS_POR_UF: Record<string, string> = {
  AC: "Rio Branco", AL: "Maceió", AP: "Macapá", AM: "Manaus", BA: "Salvador",
  CE: "Fortaleza", DF: "Brasília", ES: "Vitória", GO: "Goiânia", MA: "São Luís",
  MT: "Cuiabá", MS: "Campo Grande", MG: "Belo Horizonte", PA: "Belém", PB: "João Pessoa",
  PR: "Curitiba", PE: "Recife", PI: "Teresina", RJ: "Rio de Janeiro", RN: "Natal",
  RS: "Porto Alegre", RO: "Porto Velho", RR: "Boa Vista", SC: "Florianópolis",
  SP: "São Paulo", SE: "Aracaju", TO: "Palmas",
};

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const PIB_FIELD = "Produto Interno Bruto,  a preços correntes (R$ 1.000)";
const PER_CAPITA_FIELD = "Produto Interno Bruto per capita,  a preços correntes (R$ 1,00)";

export const isCapital = (municipioUf: string) => {
  const parts = String(municipioUf || "").split(" - ");
  const uf = parts[parts.length - 1]?.trim();
  const cidade = parts.slice(0, -1).join(" - ");
  const capital = CAPITAIS_POR_UF[uf];
  return !!capital && normalize(cidade) === normalize(capital);
};

export function processPibCapitais(rows: any[] = [], capita = false) {
  const field = capita ? PER_CAPITA_FIELD : PIB_FIELD;
  return rows
    .filter((r) => isCapital(r["Município - UF"]))
    .map((r) => ({ group: r["Município - UF"], pib: Number(r[field]) || 0 }))
    .sort((a, b) => b.pib - a.pib);
}
