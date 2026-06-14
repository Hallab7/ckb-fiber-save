import { formatUnits, parseAssetAmount } from "./format";
import { getGoal, updateGoal } from "./goal-store";

type GoalActionInput = {
  ownerAddress: string;
  goalId: string;
  asset: string;
  amount: string;
};

function assertGoalAccess(goalOwnerAddress: string, inputOwnerAddress: string) {
  if (goalOwnerAddress !== inputOwnerAddress) {
    throw new Error("This goal belongs to a different wallet.");
  }
}

export async function assignFundsToGoal(input: GoalActionInput): Promise<void> {
  const goal = await getGoal(input.goalId);

  if (!goal) {
    throw new Error("Savings goal not found.");
  }

  assertGoalAccess(goal.ownerAddress, input.ownerAddress);

  if (goal.asset !== input.asset) {
    throw new Error("Selected asset does not match this goal.");
  }

  const currentAssigned = parseAssetAmount(goal.assignedAmount || "0", undefined, true);
  const amount = parseAssetAmount(input.amount);
  const target = parseAssetAmount(goal.targetAmount);
  const nextAssigned = currentAssigned + amount;

  await updateGoal(goal.id, {
    assignedAmount: formatUnits(nextAssigned),
    status: nextAssigned >= target ? "completed" : "active",
  });
}

export async function removeFundsFromGoal(input: GoalActionInput): Promise<void> {
  const goal = await getGoal(input.goalId);

  if (!goal) {
    throw new Error("Savings goal not found.");
  }

  assertGoalAccess(goal.ownerAddress, input.ownerAddress);

  if (goal.asset !== input.asset) {
    throw new Error("Selected asset does not match this goal.");
  }

  const currentAssigned = parseAssetAmount(goal.assignedAmount || "0", undefined, true);
  const amount = parseAssetAmount(input.amount);

  if (amount > currentAssigned) {
    throw new Error("Cannot remove more than the assigned amount.");
  }

  const nextAssigned = currentAssigned - amount;

  await updateGoal(goal.id, {
    assignedAmount: formatUnits(nextAssigned),
    status: "active",
  });
}
