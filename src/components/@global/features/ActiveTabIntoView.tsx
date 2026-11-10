"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// No celular as abas (.bi-tabs) viram uma faixa que rola de lado. Ao trocar de
// página ou de aba, centraliza a aba ativa na faixa — senão, abrindo direto em
// "RFC Painel", a aba marcada ficaria escondida à direita. Mexe só no scroll
// horizontal da própria faixa (scrollIntoView rolaria a página também).
export default function ActiveTabIntoView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const centerActiveTabs = () => {
      document.querySelectorAll<HTMLElement>(".bi-tabs").forEach((strip) => {
        if (strip.scrollWidth <= strip.clientWidth) return;
        const active = strip.querySelector<HTMLElement>(".bi-tab-active");
        if (!active) return;
        const offset = active.getBoundingClientRect().left - strip.getBoundingClientRect().left;
        const target = strip.scrollLeft + offset - (strip.clientWidth - active.offsetWidth) / 2;
        strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
      });
    };
    // Algumas páginas só desenham as abas depois que os dados carregam (antes
    // mostram a tela de carregamento), então tenta de novo um pouco depois.
    const frame = requestAnimationFrame(centerActiveTabs);
    const timers = [600, 2000, 5000].map((ms) => setTimeout(centerActiveTabs, ms));
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, [pathname, searchParams]);

  return null;
}
