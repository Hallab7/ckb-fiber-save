"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Wallet } from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { GoalCard } from "@/components/goal-card";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { listGoals } from "@/lib/goal-store";
import { getConnectedAddress } from "@/lib/wallet";
import type { SavingsGoal } from "@/types/fibersave";

export function GoalsPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadGoals() {
      const nextAddress = await getConnectedAddress(signer);
      const nextGoals = nextAddress ? await listGoals(nextAddress) : [];

      if (isActive) {
        setAddress(nextAddress);
        setGoals(nextGoals);
        setIsLoading(false);
      }
    }

    queueMicrotask(() => {
      void loadGoals();
    });

    return () => {
      isActive = false;
    };
  }, [signer]);

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-black sm:px-8">
      <section className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-[#e8e8e8] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-black">
              Savings goals
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Goal tracker</h1>
            <p className="mt-2 max-w-2xl text-[#555555]">
              Goals are metadata linked to your wallet address. Funds remain in
              your wallet until a later on-chain locking model is designed.
            </p>
          </div>
          <Link
            href="/goals/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-medium text-white"
          >
            <Plus size={16} aria-hidden="true" />
            New Goal
          </Link>
        </div>

        {!address ? (
          <div className="mt-8 rounded-lg border border-[#e8e8e8] bg-white p-6">
            <Wallet className="text-black" size={28} />
            <h2 className="mt-4 text-xl font-semibold">Connect a wallet</h2>
            <p className="mt-2 text-[#666666]">
              FiberSave stores goals by wallet address, so connect first to view
              or create your savings goals.
            </p>
          </div>
        ) : null}

        {address && isLoading ? (
          <p className="mt-8 text-sm text-[#666666]">Loading goals...</p>
        ) : null}

        {address && !isLoading && goals.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-[#d6d6d6] bg-white p-6">
            <h2 className="text-xl font-semibold">No goals yet</h2>
            <p className="mt-2 text-[#666666]">
              Create your first goal for rent, school fees, emergency savings,
              or family support.
            </p>
          </div>
        ) : null}

        {goals.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
