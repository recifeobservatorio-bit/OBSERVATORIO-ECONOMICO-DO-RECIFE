import CardEmojiBadge from "@/components/@global/cards/CardEmojiBadge";

const NOTA_COLORS: Record<string, string> = {
  A: "#22C55E",
  B: "#0155AE",
  C: "#FFBB28",
  D: "#EF4444",
};

const CapagNotaCard = ({
  title,
  nota,
  year,
  color,
}: {
  title: string;
  nota?: string | null;
  year: string;
  color?: string;
}) => {
  const displayNota = nota ?? "--";
  const barColor = color ?? (nota ? NOTA_COLORS[nota] ?? "#94A3B8" : "#94A3B8");

  return (
    <div className="bi-kpi flex-1 shrink-0 w-full" style={{ minWidth: "310px" }}>
      <h2 className="bi-kpi-title">{title}</h2>

      <div className="flex justify-between items-center gap-3 px-4 pt-3 pb-1">
        <p className="text-4xl font-bold w-fit" style={{ color: nota ? barColor : undefined }}>
          <span className={!nota ? "text-gray-400 dark:text-gray-600" : ""}>{displayNota}</span>
        </p>
        <CardEmojiBadge title="capag" color={barColor} />
      </div>

      <span className="px-4 pb-2 text-xs text-gray-500 dark:text-gray-400">CAPAG - {year}</span>
    </div>
  );
};

export default CapagNotaCard;
