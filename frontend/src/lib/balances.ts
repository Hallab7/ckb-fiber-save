import type { ccc } from "@ckb-ccc/core";
import type { AssetBalance } from "@/types/fibersave";

import { shannonsToCkb } from "./format";
import { getDemoWallet } from "./wallet";

export async function getCkbBalance(signer?: ccc.Signer): Promise<AssetBalance> {
  if (!signer) {
    const demoWallet = getDemoWallet();

    return {
      asset: "CKB",
      symbol: "CKB",
      amount: demoWallet?.ckbBalance ?? "0",
    };
  }

  const balance = await signer.getBalance();

  return {
    asset: "CKB",
    symbol: "CKB",
    amount: shannonsToCkb(balance),
  };
}

export async function getRgbAssetBalances(): Promise<AssetBalance[]> {
  return [
    {
      asset: "RGB_STABLE",
      symbol: "RGB+USD",
      amount: "0",
    },
  ];
}

export async function getAllBalances(signer?: ccc.Signer): Promise<AssetBalance[]> {
  const [ckbBalance, rgbBalances] = await Promise.all([
    getCkbBalance(signer),
    getRgbAssetBalances(),
  ]);

  return [ckbBalance, ...rgbBalances];
}
