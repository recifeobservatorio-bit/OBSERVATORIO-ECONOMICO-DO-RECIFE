"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AdditionalFilter, Filters } from "@/@types/observatorio/shared";
import { useDashboard } from "@/context/DashboardContext";
import { isMonthFilterLabel, monthOptionIndex, monthOptionLabel } from "@/utils/filters/@global/monthFilterHelpers";

import { ChevronIcon } from "./ChevronIcon";
import FocusHidden from "../@global/features/FocusHidden";

// Coluna de filtros fixa à esquerda, no estilo dos relatórios Power BI do
// Observatório (faixa laranja, um seletor por filtro, "Limpar Filtros" e a
// marca da Prefeitura no rodapé). Substitui o antigo painel suspenso da
// Navbar. O Ano aplica na hora; os filtros de múltipla escolha acumulam as
// marcações e aplicam quando o seletor fecha — trocar vários itens seguidos
// não dispara um refetch por clique.

const optionLabel = (f: AdditionalFilter, op: string) =>
  isMonthFilterLabel(f.label) ? monthOptionLabel(op) : f?.hash ? String(f.hash[`${op}`] ?? op) : op;

const selectionSummary = (f: AdditionalFilter) => {
  if (!f.selected?.length || f.selected.length === f.options.length) return "Tudo";
  if (f.selected.length === 1) return optionLabel(f, f.selected[0]);
  return "Seleções múltiplas";
};

const sortOptions = (f: AdditionalFilter) =>
  [...f.options].sort((a: string, b: string) => {
    if (isMonthFilterLabel(f.label)) return monthOptionIndex(a) - monthOptionIndex(b);
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return String(a).localeCompare(String(b), undefined, { sensitivity: "base" });
  });

const ClearFilterIcon = () => (
  <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 8h36L28 25v13l-8 4V25L6 8z" strokeLinejoin="round" />
    <path d="M30 32l10 10M40 32L30 42" strokeLinecap="round" />
  </svg>
);

// O Panorama tem seletor de ano próprio (cada cartão busca a sua fonte) e não
// usa os filtros do DashboardContext — a coluna mostraria valores de outra página.
const ROUTES_WITHOUT_SIDEBAR = ["/observatorio/panorama"];

const FilterSidebar = () => {
  const { filters, applyFilters, resetFilters } = useDashboard();
  const pathname = usePathname();

  const [tempFilters, setTempFilters] = useState<Filters>(filters);
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  // FocusHidden registra o "clique fora" uma vez por abertura — lê o estado
  // mais recente por ref, senão aplicaria as marcações de quando abriu.
  const tempRef = useRef(tempFilters);
  tempRef.current = tempFilters;
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    setTempFilters(filters);
    // Aviso só faz sentido quando a página abriu com o recorte padrão em Recife.
    const defaultsToRecife = filters.additionalFilters?.some((f: AdditionalFilter) => f.selected?.includes("Recife"));
    setShowInitialMessage(!!defaultsToRecife);
  }, [filters]);

  const hasYear = !filters.hideYearFilter && !!filters.years?.length;
  const additional = tempFilters.additionalFilters || [];
  if (ROUTES_WITHOUT_SIDEBAR.includes(pathname) || (!hasYear && !additional.length)) return null;

  const currentYear = filters.year || filters.years?.[filters.years.length - 1];

  const closeDropdown = () => {
    setOpenLabel(null);
    // Só reaplica se alguma marcação mudou de fato.
    const latest = tempRef.current;
    if (JSON.stringify(latest.additionalFilters) !== JSON.stringify(filtersRef.current.additionalFilters)) {
      setShowInitialMessage(false);
      applyFilters(latest);
    }
  };

  const toggleDropdown = (label: string) => {
    if (openLabel === label) closeDropdown();
    else {
      if (openLabel) closeDropdown();
      setOpenLabel(label);
    }
  };

  const handleCheckboxChange = (label: string, option: string) => {
    setTempFilters((prev: Filters) => ({
      ...prev,
      additionalFilters: prev.additionalFilters.map((f: AdditionalFilter) => {
        if (f.label !== label) return f;
        const isAllowMultiple = f.allowMultiple !== false;
        const isSelected = f.selected.includes(option);
        return {
          ...f,
          selected: isAllowMultiple
            ? isSelected
              ? f.selected.filter((x: string) => x !== option)
              : [...f.selected, option]
            : [option],
        };
      }),
    }));
  };

  const handleSelectAll = (label: string) => {
    setTempFilters((prev: Filters) => ({
      ...prev,
      additionalFilters: prev.additionalFilters.map((f: AdditionalFilter) => {
        if (f.label !== label) return f;
        const allSelected = f.selected.length === f.options.length;
        return { ...f, selected: allSelected ? [] : [...f.options] };
      }),
    }));
  };

  const onYearChange = (year: string) => {
    setShowInitialMessage(false);
    applyFilters({ ...tempFilters, year });
  };

  const onResetFilters = () => {
    setOpenLabel(null);
    setShowInitialMessage(false);
    resetFilters();
  };

  return (
    <>
      {/* Telas estreitas: a coluna vira gaveta, aberta por este botão. */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-3 md:bottom-5 md:left-5 z-40 bi-filter-fab"
      >
        Filtros
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`bi-filter-sidebar ${
          mobileOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden lg:flex"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 pt-5 pb-3 flex flex-col gap-4">
          {hasYear && (
            <div className="flex flex-col items-stretch">
              <label className="bi-filter-label">Ano</label>
              <div className="relative">
                <select
                  value={currentYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  className="bi-filter-select appearance-none pr-7"
                >
                  {filters.years?.map((yr: string) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#12239E]">
                  <ChevronIcon up={false} />
                </span>
              </div>
            </div>
          )}

          {additional.map((f: AdditionalFilter) => {
            const isOpen = openLabel === f.label;
            const term = (searchTerms[f.label] || "").toLowerCase();
            return (
              <div key={f.label} className="flex flex-col items-stretch">
                <label className="bi-filter-label">{f.displayLabel || f.label}</label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(f.label);
                  }}
                  className="bi-filter-select flex justify-between items-center text-left"
                  title={selectionSummary(f)}
                >
                  <span className="truncate">{selectionSummary(f)}</span>
                  <ChevronIcon up={isOpen} />
                </button>

                {isOpen && (
                  <FocusHidden open={isOpen} setOpen={(val) => !val && closeDropdown()}>
                    <div className="mt-1 p-2 bg-white dark:bg-[#243041] border border-[#12239E]/30 dark:border-gray-600 rounded shadow-lg max-h-64 overflow-y-auto text-[#12239E] dark:text-gray-200">
                      {f.options.length > 8 && (
                        <input
                          type="text"
                          placeholder="Pesquisar..."
                          value={searchTerms[f.label] || ""}
                          onChange={(e) => setSearchTerms((prev) => ({ ...prev, [f.label]: e.target.value }))}
                          className="border rounded mb-2 px-2 py-1 text-xs w-full dark:bg-[#152638] dark:border-gray-600"
                        />
                      )}
                      {f.allowMultiple !== false && (
                        <label className="flex items-center gap-2 py-1 text-xs font-semibold border-b border-gray-200 dark:border-gray-600 mb-1">
                          <input
                            type="checkbox"
                            checked={f.selected.length === f.options.length}
                            onChange={() => handleSelectAll(f.label)}
                            className="h-3.5 w-3.5 accent-[#12239E]"
                          />
                          Selecionar tudo
                        </label>
                      )}
                      {sortOptions(f)
                        .filter((op) => optionLabel(f, op).toLowerCase().includes(term))
                        .map((op: string) => (
                          <label key={op} className="flex items-center gap-2 py-0.5 text-xs">
                            <input
                              type={f.allowMultiple === false ? "radio" : "checkbox"}
                              checked={f.selected.includes(op)}
                              onChange={() => handleCheckboxChange(f.label, op)}
                              className="h-3.5 w-3.5 accent-[#12239E]"
                            />
                            {optionLabel(f, op)}
                          </label>
                        ))}
                    </div>
                  </FocusHidden>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-3 pb-3 flex flex-col items-center gap-3">
          {showInitialMessage && (
            <p className="text-[10px] leading-snug text-white/90 text-center">
              Padrão: Recife. Para ver todos os dados, use Limpar Filtros.
            </p>
          )}
          <button onClick={onResetFilters} className="flex flex-col items-center text-white font-semibold text-sm hover:opacity-80">
            Limpar Filtros
            <ClearFilterIcon />
          </button>
          <img
            src="/images/logos/prefeitura_recife_logo_white.avif"
            alt="Prefeitura do Recife"
            className="w-[92px] h-auto"
          />
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white text-xs underline">
              Fechar
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
