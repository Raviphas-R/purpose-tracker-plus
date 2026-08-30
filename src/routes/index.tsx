import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodayBand, type TodayItem } from "@/components/planner/TodayBand";
import { GoalRow, goalProgress } from "@/components/planner/GoalRow";
import { RadialProgress } from "@/components/planner/RadialProgress";
import { TypeChip } from "@/components/planner/TypeChip";
import { NewGoalDialog } from "@/components/planner/NewGoalDialog";
import { GOAL_TYPE_META, SEED_GOALS, type Goal, type GoalType } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ladder — Today, habits and long-term goals in one page" },
      {
        name: "description",
        content:
          "A single planner surface: today's check-offs, study steps, habit streaks and life goals stacked by altitude instead of split across pages.",
      },
      { property: "og:title", content: "Ladder — one page for goals and daily activity" },
      {
        property: "og:description",
        content:
          "Merged Goals and Activities: do today's work at the top, see the plans and life goals it feeds below.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const FILTERS: (GoalType | "all")[] = ["all", "life", "outcome", "learning", "process", "habit"];

function buildHeat(goals: Goal[]) {
  const habits = goals.filter((g) => g.type === "habit" && g.history);
  const total = 26 * 7;
  return Array.from({ length: total }, (_, i) => {
    const back = total - 1 - i;
    if (back >= 28) return (i * 7919) % 23 === 0 ? 1 : 0;
    const idx = 27 - back;
    return habits.reduce((acc, h) => acc + (h.history![idx] ? 1 : 0), 0);
  });
}

function PlannerPage() {
  const [goals, setGoals] = useState<Goal[]>(SEED_GOALS);
  const [todayDone, setTodayDone] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<GoalType | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const lifeGoals = goals.filter((g) => g.type === "life");
  const plans = goals.filter((g) => g.type !== "life");

  const toggleToday = (id: string) =>
    setTodayDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleMilestone = (goalId: string, milestoneId: string) =>
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: g.milestones?.map((m) =>
                m.id === milestoneId ? { ...m, done: !m.done } : m,
              ),
            }
          : g,
      ),
    );

  const todayItems: TodayItem[] = useMemo(
    () =>
      plans
        .filter((g) => g.type === "habit" || g.type === "learning")
        .map((g) => ({
          id: g.id,
          goal: g,
          label: g.title,
          sub:
            g.source ??
            (g.type === "habit"
              ? `${g.current ?? 0}/${g.target ?? 0} days logged`
              : `${g.milestones?.filter((m) => m.done).length ?? 0}/${g.milestones?.length ?? 0} steps`),
          done: !!todayDone[g.id],
          onToggle: () => toggleToday(g.id),
        })),
    [plans, todayDone],
  );

  const heat = useMemo(() => buildHeat(goals), [goals]);
  const activeDays = heat.slice(-140).filter((v) => v > 0).length;

  const visiblePlans = plans.filter((g) => filter === "all" || g.type === filter);
  const showLife = filter === "all" || filter === "life";

  const groups = [
    ...lifeGoals.map((life) => ({
      life,
      items: visiblePlans.filter((p) => p.parentId === life.id),
    })),
    {
      life: null,
      items: visiblePlans.filter((p) => !p.parentId || !lifeGoals.some((l) => l.id === p.parentId)),
    },
  ];

  const dateLabel = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Ladder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lifeGoals.length} life goals · {plans.length} plans feeding them
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="rounded-full">
          <Plus className="size-4" />
          New goal
        </Button>
      </header>

      <TodayBand
        dateLabel={dateLabel}
        activeDays={activeDays}
        targetDays={140}
        streak={todayItems.some((i) => i.done) ? 1 : 0}
        heat={heat}
        items={todayItems}
      />

      <div className="mt-8 mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              f === filter
                ? "border-primary/40 bg-accent text-accent-foreground"
                : "border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {f === "all" ? "Everything" : GOAL_TYPE_META[f].label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {groups.map((group, gi) => {
          if (group.life && !showLife && group.items.length === 0) return null;
          if (!group.life && group.items.length === 0) return null;

          return (
            <section key={group.life?.id ?? `unassigned-${gi}`} className="card-surface">
              {group.life ? (
                showLife || group.items.length > 0 ? (
                  <div className="flex flex-wrap items-start gap-3 border-b border-border px-4 py-4">
                    <TypeChip type="life" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold">{group.life.title}</h2>
                      {group.life.description && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {group.life.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="num text-xs text-muted-foreground">
                        {group.items.length} plans
                      </span>
                      <RadialProgress
                        pct={rollup(group.items)}
                        type="life"
                        size={48}
                        thickness={5}
                      />
                    </div>
                  </div>
                ) : null
              ) : (
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <Target className="size-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Not tied to a life goal yet
                  </h2>
                </div>
              )}

              {group.items.length > 0 ? (
                <div>
                  {group.items.map((goal) => (
                    <GoalRow
                      key={goal.id}
                      goal={goal}
                      expanded={!!expanded[goal.id]}
                      onToggleExpand={() =>
                        setExpanded((p) => ({ ...p, [goal.id]: !p[goal.id] }))
                      }
                      todayDone={!!todayDone[goal.id]}
                      onToggleToday={() => toggleToday(goal.id)}
                      onToggleMilestone={(mid) => toggleMilestone(goal.id, mid)}
                    />
                  ))}
                </div>
              ) : (
                <p className="px-4 py-5 text-sm text-muted-foreground">
                  No plans attached yet — a Habit, Learning, Process or Outcome goal can point here.
                </p>
              )}
            </section>
          );
        })}
      </div>

      <NewGoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lifeGoals={lifeGoals}
        onCreate={(goal) => setGoals((prev) => [...prev, goal])}
      />
    </main>
  );
}
