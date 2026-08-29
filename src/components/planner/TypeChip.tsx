import { GOAL_TYPE_META, type GoalType } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

export function TypeChip({ type, className }: { type: GoalType; className?: string }) {
  const meta = GOAL_TYPE_META[type];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        meta.chip,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
