"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Landmark, PiggyBank, RefreshCw, Wallet } from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { getAllBalances } from "@/lib/balances";
import { getConnectedAddress } from "@/lib/wallet";
import type { AssetBalance } from "@/types/fibersave";
import { BalanceCard } from "./balance-card";
import { ConnectWalletButton } from "./connect-wallet-button";

const buildSteps = [
  "Project structure and decisions",
  "Wallet connection",
  "Balance display",
  "Savings goals",
  "Deposit and withdrawal flows",
  "Activity history",
];

export function FiberSaveDashboard() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshWalletState() {
    setError(null);
    setIsLoadingBalances(true);

    try {
      const nextAddress = await getConnectedAddress(signer);
      const nextBalances = await getAllBalances(signer);

      setAddress(nextAddress);
      setBalances(nextBalances);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load wallet state.");
      setAddress(null);
      setBalances(await getAllBalances());
    } finally {
      setIsLoadingBalances(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadWalletState() {
      setError(null);
      setIsLoadingBalances(true);

      try {
        const nextAddress = await getConnectedAddress(signer);
        const nextBalances = await getAllBalances(signer);

        if (isActive) {
          setAddress(nextAddress);
          setBalances(nextBalances);
        }
      } catch (err) {
        const fallbackBalances = await getAllBalances();

        if (isActive) {
          setError(err instanceof Error ? err.message : "Unable to load wallet state.");
          setAddress(null);
          setBalances(fallbackBalances);
        }
      } finally {
        if (isActive) {
          setIsLoadingBalances(false);
        }
      }
    }

    queueMicrotask(() => {
      void loadWalletState();
    });

    return () => {
      isActive = false;
    };
  }, [signer]);

  const totalLabel = useMemo(() => {
    const ckb = balances.find((balance) => balance.asset === "CKB");
    return ckb ? `${ckb.amount} ${ckb.symbol}` : "0 CKB";
  }, [balances]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#111827]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-[#17594a] text-white">
              <PiggyBank size={21} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold">FiberSave</p>
              <p className="text-sm text-[#6b6254]">CKB testnet MVP</p>
            </div>
          </div>
          <ConnectWalletButton address={address} />
        </header>

        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[#17594a]">
                Phase 2 wallet and balances
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Track wallet-controlled savings before adding goals.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#4b5563] sm:text-lg">
                FiberSave now has a wallet connection shell, CKB testnet balance
                loading, and a stable asset balance interface for RGB++ support.
              </p>
            </div>

            <div className="rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-[#6b6254]">Connected wallet</p>
                  <p className="mt-2 break-all text-base font-medium">
                    {address ?? "No wallet connected"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void refreshWalletState()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d9d2c4] px-4 text-sm font-medium text-[#374151]"
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  Refresh
                </button>
              </div>
              {error ? <p className="mt-4 text-sm text-[#b42318]">{error}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
                <Wallet className="mb-3 text-[#17594a]" size={22} />
                <p className="font-medium">Wallet first</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Existing wallet connection before embedded custody.
                </p>
              </div>
              <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
                <PiggyBank className="mb-3 text-[#17594a]" size={22} />
                <p className="font-medium">Goal metadata</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Savings goals track progress without locking funds.
                </p>
              </div>
              <div className="rounded-lg border border-[#d9d2c4] bg-white p-4">
                <Landmark className="mb-3 text-[#17594a]" size={22} />
                <p className="font-medium">CKB testnet</p>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Balance and transaction work starts on testnet.
                </p>
              </div>
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Balances</h2>
                <span className="text-sm text-[#6b6254]">
                  {isLoadingBalances ? "Loading..." : "Testnet view"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {balances.map((balance) => (
                  <BalanceCard key={balance.asset} balance={balance} />
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#6b6254]">Total visible balance</p>
              <p className="mt-2 text-3xl font-semibold">{totalLabel}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#17594a] px-3 text-sm font-medium text-white">
                  <ArrowDownLeft size={16} aria-hidden="true" />
                  Deposit
                </button>
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d9d2c4] px-3 text-sm font-medium text-[#374151]">
                  <ArrowUpRight size={16} aria-hidden="true" />
                  Withdraw
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">MVP Build Path</h2>
                <ArrowUpRight size={18} className="text-[#17594a]" />
              </div>
              <ol className="mt-5 space-y-4 text-sm">
                {buildSteps.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#edf7f3] text-xs font-semibold text-[#17594a]">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-[#374151]">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
