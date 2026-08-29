export type GoalType = "life" | "outcome" | "learning" | "process" | "habit";

export type Milestone = {
  id: string;
  title: string;
  done: boolean;
};

export type Goal = {
  id: string;
  type: GoalType;
  title: string;
  description?: string | undefined;
  /** Life goals are standalone anchors; plans may point at one. */
  parentId?: string | undefined;
  /** habit: target days, outcome: target R, process: target %, learning: n/a */
  target?: number | undefined;
  current?: number | undefined;
  /** last 28 days of completion for habit rows */
  history?: boolean[] | undefined;
  milestones?: Milestone[] | undefined;
  source?: string | undefined;
  dueDate?: string | undefined;
  done?: boolean | undefined;
};

export const GOAL_TYPE_META: Record<
  GoalType,
  {
    label: string;
    blurb: string;
    /** Band the goal lives in on the unified page */
    band: "anchor" | "plan";
    dot: string;
    chip: string;
  }
> = {
  life: {
    label: "Life Goal",
    blurb:
      "A multi-year aspiration with no metric of its own — mark it done yourself, or let plans roll into it.",
    band: "anchor",
    dot: "bg-life",
    chip: "bg-life-soft text-life",
  },
  outcome: {
    label: "Outcome",
    blurb: "A performance target in R, auto-summed from your closed trades.",
    band: "plan",
    dot: "bg-outcome",
    chip: "bg-outcome-soft text-outcome",
  },
  learning: {
    label: "Learning",
    blurb: "A topic to master. Progress rolls up from its study steps.",
    band: "plan",
    dot: "bg-learning",
    chip: "bg-learning-soft text-learning",
  },
  process: {
    label: "Process",
    blurb: "A discipline auto-scored as a % over the last 30 days from a chosen metric.",
    band: "plan",
    dot: "bg-process",
    chip: "bg-process-soft text-process",
  },
  habit: {
    label: "Habit",
    blurb: "A recurring habit, auto-counted as the days you log it.",
    band: "plan",
    dot: "bg-habit",
    chip: "bg-habit-soft text-habit",
  },
};

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
};

const makeHistory = (seed: number, rate: number) => {
  const r = rand(seed);
  return Array.from({ length: 28 }, () => r() < rate);
};

export const SEED_GOALS: Goal[] = [
  {
    id: "life-1",
    type: "life",
    title: "Having a million baht before 30 yrs.",
    description: "Financial runway so trading is a choice, not a wage.",
  },
  {
    id: "life-2",
    type: "life",
    title: "Trade full-time by 2030",
    description: "Consistent enough that the desk pays the bills.",
  },
  {
    id: "out-1",
    type: "outcome",
    title: "Hit +20R this quarter",
    parentId: "life-1",
    target: 20,
    current: 7.4,
    dueDate: "2026-09-30",
  },
  {
    id: "lrn-1",
    type: "learning",
    title: "Re-reading summary Trader Discipline.",
    parentId: "life-2",
    source: "The Psychology of the Disciplined Trader",
    milestones: [
      { id: "m1", title: "Ch. 1–3 notes", done: false },
      { id: "m2", title: "Ch. 4–6 notes", done: false },
      { id: "m3", title: "One-page summary", done: false },
    ],
  },
  {
    id: "lrn-2",
    type: "learning",
    title: "Re-reading summary Trading in the Zone.",
    parentId: "life-2",
    source: "Trading in the Zone",
    milestones: [
      { id: "m1", title: "The five fundamental truths", done: false },
      { id: "m2", title: "Probability drill, 20 trades", done: false },
    ],
  },
  {
    id: "lrn-3",
    type: "learning",
    title: "Master of CAN SLIM technique",
    parentId: "life-1",
    milestones: [
      { id: "m1", title: "Screen 50 charts", done: true },
      { id: "m2", title: "Backtest 10 setups", done: false },
      { id: "m3", title: "Paper-trade a quarter", done: false },
    ],
  },
  {
    id: "prc-1",
    type: "process",
    title: "Log every trade by EOD",
    parentId: "life-2",
    target: 90,
    current: 68,
    source: "Trades logged / trades taken, 30d",
  },
  {
    id: "hbt-1",
    type: "habit",
    title: "30 min Learning each day",
    parentId: "life-2",
    target: 140,
    current: 41,
    history: makeHistory(7, 0.55),
  },
  {
    id: "hbt-2",
    type: "habit",
    title: "Sleep before midnight",
    target: 20,
    current: 6,
    history: makeHistory(21, 0.3),
  },
  {
    id: "hbt-3",
    type: "habit",
    title: "Exercise 30 min, 5 days/week",
    parentId: "life-1",
    target: 100,
    current: 58,
    history: makeHistory(3, 0.62),
  },
  {
    id: "hbt-4",
    type: "habit",
    title: "Edit Edgity code on Friday–Saturday only",
    target: 52,
    current: 11,
    history: makeHistory(11, 0.28),
  },
];
