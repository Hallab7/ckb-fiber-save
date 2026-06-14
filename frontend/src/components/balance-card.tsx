import type { AssetBalance } from "@/types/fibersave";

import { formatAssetAmount } from "@/lib/format";

interface BalanceCardProps {
  balance: AssetBalance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#6b6254]">{balance.symbol}</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatAssetAmount(balance.amount, balance.symbol)}
          </p>
        </div>
        <span className="rounded-md bg-[#edf7f3] px-2 py-1 text-xs font-medium text-[#17594a]">
          {balance.asset}
        </span>
      </div>
      {balance.fiatValue ? (
        <p className="mt-3 text-sm text-[#6b7280]">{balance.fiatValue}</p>
      ) : null}
    </div>
  );
}
