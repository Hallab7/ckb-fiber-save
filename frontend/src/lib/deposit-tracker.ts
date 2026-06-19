import { addActivity } from "./activity-store";
import { formatUnits, parseAssetAmount } from "./format";

const STORAGE_KEY = "fibersave.deposit-balances.v1";

type BalanceSnapshots = Record<string, string>;

function ensureBrowserStorage() {
  if (typeof window === "undefined") {
    throw new Error("Deposit tracking is only available in the browser.");
  }
}

function readSnapshots(): BalanceSnapshots {
  ensureBrowserStorage();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSnapshots(snapshots: BalanceSnapshots) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
}

export async function detectCkbDeposit(ownerAddress: string, currentBalance: string) {
  const snapshots = readSnapshots();
  const previousBalance = snapshots[ownerAddress];
  snapshots[ownerAddress] = currentBalance;
  writeSnapshots(snapshots);

  if (previousBalance === undefined) {
    return null;
  }

  const previous = parseAssetAmount(previousBalance, undefined, true);
  const current = parseAssetAmount(currentBalance, undefined, true);

  if (current <= previous) {
    return null;
  }

  const amount = formatUnits(current - previous);
  return addActivity({
    ownerAddress,
    type: "deposit",
    asset: "CKB",
    amount,
    status: "complete",
    description: `Detected wallet deposit of ${amount} CKB`,
  });
}

export function clearDepositSnapshots(ownerAddress?: string) {
  const snapshots = readSnapshots();

  if (!ownerAddress) {
    writeSnapshots({});
    return;
  }

  delete snapshots[ownerAddress];
  writeSnapshots(snapshots);
}
