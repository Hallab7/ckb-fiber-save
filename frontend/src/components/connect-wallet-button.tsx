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
        className="inline-flex h-10 max-w-[180px] items-center gap-2 rounded-md bg-[#111827] px-4 text-sm font-medium text-white"
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
      className="inline-flex h-10 items-center gap-2 rounded-md bg-[#111827] px-4 text-sm font-medium text-white"
    >
      <Wallet size={16} aria-hidden="true" />
      {wallet ? "Select Account" : "Connect"}
    </button>
  );
}
