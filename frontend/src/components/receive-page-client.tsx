"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { Copy, RefreshCw } from "lucide-react";
import { useSigner } from "@ckb-ccc/connector-react";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { addActivity, updateActivityStatus } from "@/lib/activity-store";
import { getConnectedAddress } from "@/lib/wallet";
import type { FiberPaymentRequest, FiberPaymentStatus } from "@/types/fibersave";

type PaymentRequestResponse = FiberPaymentRequest & {
  error?: string;
};

function toActivityStatus(status: FiberPaymentStatus) {
  if (status === "paid") return "complete";
  return status;
}

export function ReceivePageClient() {
  const signer = useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expirySeconds, setExpirySeconds] = useState("3600");
  const [paymentRequest, setPaymentRequest] = useState<FiberPaymentRequest | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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

  async function createRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      if (!address) {
        throw new Error("Connect a wallet before creating a Fiber payment request.");
      }

      const response = await fetch("/api/payment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          asset: "CKB",
          description,
          expirySeconds: Number(expirySeconds),
        }),
      });
      const payload = (await response.json()) as PaymentRequestResponse;

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to create payment request.");
      }

      setPaymentRequest(payload);
      setQrCode(await QRCode.toDataURL(payload.invoiceAddress, { margin: 1, width: 220 }));
      setStatusMessage("Payment request created.");

      const activity = await addActivity({
        ownerAddress: address,
        type: "remittance",
        asset: "CKB",
        amount: payload.amount,
        status: "pending",
        txHash: payload.paymentHash,
        description: payload.description
          ? `Created Fiber payment request: ${payload.description}`
          : "Created Fiber payment request",
      });

      setActivityId(activity.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create payment request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function checkStatus() {
    if (!paymentRequest) return;

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`/api/payment-request/${paymentRequest.paymentHash}`);
      const payload = (await response.json()) as {
        status?: FiberPaymentStatus;
        error?: string;
      };

      if (!response.ok || payload.error || !payload.status) {
        throw new Error(payload.error ?? "Unable to fetch payment status.");
      }

      setPaymentRequest({ ...paymentRequest, status: payload.status });
      setStatusMessage(`Payment status: ${payload.status}.`);

      if (activityId) {
        await updateActivityStatus(
          activityId,
          toActivityStatus(payload.status),
          paymentRequest.paymentHash,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch payment status.");
    } finally {
      setIsChecking(false);
    }
  }

  async function copyInvoice() {
    if (!paymentRequest) return;

    await navigator.clipboard.writeText(paymentRequest.invoiceAddress);
    setStatusMessage("Fiber invoice copied.");
  }

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-black sm:px-8">
      <section className="mx-auto max-w-5xl">
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
          <h1 className="mt-2 text-3xl font-semibold">Receive payment</h1>
          <p className="mt-2 text-[#666666]">
            Generate a CKB Fiber invoice and share it as text or QR code.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <form onSubmit={createRequest} className="rounded-lg border border-[#e8e8e8] bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Amount</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] px-3 outline-none focus:border-black"
                  inputMode="decimal"
                  placeholder="1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Expiry</span>
                <select
                  value={expirySeconds}
                  onChange={(event) => setExpirySeconds(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] bg-white px-3 outline-none focus:border-black"
                >
                  <option value="900">15 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="86400">24 hours</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium">Description</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-[#e8e8e8] px-3 outline-none focus:border-black"
                placeholder="Family support"
              />
            </label>

            {error ? <p className="mt-4 text-sm text-[#b42318]">{error}</p> : null}
            {statusMessage ? <p className="mt-4 text-sm text-black">{statusMessage}</p> : null}

            <button
              disabled={isSubmitting}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-black px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Payment Request"}
            </button>
          </form>

          <aside className="rounded-lg border border-[#e8e8e8] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Invoice</h2>
            {paymentRequest ? (
              <div className="mt-4">
                <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-[#e8e8e8] bg-[#fafafa] p-4">
                  {qrCode ? (
                    <Image src={qrCode} alt="Fiber invoice QR code" width={220} height={220} />
                  ) : null}
                </div>
                <p className="mt-4 break-all text-sm text-[#666666]">
                  {paymentRequest.invoiceAddress}
                </p>
                <p className="mt-3 text-sm font-medium">Status: {paymentRequest.status}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void copyInvoice()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#e8e8e8] px-4 text-sm font-medium"
                  >
                    <Copy size={15} aria-hidden="true" />
                    Copy Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => void checkStatus()}
                    disabled={isChecking}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#e8e8e8] px-4 text-sm font-medium disabled:opacity-60"
                  >
                    <RefreshCw size={15} className={isChecking ? "animate-spin" : ""} />
                    Check
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#666666]">
                Create a request to display its invoice and QR code.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
