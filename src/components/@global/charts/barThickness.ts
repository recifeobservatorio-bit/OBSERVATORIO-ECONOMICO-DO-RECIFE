import { useCallback, useEffect, useRef, useState } from "react";

// Como no Power BI: colunas/barras finas, com espaço pra ~7 numa largura de
// gráfico. Com menos categorias as colunas NÃO engordam pra preencher — ficam
// com a espessura que teriam se houvesse 7.
export const VISIBLE_BARS = 7;

// Fração do espaço de cada categoria que a coluna ocupa (o resto é vão).
export const BAR_FILL = 0.6;

/**
 * Tamanho (clientWidth/clientHeight) de um elemento, acompanhando
 * redimensionamentos. Devolve uma ref de callback — com useRef + useEffect a
 * medição se perdia quando o gráfico só aparecia depois de um estado de
 * "carregando" (o efeito rodava uma vez, com a ref ainda vazia).
 */
export function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const element = useRef<T | null>(null);

  const observe = useCallback((el: T) => {
    const measure = () =>
      setSize((prev) =>
        prev && prev.width === el.clientWidth && prev.height === el.clientHeight
          ? prev
          : { width: el.clientWidth, height: el.clientHeight }
      );
    observer.current = new ResizeObserver(measure);
    observer.current.observe(el);
    measure();
  }, []);

  const ref = useCallback((el: T | null) => {
    observer.current?.disconnect();
    observer.current = null;
    element.current = el;
    if (el) observe(el);
  }, [observe]);

  // No Strict Mode (dev) o React desmonta/remonta os efeitos sem chamar a ref
  // de novo: a limpeza desligava o observer e o gráfico ficava preso na
  // primeira medida (ex.: barras na altura mínima com o card já mais alto).
  // Por isso o efeito religa o observer se o elemento ainda estiver lá.
  useEffect(() => {
    if (element.current && !observer.current) observe(element.current);
    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [observe]);

  return [ref, size] as const;
}

/**
 * Espessura máxima de cada coluna para uma área de plotagem `plotWidth`: a de
 * uma coluna num gráfico com 7. Séries agrupadas não dividem esse valor — com
 * muitas colunas o próprio Recharts já afina pra caberem.
 */
export function columnThickness(plotWidth: number | null | undefined) {
  if (!plotWidth || plotWidth <= 0) return undefined;
  return Math.max(6, Math.round((plotWidth / VISIBLE_BARS) * BAR_FILL));
}

/**
 * Rótulos do eixo de categorias: inclina (-35°) só quando o maior rótulo não
 * cabe deitado no espaço de cada categoria, e reserva a altura que ele precisa
 * de verdade — antes eram 70px fixos, e siglas como "SP" deixavam ~45px vazios.
 */
export function categoryAxisLayout(labels: string[], slotWidth: number | null, fontSize = 12) {
  const longest = labels.reduce((max, l) => Math.max(max, l.length), 0);
  const textWidth = longest * fontSize * 0.6;
  if (slotWidth && textWidth <= slotWidth - 6) return { angle: 0, height: fontSize + 18 };
  // Altura do texto inclinado a 35°: comprimento × sen(35°) + altura da fonte.
  return { angle: -35, height: Math.min(80, Math.round(textWidth * 0.57 + fontSize + 10)) };
}
