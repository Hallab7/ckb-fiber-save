import { describe, expect, it } from "vitest";

import { addActivity, listActivity, updateActivityStatus } from "./activity-store";

describe("activity store", () => {
  it("adds an activity event", async () => {
    const event = await addActivity({
      ownerAddress: "ckt1-owner",
      type: "deposit",
      asset: "CKB",
      amount: "10",
      status: "pending",
      description: "Deposit detected",
    });

    expect(await listActivity("ckt1-owner")).toEqual([event]);
  });

  it("updates activity status and transaction hash", async () => {
    const event = await addActivity({
      ownerAddress: "ckt1-owner",
      type: "withdrawal",
      asset: "CKB",
      amount: "10",
      status: "pending",
      description: "Withdrawal",
    });

    const updated = await updateActivityStatus(event.id, "complete", "0xtx");

    expect(updated.status).toBe("complete");
    expect(updated.txHash).toBe("0xtx");
  });
});
