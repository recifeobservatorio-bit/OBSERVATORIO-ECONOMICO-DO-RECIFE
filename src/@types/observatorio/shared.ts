export interface Filters<T = unknown> {
    year?: string;
    years?: string[];
    additionalFilters: AdditionalFilter[];
    extra?: T;
    /** Esconde o seletor de ANO no Navbar — para abas cuja fonte de dados não tem coluna de ano. */
    hideYearFilter?: boolean;
  }
  
export interface AdditionalFilter {
    options: string[];
    label: string;
    /** Nome amigável exibido na UI (dropdown e resumo de filtros). Se ausente, usa `label`. */
    displayLabel?: string;
    selected: string[];
    allowMultiple?: boolean;
    fixed?: string[];
    blocked?: boolean
    temp?: boolean
    hash?: { [key: string]: number | string }
}

export interface DataWithFilters<T> {
    filteredData: T[];
    additionalFiltersOptions: AdditionalFilter[];
    rawData?: T[];
    /** Same as filteredData but ignoring the month filter — for line charts, where
     * restricting to a single selected month would collapse the series to one point. */
    filteredDataSemMes?: T[];
    /** Anos realmente presentes nos dados (computeAvailableYears), coletado por
     * DashboardContext.fetchData pra substituir o `Filters.years` estático do dropdown. */
    yearsOptions?: string[];
}

export interface Service<T> {
  setYear: (year: string) => void;
  fetchDataForTab: (tab: string, filters: Filters) => Promise<T>;
}

export interface ChartBuild<T = unknown> {
  data: T | (T | T);
  rawData?: T;
  /** Same as data but ignoring the month filter — feed this to line charts instead of
   * data so selecting a single month doesn't collapse the series to one point. */
  dataSemMes?: T;
  colors?: string[];
  title?: string;
  months?: any;
  toCompare?: string[];
  monthRecent?: number;
  subText?: string;
  type?: "Embarque" | "Desembarque";
  nameKey?: string;
  year?: string;
  porto?: string; // TIRAR ESSA MERDA RALADA
  color?: string | string[]; // TIRAR ISSO AQUI QUE TEM EM PORTO
}

export interface CardComponent {
  Component: React.ElementType;
}

export interface CardBuild<T = unknown> {
  data: T;
  title?: string;
  year: string;
  color: string[] | string;
  capital?: string;
  local?: string;
  cards?: CardComponent[];
}