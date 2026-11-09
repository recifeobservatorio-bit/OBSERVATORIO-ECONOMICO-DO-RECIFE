import type { Map as LeafletMap } from "leaflet";

/**
 * O Leaflet só mede o container ao criar o mapa (e no resize da janela). No
 * painel o container muda de tamanho depois — o FitToScreen ajusta a largura
 * virtual da página ao escalar, a grade estica cards, a altura segue
 * --bi-chart-h — e o mapa ficava com os blocos desenhados só na área antiga
 * (metade cinza). Observa o container e avisa o Leaflet a cada mudança.
 * `onResize` (opcional) roda depois de cada ajuste — ex.: reenquadrar.
 * Devolve a função de limpeza.
 */
export function observeMapResize(map: LeafletMap, container: HTMLElement, onResize?: () => void) {
  let frame = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      onResize?.();
    });
  });
  ro.observe(container);
  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
  };
}
