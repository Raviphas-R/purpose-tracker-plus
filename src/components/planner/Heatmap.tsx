import { cn } from "@/lib/utils";

type Props = {
  /** intensity 0..4 per day, oldest first, length = weeks * 7 */
  days: number[];
  weeks?: number;
};

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

export function Heatmap({ days, weeks = 26 }: Props) {
  const cells = days.slice(-weeks * 7);
  const columns: number[][] = [];
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7));

  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-between py-px text-[10px] text-muted-foreground">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="h-3 leading-3">
            {d}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px] overflow-hidden">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((v, ri) => (
              <span
                key={ri}
                className={cn(
                  "size-3 rounded-[3px]",
                  v === 0 && "bg-grid",
                  v === 1 && "bg-grid-active/25",
                  v === 2 && "bg-grid-active/50",
                  v === 3 && "bg-grid-active/75",
                  v >= 4 && "bg-grid-active",
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeatmapLegend() {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span>Less</span>
      {[0, 1, 2, 3, 4].map((v) => (
        <span
          key={v}
          className={cn(
            "size-3 rounded-[3px]",
            v === 0 && "bg-grid",
            v === 1 && "bg-grid-active/25",
            v === 2 && "bg-grid-active/50",
            v === 3 && "bg-grid-active/75",
            v >= 4 && "bg-grid-active",
          )}
        />
      ))}
      <span>More</span>
    </div>
  );
}
