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
      className="block rounded-lg border border-[#d9d2c4] bg-white p-4 shadow-sm transition hover:border-[#17594a]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{goal.name}</p>
          <p className="mt-1 text-sm text-[#6b6254]">
            {formatAssetAmount(goal.assignedAmount, goal.asset)} of{" "}
            {formatAssetAmount(goal.targetAmount, goal.asset)}
          </p>
        </div>
        <span className="rounded-md bg-[#edf7f3] px-2 py-1 text-xs font-medium text-[#17594a]">
          {goal.status}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ebe4d8]">
        <div
          className="h-full rounded-full bg-[#17594a]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#6b7280]">
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
