import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { formatAssetAmount, getGoalProgress } from "@/lib/format";
import type { SavingsGoal } from "@/types/fibersave";

interface GoalCardProps {
  goal: SavingsGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const progress = getGoalProgress(goal.assignedAmount, goal.targetAmount);

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="block min-h-52 border border-[#e8e8e8] bg-white p-6 transition hover:border-black"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold">{goal.name}</p>
          <p className="mt-1 text-sm text-[#666666]">
            {formatAssetAmount(goal.assignedAmount, goal.asset)} of{" "}
            {formatAssetAmount(goal.targetAmount, goal.asset)}
          </p>
        </div>
        <span className="border border-[#e8e8e8] bg-[#f3f3f3] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-black">
          {goal.status}
        </span>
      </div>

      <div
        className="fs-progress-track mt-10 h-1 overflow-hidden"
        data-testid="goal-progress-track"
      >
        <div
          className="fs-progress-fill h-full"
          data-testid="goal-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#666666]">
        <span>{progress.toFixed(1)}%</span>
        {goal.targetDate ? (
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} aria-hidden="true" />
            {goal.targetDate}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
