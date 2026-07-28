const YEARS = ["2021", "2022", "2023", "2024", "2025"];

interface PanoramaFiltersProps {
  year: string;
  onYearChange: (year: string) => void;
}

const PanoramaFilters = ({ year, onYearChange }: PanoramaFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-center items-end gap-4 mb-10">
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">ANO</label>
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="px-3 py-2 border text-sm rounded-md bg-white dark:bg-[#182e46] dark:border-gray-600 dark:text-gray-300"
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
