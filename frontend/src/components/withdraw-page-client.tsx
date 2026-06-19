"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { addActivity, updateActivityStatus } from "@/lib/activity-store";
import {
  getCkbExplorerTransactionUrl,
  sendCkbTransfer,
  waitForCkbTransaction,
} from "@/lib/ckb-transactions";
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
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setTxHash(null);
    setIsSubmitting(true);

    try {
      if (!address || !signer) {
        throw new Error("Connect a wallet before sending a withdrawal.");
      }

      if (asset !== "CKB") {
        throw new Error("Only CKB withdrawals are active. RGB++ and BTC remain disabled.");
      }

      setStatus("Building transaction and waiting for wallet approval...");
      const nextTxHash = await sendCkbTransfer(signer, recipient, amount);
      const activity = await addActivity({
        ownerAddress: address,
        type: "withdrawal",
        asset,
        amount,
        status: "pending",
        txHash: nextTxHash,
        description: note.trim()
          ? `Sent CKB to ${recipient.trim()}: ${note.trim()}`
          : `Sent CKB to ${recipient.trim()}`,
      });

      setTxHash(nextTxHash);
      setRecipient("");
      setAmount("");
      setNote("");
      setStatus("Transaction broadcast. Waiting for CKB testnet confirmation.");

      void waitForCkbTransaction(signer, nextTxHash).then(async (nextStatus) => {
        await updateActivityStatus(activity.id, nextStatus, nextTxHash);
        setStatus(
          nextStatus === "complete"
            ? "Withdrawal confirmed on CKB testnet."
            : nextStatus === "failed"
              ? "The CKB node rejected the withdrawal."
              : "Transaction remains pending. Its status will refresh from the Activity page.",
        );
      }).catch(() => {
        setStatus("Transaction broadcast. Its status will refresh from the Activity page.");
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send withdrawal.";
      setError(message);

      if (address) {
        await addActivity({
          ownerAddress: address,
          type: "withdrawal",
          asset,
          amount: amount || undefined,
          status: "failed",
          description: `Withdrawal failed: ${message}`,
        });
      }
    } finally {
      setIsSubmitting(false);
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
            Send CKB through your connected wallet. FiberSave builds the transaction, while your wallet controls approval and signing.
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
                <option value="RGB_STABLE" disabled>RGB_STABLE (coming later)</option>
                <option value="BTC" disabled>BTC (coming later)</option>
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
          {txHash ? (
            <a
              href={getCkbExplorerTransactionUrl(txHash)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block break-all text-sm font-medium text-[#17594a] underline"
            >
              View transaction on CKB Explorer
            </a>
          ) : null}

          <button
            disabled={isSubmitting}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#17594a] px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Waiting for Wallet..." : "Send Withdrawal"}
          </button>
        </form>
      </section>
    </main>
  );
}
