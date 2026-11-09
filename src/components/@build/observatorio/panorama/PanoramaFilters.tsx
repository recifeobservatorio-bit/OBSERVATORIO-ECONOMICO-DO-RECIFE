const YEARS = ["2021", "2022", "2023", "2024", "2025"];

interface PanoramaFiltersProps {
  year: string;
  onYearChange: (year: string) => void;
}

const PanoramaFilters = ({ year, onYearChange }: PanoramaFiltersProps) => {
  return (
    // Mesmo visual da coluna de filtros (faixa laranja) — o Panorama não usa a
    // coluna porque cada cartão busca a própria fonte com este ano local.
    <div className="flex flex-wrap justify-center items-end gap-4 mb-6">
      <div className="flex items-center gap-2 rounded px-3 py-1.5" style={{ background: "var(--bi-orange)" }}>
        <label className="bi-filter-label !mb-0">Ano</label>
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="bi-filter-select !w-24"
        >
          {YEARS.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PanoramaFilters;
