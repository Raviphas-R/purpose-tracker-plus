import { cn } from "@/lib/utils";

/** Inline 28-day strip shown on a habit row — replaces the old separate Habits table. */
export function DayStrip({
  history,
  todayDone,
  onToggleToday,
}: {
  history: boolean[];
  todayDone: boolean;
  onToggleToday: () => void;
}) {
  return (
    <div className="flex items-center gap-[2px]">
      {history.slice(-27).map((d, i) => (
        <span
          key={i}
          className={cn("h-4 w-[7px] rounded-[2px]", d ? "bg-habit/70" : "bg-grid")}
        />
      ))}
      <button
        type="button"
        onClick={onToggleToday}
        aria-label={todayDone ? "Undo today" : "Mark today done"}
        className={cn(
          "ml-[3px] h-4 w-[9px] rounded-[2px] ring-1 transition-colors",
          todayDone ? "bg-habit ring-habit" : "bg-transparent ring-input hover:bg-habit/25",
        )}
      />
    </div>
  );
}
