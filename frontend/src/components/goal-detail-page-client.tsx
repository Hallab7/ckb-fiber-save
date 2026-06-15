"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Archive, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { assignFundsToGoal, removeFundsFromGoal } from "@/lib/goal-actions";
import { addActivity } from "@/lib/activity-store";
import { archiveGoal, getGoal } from "@/lib/goal-store";
import { formatAssetAmount, getGoalProgress } from "@/lib/format";
import { getConnectedAddress } from "@/lib/wallet";
import type { SavingsGoal } from "@/types/fibersave";
import { ConnectWalletButton } from "./connect-wallet-button";

interface GoalDetailPageClientProps {
  goalId: string;
}

export function GoalDetailPageClient({ goalId }: GoalDetailPageClientProps) {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [assignAmount, setAssignAmount] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function reloadGoal() {
    const nextAddress = await getConnectedAddress(signer);
    const nextGoal = await getGoal(goalId);

    setAddress(nextAddress);
    setGoal(nextGoal);
  }

  useEffect(() => {
    let isActive = true;

    async function loadGoal() {
      const nextAddress = await getConnectedAddress(signer);
      const nextGoal = await getGoal(goalId);

      if (isActive) {
        setAddress(nextAddress);
        setGoal(nextGoal);
      }
    }

    queueMicrotask(() => {
      void loadGoal();
    });

    return () => {
      isActive = false;
    };
  }, [goalId, signer]);

  async function onAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (!address || !goal) {
        throw new Error("Connect the goal owner wallet first.");
      }

      await assignFundsToGoal({
        ownerAddress: address,
        goalId: goal.id,
        asset: goal.asset,
        amount: assignAmount,
      });

      await addActivity({
        ownerAddress: address,
        type: "goal_assignment",
        asset: goal.asset,
        amount: assignAmount,
        status: "complete",
        description: `Assigned funds to ${goal.name}`,
      });

      setAssignAmount("");
      await reloadGoal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to assign funds.");
    }
  }

  async function onRemove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (!address || !goal) {
        throw new Error("Connect the goal owner wallet first.");
      }

      await removeFundsFromGoal({
        ownerAddress: address,
        goalId: goal.id,
        asset: goal.asset,
        amount: removeAmount,
      });

      await addActivity({
        ownerAddress: address,
        type: "goal_withdrawal",
        asset: goal.asset,
        amount: removeAmount,
        status: "complete",
        description: `Removed funds from ${goal.name}`,
      });

      setRemoveAmount("");
      await reloadGoal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove funds.");
    }
  }

  async function onArchive() {
    setError(null);

    try {
      if (!goal) {
        return;
      }

      await archiveGoal(goal.id);
      await reloadGoal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to archive goal.");
    }
  }

  const progress = goal ? getGoalProgress(goal.assignedAmount, goal.targetAmount) : 0;

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-[#111827] sm:px-8">
      <section className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <Link href="/goals" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        {!goal ? (
          <div className="mt-8 rounded-lg border border-[#d9d2c4] bg-white p-6">
            <h1 className="text-2xl font-semibold">Goal not found</h1>
            <p className="mt-2 text-[#6b7280]">
              This goal may not exist in local metadata for this browser.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-lg border border-[#d9d2c4] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-[#17594a]">
                    Goal detail
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold">{goal.name}</h1>
                  <p className="mt-2 text-[#6b7280]">
                    {formatAssetAmount(goal.assignedAmount, goal.asset)} assigned
                    toward {formatAssetAmount(goal.targetAmount, goal.asset)}
                  </p>
                </div>
                <span className="w-fit rounded-md bg-[#edf7f3] px-3 py-1 text-sm font-medium text-[#17594a]">
                  {goal.status}
                </span>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#ebe4d8]">
                <div
                  className="h-full rounded-full bg-[#17594a]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-[#6b6254]">{progress.toFixed(1)}% complete</p>
            </div>

            <div className="rounded-lg border border-[#d9d2c4] bg-white p-5">
              <h2 className="text-lg font-semibold">Assignment controls</h2>
              <p className="mt-2 text-sm text-[#6b7280]">
                These controls update goal metadata only. They do not lock,
                transfer, or spend wallet funds.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <form onSubmit={onAssign} className="rounded-md border border-[#e4dccd] p-4">
                  <label className="block">
                    <span className="text-sm font-medium">Assign amount</span>
                    <input
                      value={assignAmount}
                      onChange={(event) => setAssignAmount(event.target.value)}
                      className="mt-2 h-10 w-full rounded-md border border-[#d9d2c4] px-3 outline-none focus:border-[#17594a]"
                      inputMode="decimal"
                      placeholder="100"
                    />
                  </label>
                  <button className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-[#17594a] px-4 text-sm font-medium text-white">
                    <ArrowDownLeft size={16} aria-hidden="true" />
                    Assign
                  </button>
                </form>

                <form onSubmit={onRemove} className="rounded-md border border-[#e4dccd] p-4">
                  <label className="block">
                    <span className="text-sm font-medium">Remove amount</span>
                    <input
                      value={removeAmount}
                      onChange={(event) => setRemoveAmount(event.target.value)}
                      className="mt-2 h-10 w-full rounded-md border border-[#d9d2c4] px-3 outline-none focus:border-[#17594a]"
                      inputMode="decimal"
                      placeholder="50"
                    />
                  </label>
                  <button className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-[#d9d2c4] px-4 text-sm font-medium text-[#374151]">
                    <ArrowUpRight size={16} aria-hidden="true" />
                    Remove
                  </button>
                </form>
              </div>

              {error ? <p className="mt-4 text-sm text-[#b42318]">{error}</p> : null}
            </div>

            <button
              type="button"
              onClick={() => void onArchive()}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d9d2c4] bg-white px-4 text-sm font-medium text-[#374151]"
            >
              <Archive size={16} aria-hidden="true" />
              Archive Goal
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
