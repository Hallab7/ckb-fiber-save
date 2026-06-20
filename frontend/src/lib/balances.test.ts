import type { ccc } from "@ckb-ccc/core";
import { describe, expect, it } from "vitest";

import { getAllBalances, getCkbBalance } from "./balances";

describe("balances", () => {
  it("formats signer balance from shannons to CKB", async () => {
    const signer = {
      getBalance: async () => 12_345_000_000n,
    } as unknown as ccc.Signer;

    await expect(getCkbBalance(signer)).resolves.toMatchObject({
      asset: "CKB",
      symbol: "CKB",
      amount: "123.45",
    });
  });

  it("returns the supported balance interface", async () => {
    const balances = await getAllBalances();

    expect(balances.map((balance) => balance.asset)).toEqual(["CKB", "RGB_STABLE"]);
  });
});
