"use client";

import { LogOut, Wallet } from "lucide-react";
import { useCcc } from "@ckb-ccc/connector-react";

import { shortenAddress } from "@/lib/wallet";

interface ConnectWalletButtonProps {
  address: string | null;
}

export function ConnectWalletButton({ address }: ConnectWalletButtonProps) {
  const { disconnect, open, wallet } = useCcc();

  if (address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="inline-flex h-12 max-w-[220px] items-center gap-2 border border-black bg-black px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-white hover:text-black"
        title={address}
      >
        <LogOut size={16} aria-hidden="true" />
        <span className="truncate">{shortenAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open()}
      className="inline-flex h-12 items-center gap-2 border border-black bg-black px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-white hover:text-black"
    >
      <Wallet size={16} aria-hidden="true" />
      {wallet ? "Select Account" : "Connect"}
    </button>
  );
}
