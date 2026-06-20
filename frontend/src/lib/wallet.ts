import type { ccc } from "@ckb-ccc/core";

import { formatAddress } from "./format";

const DEMO_WALLET_KEY = "fibersave.demo-wallet.v1";

type DemoWallet = {
  address: string;
  ckbBalance: string;
};

export function getDemoWallet(): DemoWallet | null {
  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== "true"
  ) {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_WALLET_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoWallet>;

    if (typeof parsed.address !== "string" || typeof parsed.ckbBalance !== "string") {
      return null;
    }

    return {
      address: parsed.address,
      ckbBalance: parsed.ckbBalance,
    };
  } catch {
    return null;
  }
}

export async function getConnectedAddress(signer?: ccc.Signer): Promise<string | null> {
  if (!signer) {
    return getDemoWallet()?.address ?? null;
  }

  return signer.getRecommendedAddress();
}

export function shortenAddress(address: string) {
  return formatAddress(address);
}

export async function getPrimaryLockHash(signer?: ccc.Signer): Promise<string | null> {
  if (!signer) {
    return null;
  }

  const address = await signer.getRecommendedAddressObj();
  return address.script.hash();
}
