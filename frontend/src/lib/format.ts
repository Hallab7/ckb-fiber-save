const CKB_DECIMALS = 8;
const CKB_UNIT = 100_000_000n;

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
