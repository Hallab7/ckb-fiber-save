"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { createGoal } from "@/lib/goal-store";
import { addActivity } from "@/lib/activity-store";
import { parseAssetAmount } from "@/lib/format";
import { getConnectedAddress } from "@/lib/wallet";
import type { AssetType } from "@/types/fibersave";

const assetOptions: AssetType[] = ["CKB", "RGB_STABLE", "BTC"];

export function NewGoalPageClient() {
  const router = useRouter();
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [asset, setAsset] = useState<AssetType>("CKB");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
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

    try {
      if (!address) {
        throw new Error("Connect a wallet before creating a goal.");
      }

      if (!name.trim()) {
        throw new Error("Goal name is required.");
      }

      parseAssetAmount(targetAmount);

      if (targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(targetDate) < today) {
          throw new Error("Target date cannot be in the past.");
        }
      }

      const goal = await createGoal({
        ownerAddress: address,
        name,
        asset,
        targetAmount,
        targetDate,
      });

      await addActivity({
        ownerAddress: address,
        type: "goal_created",
        asset,
        amount: targetAmount,
        status: "complete",
        description: `Created savings goal: ${goal.name}`,
      });

      router.push(`/goals/${goal.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create goal.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-black sm:px-8">
      <section className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-[#e8e8e8] pb-5">
          <Link href="/goals" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-black">
            Create goal
          </p>
          <h1 className="mt-2 text-3xl font-semibold">New savings goal</h1>
        </div>

        <form onSubmit={onSubmit} className="mt-6 rounded-lg border border-[#e8e8e8] bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium">Goal name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] px-3 outline-none focus:border-black"
              placeholder="School fees"
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Asset</span>
              <select
                value={asset}
                onChange={(event) => setAsset(event.target.value as AssetType)}
                className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] bg-white px-3 outline-none focus:border-black"
              >
                {assetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Target amount</span>
              <input
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] px-3 outline-none focus:border-black"
                inputMode="decimal"
                placeholder="1000"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium">Target date</span>
            <input
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] px-3 outline-none focus:border-black"
              type="date"
            />
          </label>

          {error ? <p className="mt-4 text-sm text-[#b42318]">{error}</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-black px-5 text-sm font-medium text-white"
            >
              Create Goal
            </button>
            <Link
              href="/goals"
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#e8e8e8] px-5 text-sm font-medium text-[#222222]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
