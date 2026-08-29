import { Check } from "lucide-react";
import { Heatmap, HeatmapLegend } from "./Heatmap";
import type { Goal } from "@/lib/planner-types";
import { GOAL_TYPE_META } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

export type TodayItem = {
  id: string;
  goal: Goal;
  label: string;
  sub?: string;
  done: boolean;
  onToggle: () => void;
};

export function TodayBand({
  dateLabel,
  activeDays,
  targetDays,
  streak,
  heat,
  items,
}: {
  dateLabel: string;
  activeDays: number;
  targetDays: number;
  streak: number;
  heat: number[];
  items: TodayItem[];
}) {
  const doneCount = items.filter((i) => i.done).length;

  return (
    <section className="card-surface overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="text-2xl font-semibold">{dateLabel}</h2>
          <p className="text-sm text-muted-foreground">
            <span className="num font-medium text-foreground">{doneCount}</span> of {items.length}{" "}
            things done today
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[11px] tracking-widest uppercase text-muted-foreground">Active</p>
            <p className="num text-xl font-semibold">
              {activeDays}
              <span className="text-muted-foreground">/{targetDays}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] tracking-widest uppercase text-muted-foreground">Streak</p>
            <p className="num text-xl font-semibold text-success">{streak}d</p>
          </div>
        </div>
      </header>

      <div className="space-y-3 border-b border-border px-6 pb-5">
        <div className="overflow-x-auto pb-1">
          <Heatmap days={heat} />
        </div>
        <HeatmapLegend />
      </div>

      <div className="p-4">
        <p className="px-2 pb-2 text-[11px] tracking-widest uppercase text-muted-foreground">
          Do today
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={item.onToggle}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  item.done
                    ? "border-primary/30 bg-accent"
                    : "border-border bg-surface hover:bg-surface-sunken",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                    item.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input",
                  )}
                >
                  {item.done && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    GOAL_TYPE_META[item.goal.type].dot,
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm font-medium",
                      item.done && "text-muted-foreground line-through",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.sub && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.sub}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            Nothing scheduled — add a habit or learning plan below.
          </p>
        )}
      </div>
    </section>
  );
}
