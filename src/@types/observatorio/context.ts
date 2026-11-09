import { AeroportoDataResult } from "./@data/aeroportoData";
import { BalancaGeralData } from "./@data/balancaComercialData";
import { CombustiveisDataResult } from "./@data/combustiveisData";
import { IpcaDataResult } from "./@data/ipcaData";
import { PortoDataResult } from "./@data/portoData";
import { TributosDataResult } from "./@data/tributosData";
import { Filters } from "./shared";

export type DashboardData = AeroportoDataResult | BalancaGeralData | IpcaDataResult | PortoDataResult | CombustiveisDataResult | TributosDataResult;

export interface HiddenChart {
  id: string;
  category: string;
  title: string;
  subText?: string;
  component: React.ReactNode;
  wrapperElement: HTMLElement | null;
  originalDisplay: string;
  thumbnailUrl: string;
}

export interface DashboardContextProps<T> {
  filters: Filters;
  data: DashboardData | null;
  setData: React.Dispatch<React.SetStateAction<DashboardData | null>>;
  isLoading: boolean;
  applyFilters: (newFilters: Filters) => Promise<void>;
  resetFilters: () => void;
  /**
   * Liga/desliga no filtro da página o valor de categoria clicado num gráfico (limite de
   * MAX_CHART_PICKS_PER_TAB por aba). Também troca o ano quando o valor é um dos anos disponíveis.
   * Retorna true se o valor pertence a algum filtro e foi tratado, false se o chamador deve
   * cair no comportamento antigo (cross-filter local).
   * - `filterLabel`: força o filtro alvo (desambigua).
   * - `hint`: texto (ex.: título do gráfico) usado só para desempatar quando o valor bate em mais de um filtro.
   */
  toggleFilterValue: (value: string, opts?: { filterLabel?: string; hint?: string }) => boolean;
  hiddenCharts: HiddenChart[];
  addHiddenChart: (chart: HiddenChart) => void;
  removeHiddenChart: (id: string) => void;
}