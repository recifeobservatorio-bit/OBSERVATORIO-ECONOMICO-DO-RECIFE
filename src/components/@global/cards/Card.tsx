import { tooltipFormatter } from "@/utils/formatters/@global/graphFormatter";

import CardEmojiBadge from "./CardEmojiBadge";

const Card = ({
  title = "",
  data,
  year,
  color,
  local,
  percent = false,
  position = false,
  minWidth = 310,
  icon,
}: {
  title: string;
  local?: string;
  data: number | string | {};
  year: string;
  color: string | string[];
  percent?: boolean;
  position?: boolean;
  minWidth?: number;
  icon?: React.ReactNode;
}) => {
  // Card de KPI no estilo Power BI: título na faixa azul-marinho, número
  // grande no corpo (emoji ao lado), local/ano discretos embaixo.
  return (
    <div className="bi-kpi shrink-0 w-full sm:w-auto" style={{ minWidth: `${minWidth}px` }}>
      <h2 className="bi-kpi-title">{title}</h2>

      <div className="flex-1 flex justify-between items-center gap-3 px-4 pt-3 pb-1">
        <p className="text-4xl font-semibold text-gray-900 dark:text-gray-100 w-fit">
          {percent ? `${tooltipFormatter(+data)}%` : ( position ? `${tooltipFormatter(+data)}°` : tooltipFormatter(+data))}
        </p>
        <CardEmojiBadge title={title} icon={icon} color={color} />
      </div>

      <span className="px-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
        {local ? `${local} -` : ""} {year}
      </span>
    </div>
  );
};

export default Card;
