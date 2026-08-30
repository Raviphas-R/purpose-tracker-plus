import { ChevronRight } from "lucide-react";
import { TypeChip } from "./TypeChip";
import { DayStrip } from "./DayStrip";
import { RadialProgress } from "./RadialProgress";
import type { Goal } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

export function goalProgress(goal: Goal): { pct: number; label: string } | null {
  switch (goal.type) {
    case "habit":
      return {
        pct: goal.target ? Math.min(100, ((goal.current ?? 0) / goal.target) * 100) : 0,
        label: `${goal.current ?? 0} / ${goal.target ?? 0} days`,
      };
    case "outcome":
      return {
        pct: goal.target ? Math.min(100, ((goal.current ?? 0) / goal.target) * 100) : 0,
        label: `${goal.current ?? 0}R / ${goal.target ?? 0}R`,
      };
    case "process":
      return {
        pct: Math.min(100, goal.current ?? 0),
        label: `${goal.current ?? 0}% · target ${goal.target ?? 0}%`,
      };
    case "learning": {
      const ms = goal.milestones ?? [];
      const done = ms.filter((m) => m.done).length;
      if (!ms.length) return { pct: 0, label: "No steps yet" };
      return { pct: (done / ms.length) * 100, label: `${done} / ${ms.length} steps` };
    }
    default:
      return null;
  }
}

export function GoalRow({
  goal,
  expanded,
  onToggleExpand,
  onToggleToday,
  todayDone,
  onToggleMilestone,
}: {
  goal: Goal;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleToday: () => void;
  todayDone: boolean;
  onToggleMilestone: (milestoneId: string) => void;
}) {
  const progress = goalProgress(goal);
  const expandable = goal.type === "learning" && (goal.milestones?.length ?? 0) > 0;

  return (
    <div className="border-b border-border/70 last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-sunken/70">
        <button
          type="button"
          onClick={onToggleExpand}
          disabled={!expandable}
          aria-label="Toggle steps"
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded text-muted-foreground",
            expandable ? "hover:bg-muted" : "opacity-0",
          )}
        >
          <ChevronRight className={cn("size-4 transition-transform", expanded && "rotate-90")} />
        </button>

        <TypeChip type={goal.type} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium">{goal.title}</p>
          {goal.source && (
            <p className="truncate text-xs text-muted-foreground">{goal.source}</p>
          )}
        </div>

        {goal.type === "habit" && goal.history && (
          <div className="hidden lg:block">
            <DayStrip
              history={goal.history}
              todayDone={todayDone}
              onToggleToday={onToggleToday}
            />
          </div>
        )}

        {progress && (
          <div className="flex w-52 shrink-0 items-center justify-end gap-3">
            <span className="num text-xs whitespace-nowrap text-muted-foreground">
              {progress.label}
            </span>
            <RadialProgress pct={progress.pct} type={goal.type} size={40} thickness={4} />
          </div>
        )}
      </div>

      {expanded && expandable && (
        <ul className="space-y-1 pb-3 pl-16 pr-4">
          {goal.milestones!.map((m) => (
            <li key={m.id}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-surface-sunken">
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={() => onToggleMilestone(m.id)}
                  className="size-4 accent-[var(--primary)]"
                />
                <span className={cn(m.done && "text-muted-foreground line-through")}>
                  {m.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
