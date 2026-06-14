import type { ccc } from "@ckb-ccc/core";

import { formatAddress } from "./format";

export async function getConnectedAddress(signer?: ccc.Signer): Promise<string | null> {
  if (!signer) {
    return null;
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
