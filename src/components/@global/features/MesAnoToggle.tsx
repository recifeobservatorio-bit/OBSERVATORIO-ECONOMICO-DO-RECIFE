const MesAnoToggle = ({
  mode,
  onChange,
}: {
  mode: "ano" | "mes";
  onChange: (mode: "ano" | "mes") => void;
}) => {
  return (
    <div className="flex justify-center button-container">
      <div
        role="group"
        aria-label="Alternar entre visão mensal e anual"
        className="inline-flex rounded-full border dark:border-gray-600 bg-white dark:bg-[#0C1B2B] p-0.5 text-xs"
      >
        <button
          type="button"
          aria-pressed={mode === "mes"}
          onClick={() => onChange("mes")}
          className={`px-3 py-1 rounded-full transition-colors ${
            mode === "mes"
              ? "bg-blue-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0F253D]"
          }`}
        >
          Mês
        </button>
        <button
          type="button"
          aria-pressed={mode === "ano"}
          onClick={() => onChange("ano")}
          className={`px-3 py-1 rounded-full transition-colors ${
            mode === "ano"
              ? "bg-blue-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0F253D]"
          }`}
        >
          Ano
        </button>
      </div>
    </div>
  );
};

export default MesAnoToggle;
