import type { SavingsGoal } from "@/types/fibersave";

const STORAGE_KEY = "fibersave.goals.v1";

type CreateGoalInput = {
  ownerAddress: string;
  name: string;
  asset: SavingsGoal["asset"];
  targetAmount: string;
  targetDate?: string;
};

function ensureBrowserStorage() {
  if (typeof window === "undefined") {
    throw new Error("Goal storage is only available in the browser.");
  }
}

function readGoals(): SavingsGoal[] {
  ensureBrowserStorage();

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGoals(goals: SavingsGoal[]) {
  ensureBrowserStorage();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `goal_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function listGoals(ownerAddress: string): Promise<SavingsGoal[]> {
  return readGoals()
    .filter((goal) => goal.ownerAddress === ownerAddress)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getGoal(goalId: string): Promise<SavingsGoal | null> {
  return readGoals().find((goal) => goal.id === goalId) ?? null;
}

export async function createGoal(input: CreateGoalInput): Promise<SavingsGoal> {
  const now = new Date().toISOString();
  const goal: SavingsGoal = {
    id: createId(),
    ownerAddress: input.ownerAddress,
    name: input.name.trim(),
    asset: input.asset,
    targetAmount: input.targetAmount,
    assignedAmount: "0",
    targetDate: input.targetDate || undefined,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  writeGoals([...readGoals(), goal]);

  return goal;
}

export async function updateGoal(
  goalId: string,
  patch: Partial<SavingsGoal>,
): Promise<SavingsGoal> {
  const goals = readGoals();
  const index = goals.findIndex((goal) => goal.id === goalId);

  if (index === -1) {
    throw new Error("Savings goal not found.");
  }

  const updated: SavingsGoal = {
    ...goals[index],
    ...patch,
    id: goals[index].id,
    ownerAddress: goals[index].ownerAddress,
    updatedAt: new Date().toISOString(),
  };

  goals[index] = updated;
  writeGoals(goals);

  return updated;
}

export async function archiveGoal(goalId: string): Promise<void> {
  await updateGoal(goalId, { status: "archived" });
}

export async function clearGoals(ownerAddress?: string): Promise<void> {
  if (!ownerAddress) {
    writeGoals([]);
    return;
  }

  writeGoals(readGoals().filter((goal) => goal.ownerAddress !== ownerAddress));
}
