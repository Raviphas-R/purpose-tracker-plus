import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOAL_TYPE_META, type Goal, type GoalType } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

const TYPES: GoalType[] = ["life", "outcome", "learning", "process", "habit"];

const PLACEHOLDER: Record<GoalType, string> = {
  life: "Trade full-time by 2030",
  outcome: "Hit +20R this quarter",
  learning: "Master Wyckoff method",
  process: "Log every trade by EOD",
  habit: "30-min market review each day",
};

const TARGET_LABEL: Partial<Record<GoalType, string>> = {
  outcome: "Target (R)",
  process: "Target (%)",
  habit: "Target (days)",
};

export function NewGoalDialog({
  open,
  onOpenChange,
  lifeGoals,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lifeGoals: Goal[];
  onCreate: (goal: Goal) => void;
}) {
  const [type, setType] = useState<GoalType>("habit");
  const [title, setTitle] = useState("");
  const [parentId, setParentId] = useState<string>("none");
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");

  const meta = GOAL_TYPE_META[type];
  const needsTarget = type in TARGET_LABEL;

  const reset = () => {
    setType("habit");
    setTitle("");
    setParentId("none");
    setTarget("");
    setDescription("");
  };

  const submit = () => {
    if (!title.trim()) return;
    const goal: Goal = { id: `g-${Date.now()}`, type, title: title.trim() };
    if (description.trim()) goal.description = description.trim();
    if (parentId !== "none") goal.parentId = parentId;
    if (needsTarget) {
      goal.target = Number(target) || 0;
      goal.current = 0;
    }
    if (type === "habit") goal.history = Array.from({ length: 28 }, () => false);
    if (type === "learning") goal.milestones = [];
    onCreate(goal);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">New goal</DialogTitle>
          <DialogDescription className="sr-only">Create a goal or plan</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                    t === type
                      ? "border-primary/40 bg-accent text-accent-foreground"
                      : "border-border bg-surface text-foreground hover:bg-muted",
                  )}
                >
                  {GOAL_TYPE_META[t].label}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{meta.blurb}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={PLACEHOLDER[type]}
            />
          </div>

          {type !== "life" && (
            <div className="space-y-2">
              <Label>Serves which life goal</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="— Unassigned —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Unassigned —</SelectItem>
                  {lifeGoals.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Optional. Plans left unassigned still show under Plans.
              </p>
            </div>
          )}

          {needsTarget && (
            <div className="space-y-2">
              <Label htmlFor="goal-target">{TARGET_LABEL[type]}</Label>
              <Input
                id="goal-target"
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="20"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="goal-desc">Description (optional)</Label>
            <Textarea
              id="goal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this goal — what you're trying to change."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim()}>
            Create goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
