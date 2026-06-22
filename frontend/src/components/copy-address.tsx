"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { formatAddress } from "@/lib/format";

interface CopyAddressProps {
  address: string | null;
  emptyLabel?: string;
}

export function CopyAddress({
  address,
  emptyLabel = "NO WALLET CONNECTED",
}: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!address) {
      return;
    }

    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-w-0 items-center border border-[#e8e8e8] bg-white">
      <span
        className="min-w-0 flex-1 truncate px-3 font-mono text-xs"
        title={address ?? emptyLabel}
      >
        {address ? formatAddress(address, 12, 10) : emptyLabel}
      </span>
      <button
        type="button"
        onClick={() => void copy()}
        disabled={!address}
        className="inline-flex size-11 shrink-0 items-center justify-center border-l border-[#e8e8e8] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={copied ? "Address copied" : "Copy Address"}
        title={copied ? "Copied" : "Copy full address"}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}
