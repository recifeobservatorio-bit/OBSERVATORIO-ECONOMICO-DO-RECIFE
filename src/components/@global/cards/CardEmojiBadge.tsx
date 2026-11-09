import { cardEmoji } from "@/utils/dicts/cardEmoji";

// Selo com o emoji que ilustra o card, num fundo suave na cor do próprio card.
// Sem `icon`, o emoji sai do título (ver utils/dicts/cardEmoji.ts).
const CardEmojiBadge = ({
  title,
  icon,
  color,
}: {
  title: string;
  icon?: React.ReactNode;
  color?: string | string[];
}) => {
  const tint = (Array.isArray(color) ? color[0] : color) || "#94A3B8";

  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center w-11 h-11 rounded-xl text-2xl leading-none shrink-0 select-none"
      style={{ backgroundColor: `color-mix(in srgb, ${tint} 16%, transparent)` }}
    >
      {icon ?? cardEmoji(title)}
    </span>
  );
};

export default CardEmojiBadge;
