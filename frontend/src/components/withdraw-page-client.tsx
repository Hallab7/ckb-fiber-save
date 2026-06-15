"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ccc } from "@ckb-ccc/core";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { addActivity } from "@/lib/activity-store";
import { parseAssetAmount } from "@/lib/format";
import { getConnectedAddress } from "@/lib/wallet";
import type { AssetType } from "@/types/fibersave";

export function WithdrawPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [asset, setAsset] = useState<AssetType>("CKB");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAddress() {
      const nextAddress = await getConnectedAddress(signer);

      if (isActive) {
        setAddress(nextAddress);
      }
    }

    queueMicrotask(() => {
      void loadAddress();
    });

    return () => {
      isActive = false;
    };
  }, [signer]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    try {
      if (!address || !signer) {
        throw new Error("Connect a wallet before preparing a withdrawal.");
      }

      parseAssetAmount(amount);

      if (asset !== "CKB") {
        throw new Error("Only CKB withdrawal preparation is available in this MVP.");
      }

      await ccc.Address.fromString(recipient.trim(), signer.client);

      await addActivity({
        ownerAddress: address,
        type: "withdrawal",
        asset,
        amount,
        status: "pending",
        description: note.trim()
          ? `Prepared withdrawal to ${recipient.trim()}: ${note.trim()}`
          : `Prepared withdrawal to ${recipient.trim()}`,
      });

      setRecipient("");
      setAmount("");
      setNote("");
      setStatus("Withdrawal recorded as pending. Transaction signing will be connected in the testnet integration step.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to prepare withdrawal.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-[#111827] sm:px-8">
      <section className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-[#17594a]">
            Withdraw
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Prepare withdrawal</h1>
          <p className="mt-2 text-[#6b7280]">
            This MVP validates the request and records a pending activity item. Real transaction signing is the next testnet integration step.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium">Recipient address</span>
            <input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#d9d2c4] px-3 outline-none focus:border-[#17594a]"
              placeholder="ckt1..."
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Asset</span>
              <select
                value={asset}
                onChange={(event) => setAsset(event.target.value as AssetType)}
                className="mt-2 h-11 w-full rounded-md border border-[#d9d2c4] bg-white px-3 outline-none focus:border-[#17594a]"
              >
                <option value="CKB">CKB</option>
                <option value="RGB_STABLE">RGB_STABLE</option>
                <option value="BTC">BTC</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Amount</span>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-[#d9d2c4] px-3 outline-none focus:border-[#17594a]"
                inputMode="decimal"
                placeholder="100"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium">Note</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#d9d2c4] px-3 outline-none focus:border-[#17594a]"
              placeholder="Optional"
            />
          </label>

          {error ? <p className="mt-4 text-sm text-[#b42318]">{error}</p> : null}
          {status ? <p className="mt-4 text-sm text-[#17594a]">{status}</p> : null}

          <button className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#17594a] px-5 text-sm font-medium text-white">
            Prepare Withdrawal
          </button>
        </form>
      </section>
    </main>
  );
}
