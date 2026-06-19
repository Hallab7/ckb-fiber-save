"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { Check, Copy, RefreshCw, Wallet } from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { BalanceCard } from "@/components/balance-card";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { listActivity } from "@/lib/activity-store";
import { getAllBalances } from "@/lib/balances";
import { detectCkbDeposit } from "@/lib/deposit-tracker";
import { getConnectedAddress } from "@/lib/wallet";
import type { ActivityEvent, AssetBalance } from "@/types/fibersave";

export function DepositPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (showStatus = false) => {
    setIsRefreshing(true);
    setError(null);

    try {
      const nextAddress = await getConnectedAddress(signer);
      const nextBalances = await getAllBalances(signer);
      const ckbBalance = nextBalances.find((balance) => balance.asset === "CKB");
      const detected =
        nextAddress && ckbBalance
          ? await detectCkbDeposit(nextAddress, ckbBalance.amount)
          : null;

      setAddress(nextAddress);
      setBalances(nextBalances);
      setActivity(nextAddress ? await listActivity(nextAddress) : []);
      setQrCode(
        nextAddress
          ? await QRCode.toDataURL(nextAddress, { margin: 1, width: 220 })
          : null,
      );

      if (showStatus) {
        setStatus(
          detected
            ? `Detected a deposit of ${detected.amount} CKB.`
            : "Balance refreshed. No new deposit was detected.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh deposit state.");
    } finally {
      setIsRefreshing(false);
    }
  }, [signer]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh(false);
    });
  }, [refresh]);

  useEffect(() => {
    if (!signer) return;

    const interval = window.setInterval(() => {
      void refresh(false);
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [refresh, signer]);

  async function copyAddress() {
    if (!address) {
      return;
    }

    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-[#111827] sm:px-8">
      <section className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-[#17594a]">
              Deposit
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Receive funds</h1>
            <p className="mt-2 text-[#6b7280]">
              Copy your connected wallet address or scan the QR code from a sender wallet.
            </p>

            {!address ? (
              <div className="mt-6 rounded-md border border-dashed border-[#c9c0b0] p-5">
                <Wallet className="text-[#17594a]" size={28} />
                <p className="mt-3 font-medium">Connect wallet to show deposit address.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-[240px_1fr]">
                <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-[#d9d2c4] bg-[#faf8f3] p-4">
                  {qrCode ? (
                    <Image src={qrCode} alt="Deposit address QR code" width={220} height={220} />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm text-[#6b6254]">Wallet address</p>
                  <p className="mt-2 break-all rounded-md border border-[#d9d2c4] bg-[#faf8f3] p-3 font-mono text-sm">
                    {address}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void copyAddress()}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#17594a] px-4 text-sm font-medium text-white"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Copied" : "Copy Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void refresh(true)}
                      disabled={isRefreshing}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d9d2c4] px-4 text-sm font-medium text-[#374151] disabled:opacity-60"
                    >
                      <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                      {isRefreshing ? "Checking..." : "Check Deposit"}
                    </button>
                  </div>
                  {status ? <p className="mt-3 text-sm text-[#17594a]">{status}</p> : null}
                  {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div>
              <h2 className="mb-3 text-lg font-semibold">Supported assets</h2>
              <div className="space-y-3">
                {balances.map((balance) => (
                  <BalanceCard key={balance.asset} balance={balance} />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
              <h2 className="font-semibold">Recent deposit activity</h2>
              <div className="mt-3 space-y-2 text-sm text-[#6b7280]">
                {activity.filter((event) => event.type === "deposit").slice(0, 3).map((event) => (
                  <p key={event.id}>{event.description} - {event.status}</p>
                ))}
                {activity.filter((event) => event.type === "deposit").length === 0 ? (
                  <p>No deposit activity yet.</p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
