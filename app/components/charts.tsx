// Lightweight dependency-free SVG charts (RTL-friendly, accessible summaries).

export function LineChart({
  data,
  height = 210,
}: {
  data: { date: string; count: number }[];
  height?: number;
}) {
  const width = 600;
  if (!data.length) return null;
  const pad = { top: 16, right: 16, bottom: 36, left: 36 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.count), 1);
  const pts = data.map((d, i) => {
    const x = pad.left + (i / Math.max(data.length - 1, 1)) * W;
    const y = pad.top + H - (d.count / max) * H;
    return [x, y] as const;
  });
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const area =
    line +
    ` L${pts[pts.length - 1][0].toFixed(1)},${pad.top + H} L${pts[0][0].toFixed(
      1,
    )},${pad.top + H} Z`;
  const step = Math.max(1, Math.floor(data.length / 7));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={`مخطط الاتجاه اليومي، أعلى قيمة ${max}`}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((v) => {
        const y = pad.top + H - v * H;
        return (
          <line
            key={v}
            x1={pad.left}
            y1={y}
            x2={pad.left + W}
            y2={y}
            stroke="var(--color-line)"
            strokeWidth="1"
          />
        );
      })}
      <path d={area} fill="var(--color-primary)" opacity="0.08" />
      <path
        d={line}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3.2}
          fill="#fff"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
      ))}
      {data.map((d, i) =>
        i % step === 0 || i === data.length - 1 ? (
          <text
            key={i}
            x={pad.left + (i / Math.max(data.length - 1, 1)) * W}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-muted)"
          >
            {d.date.slice(5)}
          </text>
        ) : null,
      )}
      {[0, 0.5, 1].map((v) => (
        <text
          key={v}
          x={pad.left - 6}
          y={pad.top + H - v * H + 4}
          textAnchor="end"
          fontSize="10"
          fill="var(--color-muted)"
        >
          {Math.round(v * max)}
        </text>
      ))}
    </svg>
  );
}

export function PieChart({
  data,
  size = 170,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = -Math.PI / 2;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;
  const segs = data.map((d) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(
        2,
      )},${y2.toFixed(2)} Z`,
      pct: Math.round((d.value / total) * 100),
    };
  });

  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg width={size} height={size} role="img" aria-label="توزيع المواد">
        {segs.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" />
      </svg>
      <ul className="flex flex-col gap-2">
        {segs.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-[13px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-ink">{s.label}</span>
            <span className="text-xs text-muted">
              {s.value} ({s.pct}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
