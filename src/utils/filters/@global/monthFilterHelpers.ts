const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIACRITICS_REGEX = /[̀-ͯ]/g;

const normalize = (value: string) =>
  value
    .toString()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim();

export const isMonthFilterLabel = (label: string) => {
  const normalized = normalize(label);
  return normalized === "mes" || normalized === "meses";
};

// Aceita valor numerico ("1", "01") ou por extenso ("Março", "mar") e retorna a posicao 1-12.
export const monthOptionIndex = (value: string): number => {
  const numeric = parseInt(value, 10);
  if (!isNaN(numeric) && numeric >= 1 && numeric <= 12) {
    return numeric;
  }

  const normalized = normalize(value);
  const index = MONTHS_PT.findIndex((month) => {
    const normalizedMonth = normalize(month);
    return (
      normalizedMonth === normalized ||
      normalizedMonth.startsWith(normalized) ||
      normalized.startsWith(normalizedMonth.slice(0, 3))
    );
  });

  return index === -1 ? 999 : index + 1;
};

export const monthOptionLabel = (value: string): string => {
  const index = monthOptionIndex(value);
  return index >= 1 && index <= 12 ? MONTHS_PT[index - 1] : String(value);
};
