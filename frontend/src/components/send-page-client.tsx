"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Send, Wallet } from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { addActivity, updateActivityStatus } from "@/lib/activity-store";
import { getConnectedAddress } from "@/lib/wallet";
import type { FiberPaymentStatus } from "@/types/fibersave";

type SendPaymentResponse = {
  paymentHash: string;
  status: FiberPaymentStatus;
  error?: string;
};

function toActivityStatus(status: FiberPaymentStatus) {
  if (status === "paid") return "complete";
  return status;
}

export function SendPageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentHash, setPaymentHash] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(async () => {
      const nextAddress = await getConnectedAddress(signer);
      if (isActive) setAddress(nextAddress);
    });

    return () => {
      isActive = false;
    };
  }, [signer]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setPaymentHash(null);
    setIsSubmitting(true);

    try {
      if (!address) {
        throw new Error("Connect a wallet before sending a Fiber payment.");
      }

      const response = await fetch("/api/send-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceAddress }),
      });
      const payload = (await response.json()) as SendPaymentResponse;

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to send Fiber payment.");
      }

      setPaymentHash(payload.paymentHash);
      setStatus(
        payload.status === "paid"
          ? "Fiber payment completed."
          : "Fiber payment submitted. Status is pending.",
      );

      const activity = await addActivity({
        ownerAddress: address,
        type: "remittance",
        asset: "CKB",
        status: toActivityStatus(payload.status),
        txHash: payload.paymentHash,
        description: note.trim()
          ? `Sent Fiber payment: ${note.trim()}`
          : "Sent Fiber payment",
      });

      if (payload.status === "pending") {
        window.setTimeout(async () => {
          try {
            const nextResponse = await fetch(`/api/payment-request/${payload.paymentHash}`);
            const nextPayload = (await nextResponse.json()) as {
              status?: FiberPaymentStatus;
            };

            if (nextPayload.status && nextPayload.status !== "pending") {
              await updateActivityStatus(
                activity.id,
                toActivityStatus(nextPayload.status),
                payload.paymentHash,
              );
            }
          } catch {
            // Keep pending status until the user refreshes Activity.
          }
        }, 5_000);
      }

      setInvoiceAddress("");
      setNote("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send Fiber payment.";
      setError(message);

      if (address) {
        await addActivity({
          ownerAddress: address,
          type: "remittance",
          asset: "CKB",
          status: "failed",
          description: `Fiber payment failed: ${message}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-black sm:px-8">
      <section className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-[#e8e8e8] pb-5">
          <Link href="/" className="text-lg font-semibold">
            FiberSave
          </Link>
          <ConnectWalletButton address={address} />
        </header>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-black">
            Fiber remittance
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Send payment</h1>
          <p className="mt-2 text-[#666666]">
            Pay a CKB Fiber invoice through the configured server-side Fiber node.
          </p>
        </div>

        {!address ? (
          <div className="mt-6 rounded-lg border border-dashed border-[#d6d6d6] bg-white p-5">
            <Wallet className="text-black" size={28} />
            <p className="mt-3 font-medium">Connect wallet to record remittance activity.</p>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 rounded-lg border border-[#e8e8e8] bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium">Fiber invoice</span>
            <textarea
              value={invoiceAddress}
              onChange={(event) => setInvoiceAddress(event.target.value)}
              className="mt-2 min-h-32 w-full resize-y rounded-md border border-[#e8e8e8] px-3 py-2 outline-none focus:border-black"
              placeholder="fibt..."
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium">Note</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] px-3 outline-none focus:border-black"
              placeholder="Optional"
            />
          </label>

          {error ? <p className="mt-4 text-sm text-[#b42318]">{error}</p> : null}
          {status ? <p className="mt-4 text-sm text-black">{status}</p> : null}
          {paymentHash ? (
            <p className="mt-2 break-all text-sm text-[#666666]">Payment hash: {paymentHash}</p>
          ) : null}

          <button
            disabled={isSubmitting}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-black px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} aria-hidden="true" />
            {isSubmitting ? "Sending..." : "Send Fiber Payment"}
          </button>
        </form>
      </section>
    </main>
  );
}
