import type { AssetBalance } from "@/types/fibersave";

import { formatAssetAmount } from "@/lib/format";

interface BalanceCardProps {
  balance: AssetBalance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="min-h-44 border border-[#e8e8e8] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="fs-caption text-[#666666]">{balance.symbol}</p>
          <p className="mt-8 text-4xl font-semibold">
            {formatAssetAmount(balance.amount, balance.symbol)}
          </p>
        </div>
        <span className="border border-[#e8e8e8] bg-[#f3f3f3] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-black">
          {balance.asset}
        </span>
      </div>
      {balance.fiatValue ? (
        <p className="mt-3 text-sm text-[#666666]">{balance.fiatValue}</p>
      ) : null}
    </div>
  );
}
