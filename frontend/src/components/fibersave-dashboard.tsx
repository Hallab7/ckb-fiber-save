"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  History,
  Menu,
  QrCode,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { getAllBalances } from "@/lib/balances";
import { formatBalanceAmount } from "@/lib/format";
import { listGoals } from "@/lib/goal-store";
import { getConnectedAddress } from "@/lib/wallet";
import type { AssetBalance, SavingsGoal } from "@/types/fibersave";
import { BalanceCard } from "./balance-card";
import { ConnectWalletButton } from "./connect-wallet-button";
import { CopyAddress } from "./copy-address";
import { GoalCard } from "./goal-card";

const metrics = [
  ["Custody model", "100%", "User controlled"],
  ["Settlement", "CKB", "Testnet active"],
  ["Payment rail", "Fiber", "Next milestone"],
  ["Goal records", "Local", "Private metadata"],
];

export function FiberSaveDashboard() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<AssetBalance[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshWalletState() {
    setError(null);
    setIsLoadingBalances(true);

    try {
      const nextAddress = await getConnectedAddress(signer);
      const nextBalances = await getAllBalances(signer);
      const nextGoals = nextAddress ? await listGoals(nextAddress) : [];
      setAddress(nextAddress);
      setBalances(nextBalances);
      setGoals(nextGoals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load wallet state.");
      setAddress(null);
      setBalances(await getAllBalances());
    } finally {
      setIsLoadingBalances(false);
    }
  }

  useEffect(() => {
    let active = true;

    queueMicrotask(async () => {
      try {
        const nextAddress = await getConnectedAddress(signer);
        const nextBalances = await getAllBalances(signer);
        const nextGoals = nextAddress ? await listGoals(nextAddress) : [];
        if (active) {
          setAddress(nextAddress);
          setBalances(nextBalances);
          setGoals(nextGoals);
          setIsLoadingBalances(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load wallet state.");
          setIsLoadingBalances(false);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [signer]);

  const ckbBalance = useMemo(
    () => balances.find((balance) => balance.asset === "CKB"),
    [balances],
  );
  const activeGoals = goals.filter((goal) => goal.status !== "archived");

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="fs-static-dark bg-black px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:px-8">
        CKB testnet active / Non-custodial savings infrastructure
      </div>

      <nav className="border-b border-[#e8e8e8]">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center px-4 sm:px-8">
          <Link href="/" className="text-xl font-semibold">
            FIBERSAVE
          </Link>
          <div className="ml-16 hidden items-center gap-10 text-sm font-medium lg:flex">
            <Link href="/goals">Goals</Link>
            <Link href="/deposit">Deposit</Link>
            <Link href="/withdraw">Transfer</Link>
            <Link href="/send">Send</Link>
            <Link href="/receive">Receive</Link>
            <Link href="/activity">Activity</Link>
          </div>
          <div className="ml-auto hidden sm:block">
            <ConnectWalletButton address={address} />
          </div>
          <Link
            href="/settings"
            aria-label="Open settings"
            className="ml-3 hidden size-12 items-center justify-center border border-[#e8e8e8] sm:inline-flex"
          >
            <Settings size={17} />
          </Link>
          <Link
            href="/goals"
            aria-label="Open navigation"
            className="ml-auto inline-flex size-12 items-center justify-center border border-black sm:hidden"
          >
            <Menu size={18} />
          </Link>
        </div>
      </nav>

      <section className="border-b border-[#e8e8e8]">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-12">
          <div className="px-4 py-16 sm:px-8 sm:py-20 lg:col-span-8 lg:border-r lg:border-[#e8e8e8] lg:py-24">
            <p className="fs-caption text-[#666666]">Personal treasury / CKB + Fiber</p>
            <h1 className="mt-8 max-w-5xl text-[48px] font-semibold leading-[0.94] sm:text-[72px] lg:text-[92px] xl:text-[106px]">
              SAVE WITH
              <br />
              FULL CONTROL.
            </h1>
            <div className="mt-10 flex max-w-3xl flex-col gap-8 border-t border-[#e8e8e8] pt-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-base leading-7 text-[#555555] sm:text-lg">
                A non-custodial financial command center for CKB savings goals,
                verified activity, deposits, and wallet-approved transfers.
              </p>
              <Link
                href="/goals/new"
                className="fs-action inline-flex shrink-0 items-center justify-center gap-3 bg-black text-white hover:bg-white hover:text-black"
              >
                Create goal <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <aside className="grid bg-[#fafafa] lg:col-span-4">
            <div className="border-b border-[#e8e8e8] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="fs-caption text-[#666666]">Account snapshot</span>
                <button
                  type="button"
                  onClick={() => void refreshWalletState()}
                  className="inline-flex size-10 items-center justify-center border border-[#d6d6d6] bg-white"
                  aria-label="Refresh wallet data"
                >
                  <RefreshCw size={15} className={isLoadingBalances ? "animate-spin" : ""} />
                </button>
              </div>
              <p
                className="mt-10 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(2.75rem,7vw,4rem)] font-semibold"
                title={ckbBalance?.amount ?? "0"}
              >
                {formatBalanceAmount(ckbBalance?.amount ?? "0")}
              </p>
              <p className="mt-2 fs-caption">CKB available</p>
            </div>
            <div className="grid grid-cols-2">
              <div className="border-r border-[#e8e8e8] p-6 sm:p-8">
                <p className="fs-caption text-[#666666]">Active goals</p>
                <p className="mt-5 text-4xl font-semibold">
                  {activeGoals.length.toString().padStart(2, "0")}
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <p className="fs-caption text-[#666666]">Network</p>
                <p className="mt-5 text-lg font-semibold">TESTNET</p>
                <p className="mt-2 text-xs text-[#666666]">Operational</p>
              </div>
            </div>
            <div className="border-t border-[#e8e8e8] p-6 sm:p-8">
              <p className="fs-caption text-[#666666]">Connected identity</p>
              <div className="mt-4">
                <CopyAddress address={address} />
              </div>
              {error ? <p className="mt-4 text-xs text-[#555555]">{error}</p> : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-[#e8e8e8]">
        <div className="mx-auto grid max-w-[1600px] sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value, detail], index) => (
            <div
              key={label}
              className={`min-h-44 p-6 sm:p-8 ${
                index < metrics.length - 1 ? "border-b border-[#e8e8e8] sm:border-r lg:border-b-0" : ""
              }`}
            >
              <p className="fs-caption text-[#666666]">{label}</p>
              <p className="mt-8 text-4xl font-semibold sm:text-5xl">
                {value}
              </p>
              <p className="mt-3 text-sm text-[#666666]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] border-x border-[#e8e8e8]">
        <div className="grid lg:grid-cols-12">
          <div className="p-6 sm:p-8 lg:col-span-7 lg:border-r lg:border-[#e8e8e8]">
            <div className="flex items-end justify-between border-b border-[#e8e8e8] pb-6">
              <div>
                <p className="fs-caption text-[#666666]">Portfolio allocation</p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Asset balances
                </h2>
              </div>
              <span className="fs-caption text-[#666666]">Live wallet data</span>
            </div>
            <div className="mt-6 grid sm:grid-cols-2">
              {balances.map((balance) => (
                <BalanceCard key={balance.asset} balance={balance} />
              ))}
            </div>
            <div className="mt-8 flex h-36 items-end border border-[#e8e8e8] bg-[#fafafa] px-5">
              {[20, 32, 25, 48, 42, 61, 57, 78, 72, 88, 82, 100].map((height, index) => (
                <div
                  key={index}
                  className="fs-dark-chart-line flex-1 border-l border-black"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border-b border-[#e8e8e8] p-6 sm:p-8">
              <p className="fs-caption text-[#666666]">Financial commands</p>
              <div className="mt-6 grid grid-cols-2">
                <Link href="/deposit" className="fs-action inline-flex items-center gap-3 bg-black text-white hover:bg-white hover:text-black">
                  <ArrowDownLeft size={16} /> Deposit
                </Link>
                <Link href="/withdraw" className="fs-action inline-flex items-center gap-3 bg-white text-black">
                  <ArrowUpRight size={16} /> Transfer
                </Link>
                <Link href="/send" className="fs-action inline-flex items-center gap-3 bg-white text-black">
                  <Send size={16} /> Send
                </Link>
                <Link href="/receive" className="fs-action inline-flex items-center gap-3 bg-white text-black">
                  <QrCode size={16} /> Receive
                </Link>
                <Link href="/activity" className="fs-action inline-flex items-center gap-3 bg-white text-black">
                  <History size={16} /> Activity
                </Link>
                <Link href="/settings" className="fs-action inline-flex items-center gap-3 bg-white text-black">
                  <Settings size={16} /> Settings
                </Link>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="fs-caption text-[#666666]">Security status</p>
                <ShieldCheck size={18} />
              </div>
              {[
                ["Private keys", "Wallet controlled"],
                ["Transfers", "Explicit approval"],
                ["Goal records", "Local metadata"],
                ["Custody exposure", "None"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-[#e8e8e8] py-5 text-sm">
                  <span className="text-[#666666]">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="border-t border-[#e8e8e8] p-6 sm:p-8">
          <div className="flex items-end justify-between gap-6 border-b border-[#e8e8e8] pb-6">
            <div>
              <p className="fs-caption text-[#666666]">Savings ledger</p>
              <h2 className="mt-3 text-3xl font-semibold">Active goals</h2>
            </div>
            <Link href="/goals/new" className="fs-caption inline-flex items-center gap-2">
              New goal <ArrowRight size={14} />
            </Link>
          </div>
          {address && activeGoals.length > 0 ? (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3">
              {activeGoals.slice(0, 6).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="mt-6 min-h-48 border border-dashed border-[#d6d6d6] p-8">
              <p className="fs-caption text-[#666666]">No active positions</p>
              <p className="mt-6 max-w-md text-2xl font-semibold">
                {address
                  ? "Create a financial target and start tracking progress."
                  : "Connect a wallet to activate your personal savings ledger."}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="fs-static-dark border-t border-black bg-black text-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="fs-caption text-[#999999]">FiberSave / Nervos CKB</p>
            <p className="mt-4 text-3xl font-semibold">
              CONTROL YOUR SAVINGS.
            </p>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#999999]">
            Non-custodial infrastructure for goal-based savings and future Fiber
            remittance.
          </p>
        </div>
      </footer>
    </main>
  );
}
