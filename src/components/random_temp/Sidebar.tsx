"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import Menu from "./Menu";
import { menuItems } from "./menuIcons";

export const ArrowIcon = () => {
  return (            <svg
    width="35px"
    height="35px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-[#6b7280] dark:stroke-[#e5e7eb]"
  >
    <path d="M17 12L8 12" />
    <path d="M11 8L7 12L11 16" />
  </svg>)
}

// Nome curto mostrado embaixo de cada ícone na barra do topo.
const SHORT_LABELS: Record<string, string> = {
  "Voltar": "Início",
  "Panorama Recife": "Panorama",
  "Ranking de Competitividade dos Municípios": "Ranking",
  "Balança Comercial": "Balança",
  "Mercado Imobiliário": "Imobiliário",
  "Economia Criativa": "Eco. Criativa",
  "Acesse o Boletim Econômico": "Boletim",
};

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28px"
    height="28px"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.8"
    strokeLinecap="round"
    className="stroke-[#6b7280] dark:stroke-white"
  >
    <path d="M5 12H19M5 7H19M5 17H13" />
  </svg>
);

// Menu de navegação no topo: o hamburger fica numa barra fina acima da página
// e o menu abre como gaveta sobreposta. Antes era uma coluna fixa de ícones à
// esquerda, que tirava ~96px de largura dos gráficos o tempo todo.
export const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="flex items-center gap-3 h-14 shrink-0 px-3 bg-white dark:bg-[#0C1B2B] border-b border-gray-200 dark:border-[#15273b]">
        <div className="flex items-center gap-3 w-20 shrink-0">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex p-1 items-center justify-center hover:bg-lamaSkyLight dark:hover:bg-[#15273b] rounded-full"
          >
            <HamburgerIcon />
          </button>
          <Link href="/" title="Observatório Econômico do Recife" className="flex items-center shrink-0">
            <Image src="/images/logos/logo-obs-economico.svg" alt="logo" width={28} height={28} />
          </Link>
        </div>

        {/* Atalhos: os mesmos ícones que a coluna lateral mostrava fechada,
            centralizados na barra (o espaçador à direita equilibra o bloco
            do hamburger + logo). */}
        <nav className="hidden xl:flex flex-1 min-w-0 overflow-x-auto bi-topnav">
          <div className="flex items-center gap-0.5 w-max mx-auto">
            {menuItems.map((section) => (
              <div key={section.title} className="flex items-center gap-1">
                {section.title === "OUTROS" && (
                  <span className="mx-1 h-9 border-l-[1.5px] border-gray-300 dark:border-gray-600" />
                )}
                {section.items.map((item) => {
                  const active = item.href !== "/" && pathname.startsWith(item.href.split("?")[0]);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      title={item.label}
                      className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] px-1 py-1 rounded-md text-gray-500 dark:text-gray-200 hover:bg-lamaSkyLight dark:hover:bg-[#15273b] menu-item-wrapper ${
                        active ? "bg-lamaSkyLight dark:bg-[#15273b] text-[#2976C0]" : ""
                      }`}
                    >
                      {item.icon}
                      <span className="text-[10px] leading-3 whitespace-nowrap">
                        {SHORT_LABELS[item.label] ?? item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>
        <div className="hidden xl:block w-20 shrink-0" />
      </header>

      {menuOpen && <div className="fixed inset-0 z-40 bg-black/30" />}

      <div
        ref={drawerRef}
        className={`
          fixed inset-y-0 left-0 z-50 w-[240px] shadow-2xl
          overflow-y-auto overflow-x-hidden p-3 bg-white dark:bg-[#0C1B2B]
          transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-end h-[40px]">
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="flex p-1 my-1 items-center justify-center hover:bg-lamaSkyLight dark:hover:bg-[#15273b] rounded-full"
          >
            <ArrowIcon />
          </button>
        </div>

        <Link href="/" className="flex items-center justify-center flex-col">
          <Image src="/images/logos/logo-obs-economico.svg" alt="logo" width={100} height={32} />
          <span className="text-center text-[#2976C0] dark:text-gray-200 font-medium -mt-2 leading-4">
            Observatório <br />
            Econômico <br />
            do Recife
          </span>
        </Link>
        <Menu open />
      </div>
    </>
  );
};
