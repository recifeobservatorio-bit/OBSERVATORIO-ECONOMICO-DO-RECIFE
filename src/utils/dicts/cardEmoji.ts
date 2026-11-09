// Emoji ilustrativo de cada card de KPI, escolhido pelo título. A ordem importa:
// regras mais específicas primeiro (ex.: "necessidades especiais" antes de
// "remuneração", assunto antes de "variação"/"ano anterior", que são genéricos
// e ficam por último). Card sem regra casada cai no DEFAULT_CARD_EMOJI.
const CARD_EMOJI_RULES: [RegExp, string][] = [
  [/capag|classificacao|nota/, "🏅"],
  [/posicao|ranking/, "🏆"],
  [/per capita/, "👤"],
  [/\bpib\b/, "💹"],
  [/desemprego/, "📉"],
  [/necessidades especiais/, "♿"],
  [/saldo homem/, "👨"],
  [/saldo mulher/, "👩"],
  [/desligamento|demitido/, "🚪"],
  [/admiss|admitido/, "🤝"],
  [/remuneracao|salario/, "💰"],
  [/economia criativa/, "🎨"],
  [/emprego|vinculo/, "👷"],
  [/tempo medio|dias para/, "⏱️"],
  [/saldo empresas/, "⚖️"],
  [/empresas? (fechad|inativ)/, "🏚️"],
  [/empresas? abert/, "🏪"],
  [/empresa/, "🏢"],
  [/passageiro/, "🧳"],
  [/decolage/, "🛫"],
  [/cabotagem/, "🚢"],
  [/exportacao/, "📤"],
  [/importacao/, "📥"],
  [/carga/, "📦"],
  [/negociado|us\$/, "🌎"],
  [/postos/, "⛽"],
  [/preco/, "🏷️"],
  [/iptu/, "🏠"],
  [/contribuinte/, "🧾"],
  [/transac/, "🔑"],
  [/avaliac|valor medio/, "🏘️"],
  [/filmage/, "🎥"],
  [/producoes|producao/, "🎬"],
  [/locac/, "📍"],
  [/sets/, "🎞️"],
  [/pessoas/, "👥"],
  [/ipca|inflacao/, "🛒"],
  [/acumulado/, "🧮"],
  [/saldo/, "⚖️"],
  [/variacao/, "📊"],
  [/anterior/, "🗓️"],
];

export const DEFAULT_CARD_EMOJI = "📊";

const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const cardEmoji = (title: string): string => {
  const normalized = normalize(title || "");
  return CARD_EMOJI_RULES.find(([pattern]) => pattern.test(normalized))?.[1] ?? DEFAULT_CARD_EMOJI;
};
