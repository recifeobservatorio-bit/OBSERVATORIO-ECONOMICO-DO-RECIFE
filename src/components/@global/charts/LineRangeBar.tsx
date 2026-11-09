import { useRef } from "react";

// Barra deslizante embaixo dos gráficos de linha longos: miniatura da série
// inteira + janela arrastável (meio move, alças laterais ampliam/reduzem).
// Substitui o Brush do Recharts, que reiniciava o arraste a cada re-render da
// página (só andava 1 passo). Aqui o estado fica no LineChart e o arraste usa
// pointer capture, então re-renders no meio do caminho não atrapalham.

type Mode = "move" | "start" | "end";

const MIN_SPAN = 6;

const LineRangeBar = ({
  count,
  start,
  end,
  series,
  colors,
  onChange,
  style,
}: {
  count: number;
  start: number;
  end: number;
  series: number[][];
  colors: string[];
  onChange: (start: number, end: number) => void;
  style?: React.CSSProperties;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: Mode; x: number; start: number; end: number } | null>(null);
  const last = Math.max(1, count - 1);

  const onPointerDown = (mode: Mode) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { mode, x: e.clientX, start, end };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const width = trackRef.current?.getBoundingClientRect().width;
    if (!d || !width) return;
    const delta = Math.round(((e.clientX - d.x) / width) * last);
    let s = d.start;
    let en = d.end;
    if (d.mode === "move") {
      const span = d.end - d.start;
      s = Math.min(Math.max(0, d.start + delta), last - span);
      en = s + span;
    } else if (d.mode === "start") {
      s = Math.min(Math.max(0, d.start + delta), d.end - MIN_SPAN);
    } else {
      en = Math.max(Math.min(last, d.end + delta), d.start + MIN_SPAN);
    }
    if (s !== start || en !== end) onChange(s, en);
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  // Miniatura: cada série normalizada no próprio min–max, só pra dar o desenho.
  const paths = series.map((values) => {
    // null = sem dado (não é 0): fica fora da miniatura.
    const nums = values.filter((v) => v != null).map(Number).filter(Number.isFinite);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const span = max - min || 1;
    return values
      .map((v, i) => {
        if (v == null) return null;
        const n = Number(v);
        if (!Number.isFinite(n)) return null;
        return `${((i / last) * 100).toFixed(2)},${(22 - ((n - min) / span) * 18).toFixed(2)}`;
      })
      .filter(Boolean)
      .join(" ");
  });

  const left = (start / last) * 100;
  const width = ((end - start) / last) * 100;
  const handle = "absolute top-0 h-full w-2 rounded-sm cursor-ew-resize touch-none";

  return (
    <div
      ref={trackRef}
      className="bi-no-drag relative h-[26px] select-none rounded border border-gray-300 dark:border-gray-600"
      style={style}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => onChange(0, last)}
      title="Arraste para mudar o período · duplo clique mostra tudo"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden>
        {paths.map((points, i) => (
          <polyline key={i} points={points} fill="none" stroke={colors[i] || "#1e3a8a"} strokeOpacity={0.55} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div
        className="absolute top-0 h-full cursor-grab touch-none active:cursor-grabbing"
        style={{ left: `${left}%`, width: `${width}%`, borderTop: `2px solid ${colors[0] || "#1e3a8a"}`, borderBottom: `2px solid ${colors[0] || "#1e3a8a"}` }}
        onPointerDown={onPointerDown("move")}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Tinta da janela numa camada à parte: a cor da série pode vir como nome/rgb, sem como somar alfa no hex. */}
        <div className="absolute inset-0" style={{ background: colors[0] || "#1e3a8a", opacity: 0.12 }} />
        <div className={`${handle} -left-1`} style={{ background: colors[0] || "#1e3a8a" }} onPointerDown={onPointerDown("start")} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
        <div className={`${handle} -right-1`} style={{ background: colors[0] || "#1e3a8a" }} onPointerDown={onPointerDown("end")} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </div>
    </div>
  );
};

export default LineRangeBar;
