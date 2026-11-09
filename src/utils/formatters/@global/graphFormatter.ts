export const tooltipFormatter = (value: any, suffix: string = "", prefix: string = "") => {
  if (value === undefined || value === null) {
    return `${prefix}0${suffix}`; 
  }
  return `${prefix}${value.toLocaleString("pt-BR")}${suffix}`;
  };
  
  // Casas decimais conforme a grandeza: com 0 fixas, eixos de índices
  // pequenos (ex.: Capag 0,457 / 0,009) viravam "0, 0, 0, 0". Inteiros e
  // valores grandes continuam sem decimais.
  export const yAxisFormatter = (value: any) => {
    const abs = Math.abs(Number(value));
    const maximumFractionDigits = abs < 10 ? 2 : abs < 100 ? 1 : 0;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    }).format(value);
  };

  // Formata rótulos de categoria (nomes de município, estado, etc.) usados
  // em eixos de gráfico de barra/coluna:
  // - Sigla de 2 letras (ex.: "pe", "sp") sempre em maiúscula.
  // - Padrão "cidade-uf" (ex.: "sao paulo-sp") — sigla depois do hífen
  //   sempre maiúscula, resto em Title Case (cada palavra capitalizada).
  // - Texto comum: Title Case.
  export const formatCategoryLabel = (value: any): string => {
    const text = String(value ?? "").trim();
    if (!text) return "";
    if (text.length === 2) return text.toUpperCase();

    const ufMatch = text.match(/^(.+)-([a-zA-Z]{2})$/);
    const city = ufMatch ? ufMatch[1] : text;
    const uf = ufMatch ? ufMatch[2].toUpperCase() : null;

    const titleCased = city
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return uf ? `${titleCased}-${uf}` : titleCased;
  };
