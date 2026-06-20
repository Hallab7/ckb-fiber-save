import { describe, expect, it } from "vitest";

import { assignFundsToGoal, removeFundsFromGoal } from "./goal-actions";
import { createGoal, getGoal } from "./goal-store";

describe("goal actions", () => {
  it("assigns and removes funds from a goal", async () => {
    const goal = await createGoal({
      ownerAddress: "ckt1-owner",
      name: "Rent",
      asset: "CKB",
      targetAmount: "100",
    });

    await assignFundsToGoal({
      ownerAddress: goal.ownerAddress,
      goalId: goal.id,
      asset: goal.asset,
      amount: "40",
      availableAmount: "100",
    });
    expect((await getGoal(goal.id))?.assignedAmount).toBe("40");

    await removeFundsFromGoal({
      ownerAddress: goal.ownerAddress,
      goalId: goal.id,
      asset: goal.asset,
      amount: "15",
      availableAmount: "100",
    });
    expect((await getGoal(goal.id))?.assignedAmount).toBe("25");
  });

  it("rejects assignments above the available wallet balance", async () => {
    const first = await createGoal({
      ownerAddress: "ckt1-owner",
      name: "Rent",
      asset: "CKB",
      targetAmount: "100",
    });
    const second = await createGoal({
      ownerAddress: "ckt1-owner",
      name: "School",
      asset: "CKB",
      targetAmount: "100",
    });

    await assignFundsToGoal({
      ownerAddress: first.ownerAddress,
      goalId: first.id,
      asset: first.asset,
      amount: "70",
      availableAmount: "100",
    });

    await expect(
      assignFundsToGoal({
        ownerAddress: second.ownerAddress,
        goalId: second.id,
        asset: second.asset,
        amount: "40",
        availableAmount: "100",
      }),
    ).rejects.toThrow("Assignment exceeds the available wallet balance.");
  });

  it("completes a goal when its target is reached", async () => {
    const goal = await createGoal({
      ownerAddress: "ckt1-owner",
      name: "Laptop",
      asset: "CKB",
      targetAmount: "50",
    });

    await assignFundsToGoal({
      ownerAddress: goal.ownerAddress,
      goalId: goal.id,
      asset: goal.asset,
      amount: "50",
      availableAmount: "50",
    });

    expect((await getGoal(goal.id))?.status).toBe("completed");
  });
});
