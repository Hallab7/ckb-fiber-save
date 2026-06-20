import { describe, expect, it } from "vitest";

import { createGoal, listGoals } from "./goal-store";

describe("goal store", () => {
  it("creates and lists a goal for its owner", async () => {
    const goal = await createGoal({
      ownerAddress: "ckt1-owner",
      name: "School Fees",
      asset: "CKB",
      targetAmount: "1000",
    });

    expect(goal.assignedAmount).toBe("0");
    expect(await listGoals("ckt1-owner")).toEqual([goal]);
    expect(await listGoals("ckt1-other")).toEqual([]);
  });

  it("rejects an invalid target amount", async () => {
    await expect(
      createGoal({
        ownerAddress: "ckt1-owner",
        name: "Emergency Fund",
        asset: "CKB",
        targetAmount: "0",
      }),
    ).rejects.toThrow("Amount must be greater than zero.");
  });
});
