"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { listActivity } from "@/lib/activity-store";
import { formatAssetAmount } from "@/lib/format";
import { getConnectedAddress } from "@/lib/wallet";
import type { ActivityEvent } from "@/types/fibersave";

type ActivityFilter = "all" | "deposits" | "withdrawals" | "goals" | "pending";

const filters: ActivityFilter[] = ["all", "deposits", "withdrawals", "goals", "pending"];

export function ActivityPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<ActivityFilter>("all");

  useEffect(() => {
    let isActive = true;

    async function loadActivity() {
      const nextAddress = await getConnectedAddress(signer);
      const nextEvents = nextAddress ? await listActivity(nextAddress) : [];

      if (isActive) {
        setAddress(nextAddress);
        setEvents(nextEvents);
      }
    }

    queueMicrotask(() => {
      void loadActivity();
    });

    return () => {
      isActive = false;
    };
  }, [signer]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filter === "all") return true;
      if (filter === "deposits") return event.type === "deposit";
      if (filter === "withdrawals") return event.type === "withdrawal";
      if (filter === "goals") return event.type.startsWith("goal_");
      if (filter === "pending") return event.status === "pending";
      return true;
    });
  }, [events, filter]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-[#111827] sm:px-8">
      <section className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-[#17594a]">
            Activity
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Wallet activity</h1>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`h-9 rounded-md px-3 text-sm font-medium ${
                filter === item
                  ? "bg-[#17594a] text-white"
                  : "border border-[#d9d2c4] bg-white text-[#374151]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-[#d9d2c4] bg-white shadow-sm">
          {filteredEvents.length === 0 ? (
            <div className="p-6 text-[#6b7280]">No activity to show.</div>
          ) : (
            <ul className="divide-y divide-[#ece5d8]">
              {filteredEvents.map((event) => (
                <li key={event.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="mt-1 text-sm text-[#6b7280]">
                      {event.amount ? formatAssetAmount(event.amount, event.asset) : event.asset} - {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="h-fit w-fit rounded-md bg-[#edf7f3] px-2 py-1 text-xs font-medium text-[#17594a]">
                    {event.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
