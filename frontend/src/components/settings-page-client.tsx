"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { clearActivity } from "@/lib/activity-store";
import { clearGoals } from "@/lib/goal-store";
import { getConnectedAddress } from "@/lib/wallet";

export function SettingsPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [preferredCurrency, setPreferredCurrency] = useState("USD");
  const [status, setStatus] = useState<string | null>(null);

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

  async function clearLocalMetadata() {
    await clearGoals(address ?? undefined);
    await clearActivity(address ?? undefined);
    setStatus(address ? "Cleared local metadata for this wallet." : "Cleared all local metadata.");
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-[#111827] sm:px-8">
      <section className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-[#d9d2c4] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-[#17594a]">
            Settings
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Wallet and preferences</h1>
        </div>

        <div className="mt-6 grid gap-4">
          <section className="rounded-lg border border-[#d9d2c4] bg-white p-5">
            <h2 className="text-lg font-semibold">Connected wallet</h2>
            <p className="mt-2 break-all text-sm text-[#6b7280]">{address ?? "No wallet connected"}</p>
          </section>

          <section className="rounded-lg border border-[#d9d2c4] bg-white p-5">
            <h2 className="text-lg font-semibold">Display currency</h2>
            <select
              value={preferredCurrency}
              onChange={(event) => setPreferredCurrency(event.target.value)}
              className="mt-3 h-10 rounded-md border border-[#d9d2c4] bg-white px-3"
            >
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="CKB">CKB</option>
            </select>
          </section>

          <section className="rounded-lg border border-[#d9d2c4] bg-white p-5">
            <h2 className="text-lg font-semibold">Security boundary</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              FiberSave stores savings goals and activity metadata locally in this MVP. It does not store private keys and cannot move funds without wallet signing.
            </p>
          </section>

          <section className="rounded-lg border border-[#d9d2c4] bg-white p-5">
            <h2 className="text-lg font-semibold">Supported assets</h2>
            <p className="mt-2 text-sm text-[#6b7280]">CKB is active for the MVP. RGB_STABLE and BTC remain interface-ready placeholders until their integration paths are finalized.</p>
          </section>

          <section className="rounded-lg border border-[#d9d2c4] bg-white p-5">
            <h2 className="text-lg font-semibold">Development metadata</h2>
            <button
              type="button"
              onClick={() => void clearLocalMetadata()}
              className="mt-3 h-10 rounded-md border border-[#d9d2c4] px-4 text-sm font-medium text-[#374151]"
            >
              Clear Local Metadata
            </button>
            {status ? <p className="mt-3 text-sm text-[#17594a]">{status}</p> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
