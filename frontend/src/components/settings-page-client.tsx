"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { CopyAddress } from "@/components/copy-address";
import { clearActivity } from "@/lib/activity-store";
import { clearDepositSnapshots } from "@/lib/deposit-tracker";
import { clearGoals } from "@/lib/goal-store";
import {
  clearPreferences,
  getPreferredCurrency,
  setPreferredCurrency as savePreferredCurrency,
} from "@/lib/preferences";
import { getConnectedAddress } from "@/lib/wallet";
import type { WalletProfile } from "@/types/fibersave";

export function SettingsPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [preferredCurrency, setPreferredCurrency] =
    useState<WalletProfile["preferredCurrency"]>("USD");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAddress() {
      const nextAddress = await getConnectedAddress(signer);

      if (isActive) {
        setAddress(nextAddress);
        setPreferredCurrency(getPreferredCurrency(nextAddress));
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
    clearDepositSnapshots(address ?? undefined);
    clearPreferences(address ?? undefined);
    setPreferredCurrency("USD");
    setStatus(address ? "Cleared local metadata for this wallet." : "Cleared all local metadata.");
  }

  function updatePreferredCurrency(currency: WalletProfile["preferredCurrency"]) {
    setPreferredCurrency(currency);
    savePreferredCurrency(currency, address);
    setStatus("Display currency preference saved.");
  }

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-black sm:px-8">
      <section className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-[#e8e8e8] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-black">
            Settings
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Wallet and preferences</h1>
        </div>

        <div className="mt-6 grid gap-4">
          <section className="rounded-lg border border-[#e8e8e8] bg-white p-5">
            <h2 className="text-lg font-semibold">Connected wallet</h2>
            <div className="mt-4 max-w-xl">
              <CopyAddress address={address} emptyLabel="No wallet connected" />
            </div>
          </section>

          <section className="rounded-lg border border-[#e8e8e8] bg-white p-5">
            <h2 className="text-lg font-semibold">Display currency</h2>
            <select
              value={preferredCurrency}
              onChange={(event) =>
                updatePreferredCurrency(
                  event.target.value as WalletProfile["preferredCurrency"],
                )
              }
              className="mt-3 h-10 rounded-md border border-[#e8e8e8] bg-white px-3"
            >
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="CKB">CKB</option>
            </select>
          </section>

          <section className="rounded-lg border border-[#e8e8e8] bg-white p-5">
            <h2 className="text-lg font-semibold">Security boundary</h2>
            <p className="mt-2 text-sm leading-6 text-[#666666]">
              FiberSave stores savings goals and activity metadata locally in this MVP. It does not store private keys and cannot move funds without wallet signing.
            </p>
          </section>

          <section className="rounded-lg border border-[#e8e8e8] bg-white p-5">
            <h2 className="text-lg font-semibold">Supported assets</h2>
            <p className="mt-2 text-sm text-[#666666]">CKB is active for the MVP. RGB_STABLE and BTC remain interface-ready placeholders until their integration paths are finalized.</p>
          </section>

          <section className="rounded-lg border border-[#e8e8e8] bg-white p-5">
            <h2 className="text-lg font-semibold">Development metadata</h2>
            <button
              type="button"
              onClick={() => void clearLocalMetadata()}
              className="mt-3 h-10 rounded-md border border-[#e8e8e8] px-4 text-sm font-medium text-[#222222]"
            >
              Clear Local Metadata
            </button>
            {status ? <p className="mt-3 text-sm text-black">{status}</p> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
