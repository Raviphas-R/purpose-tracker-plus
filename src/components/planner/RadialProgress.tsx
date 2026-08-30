import { cn } from "@/lib/utils";
import type { GoalType } from "@/lib/planner-types";

const TYPE_VAR: Record<GoalType, string> = {
  life: "var(--life)",
  outcome: "var(--outcome)",
  learning: "var(--learning)",
  process: "var(--process)",
  habit: "var(--habit)",
};

/**
 * A radial (donut) progress gauge. Replaces linear bars so a percentage
 * reads as one glanceable shape at any row density.
 */
export function RadialProgress({
  pct,
  type,
  size = 44,
  thickness = 4,
  label,
  className,
  color,
}: {
  pct: number;
  type?: GoalType;
  size?: number;
  thickness?: number;
  /** text rendered in the middle; defaults to the rounded percentage */
  label?: string;
  className?: string;
  color?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const stroke = color ?? (type ? TYPE_VAR[type] : "var(--primary)");

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(clamped)}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          stroke="var(--grid)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          stroke={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * clamped) / 100}
          className="transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
        />
      </svg>
      <span
        className="num absolute inset-0 grid place-items-center font-medium tabular-nums"
        style={{ fontSize: Math.max(9, size * 0.26) }}
      >
        {label ?? Math.round(clamped)}
      </span>
    </div>
  );
}
