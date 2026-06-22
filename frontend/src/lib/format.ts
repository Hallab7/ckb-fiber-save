const CKB_DECIMALS = 8;
const CKB_UNIT = 100_000_000n;
const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

export function formatAddress(address: string, prefixLength = 8, suffixLength = 6) {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }

  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

export function shannonsToCkb(shannons: bigint) {
  const whole = shannons / CKB_UNIT;
  const fraction = shannons % CKB_UNIT;
  const paddedFraction = fraction.toString().padStart(CKB_DECIMALS, "0");
  const trimmedFraction = paddedFraction.replace(/0+$/, "");

  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole.toString();
}

export function formatAssetAmount(amount: string, symbol: string) {
  return `${amount} ${symbol}`;
}

export function formatBalanceAmount(amount: string) {
  const normalized = amount.trim();

  if (!DECIMAL_PATTERN.test(normalized)) {
    return "0.00";
  }

  const [whole, fraction = ""] = normalized.split(".");
  const firstTwo = fraction.slice(0, 2).padEnd(2, "0");
  const shouldRound = Number(fraction[2] ?? "0") >= 5;
  let scaled = BigInt(whole) * 100n + BigInt(firstTwo);

  if (shouldRound) {
    scaled += 1n;
  }

  const roundedWhole = scaled / 100n;
  const roundedFraction = (scaled % 100n).toString().padStart(2, "0");
  const groupedWhole = roundedWhole
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${groupedWhole}.${roundedFraction}`;
}

export function parseAssetAmount(amount: string, decimals = CKB_DECIMALS, allowZero = false) {
  const normalized = amount.trim();

  if (!DECIMAL_PATTERN.test(normalized)) {
    throw new Error("Enter a valid amount.");
  }

  const [whole, fraction = ""] = normalized.split(".");

  if (fraction.length > decimals) {
    throw new Error(`Use ${decimals} or fewer decimal places.`);
  }

  const units = `${whole}${fraction.padEnd(decimals, "0")}`;
  const parsed = BigInt(units);

  if (parsed < 0n || (!allowZero && parsed === 0n)) {
    throw new Error("Amount must be greater than zero.");
  }

  return parsed;
}

export function formatUnits(units: bigint, decimals = CKB_DECIMALS) {
  const base = 10n ** BigInt(decimals);
  const whole = units / base;
  const fraction = units % base;
  const paddedFraction = fraction.toString().padStart(decimals, "0");
  const trimmedFraction = paddedFraction.replace(/0+$/, "");

  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole.toString();
}

export function getGoalProgress(assignedAmount: string, targetAmount: string) {
  try {
    const assigned = parseAssetAmount(assignedAmount, CKB_DECIMALS, true);
    const target = parseAssetAmount(targetAmount);

    return Math.min(100, Number((assigned * 10_000n) / target) / 100);
  } catch {
    return 0;
  }
}
