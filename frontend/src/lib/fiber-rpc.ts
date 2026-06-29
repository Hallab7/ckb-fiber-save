import { randomBytes } from "node:crypto";

import type { AssetType, FiberPaymentRequest, FiberPaymentStatus } from "@/types/fibersave";

import { formatUnits, parseAssetAmount } from "./format";

type JsonRpcResponse<T> = {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

type FiberInvoiceResponse = {
  invoice_address: string;
  invoice: {
    amount?: string;
    data?: {
      payment_hash?: string;
    };
  };
  status?: string;
};

type FiberPaymentResponse = {
  payment_hash: string;
  status: string;
  failed_error?: string | null;
};

type PaymentRequestInput = {
  amount: string;
  asset: AssetType;
  description: string;
  expirySeconds: number;
};

const DEFAULT_EXPIRY_SECONDS = 3_600;

function getFiberRpcUrl(role: "send" | "receive" | "default" = "default") {
  if (role === "send") {
    return process.env.FIBER_SEND_RPC_URL?.trim() || process.env.FIBER_RPC_URL?.trim() || null;
  }

  if (role === "receive") {
    return process.env.FIBER_RECEIVE_RPC_URL?.trim() || process.env.FIBER_RPC_URL?.trim() || null;
  }

  return process.env.FIBER_RPC_URL?.trim() || null;
}

function toFiberCurrency() {
  const network = process.env.NEXT_PUBLIC_CKB_NETWORK?.toLowerCase();

  if (network === "mainnet") return "Fibb";
  if (network === "devnet") return "Fibd";
  return "Fibt";
}

function toHexQuantity(value: bigint | number) {
  return `0x${BigInt(value).toString(16)}`;
}

function assertCkbAsset(asset: AssetType) {
  if (asset !== "CKB") {
    throw new Error("Phase 6 Fiber remittance currently supports CKB invoices only.");
  }
}

async function callFiberRpc<T>(
  method: string,
  params: Record<string, unknown>,
  role: "send" | "receive" | "default" = "default",
) {
  const url = getFiberRpcUrl(role);

  if (!url) {
    throw new Error("FIBER_RPC_URL is not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: Date.now(),
      jsonrpc: "2.0",
      method,
      params: [params],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Fiber RPC request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as JsonRpcResponse<T>;

  if (payload.error) {
    throw new Error(payload.error.message);
  }

  if (!payload.result) {
    throw new Error("Fiber RPC returned an empty result.");
  }

  return payload.result;
}

function mockPaymentHash(seed: string) {
  const bytes = Buffer.from(seed).toString("hex").padEnd(64, "0").slice(0, 64);
  return `0x${bytes}`;
}

function mockInvoiceAddress(paymentHash: string, amount: string) {
  return `${toFiberCurrency().toLowerCase()}1mock${amount.replace(".", "p")}${paymentHash.slice(2, 18)}`;
}

function normalizeInvoiceStatus(status?: string): FiberPaymentStatus {
  if (status === "Paid") return "paid";
  if (status === "Expired" || status === "Cancelled") return "expired";
  if (status === "Received" || status === "Open") return "pending";
  return "pending";
}

function normalizePaymentStatus(status?: string): FiberPaymentStatus {
  if (status === "Success") return "paid";
  if (status === "Failed") return "failed";
  return "pending";
}

export async function createPaymentRequest(
  input: PaymentRequestInput,
): Promise<FiberPaymentRequest> {
  assertCkbAsset(input.asset);

  const amountShannons = parseAssetAmount(input.amount);
  const expirySeconds = input.expirySeconds || DEFAULT_EXPIRY_SECONDS;
  const expiresAt = Date.now() + expirySeconds * 1_000;

  if (!getFiberRpcUrl("receive")) {
    const paymentHash = mockPaymentHash(`${input.amount}:${input.description}:${expiresAt}`);

    return {
      paymentHash,
      invoiceAddress: mockInvoiceAddress(paymentHash, input.amount),
      amount: formatUnits(amountShannons),
      asset: input.asset,
      description: input.description.trim(),
      expiresAt,
      status: "pending",
    };
  }

  const paymentPreimage = `0x${randomBytes(32).toString("hex")}`;
  const result = await callFiberRpc<FiberInvoiceResponse>("new_invoice", {
    amount: toHexQuantity(amountShannons),
    currency: toFiberCurrency(),
    description: input.description.trim() || "FiberSave payment request",
    expiry: toHexQuantity(expirySeconds),
    payment_preimage: paymentPreimage,
    hash_algorithm: "sha256",
  }, "receive");
  const paymentHash = result.invoice.data?.payment_hash;

  if (!paymentHash) {
    throw new Error("Fiber invoice response did not include a payment hash.");
  }

  return {
    paymentHash,
    invoiceAddress: result.invoice_address,
    amount: formatUnits(amountShannons),
    asset: input.asset,
    description: input.description.trim(),
    expiresAt,
    status: normalizeInvoiceStatus(result.status),
  };
}

export async function getNodeInfo(): Promise<unknown> {
  if (!getFiberRpcUrl()) {
    return {
      mode: "mock",
      network: toFiberCurrency(),
      pubkey: process.env.FIBER_NODE_PUBKEY ?? null,
    };
  }

  return callFiberRpc<unknown>("node_info", {});
}

export async function getPaymentStatus(paymentHash: string): Promise<FiberPaymentStatus> {
  if (!paymentHash.trim()) {
    throw new Error("Payment hash is required.");
  }

  if (!getFiberRpcUrl("send")) {
    return "pending";
  }

  const result = await callFiberRpc<FiberPaymentResponse>("get_payment", {
    payment_hash: paymentHash.trim(),
  }, "send");

  return normalizePaymentStatus(result.status);
}

export async function getInvoiceStatus(paymentHash: string): Promise<FiberPaymentStatus> {
  if (!paymentHash.trim()) {
    throw new Error("Payment hash is required.");
  }

  if (!getFiberRpcUrl("receive")) {
    return "pending";
  }

  const result = await callFiberRpc<FiberInvoiceResponse>("get_invoice", {
    payment_hash: paymentHash.trim(),
  }, "receive");

  return normalizeInvoiceStatus(result.status);
}

export async function sendPayment(invoiceAddress: string): Promise<{
  paymentHash: string;
  status: FiberPaymentStatus;
}> {
  const invoice = invoiceAddress.trim();

  if (!invoice) {
    throw new Error("Fiber invoice is required.");
  }

  if (!getFiberRpcUrl("send")) {
    const paymentHash = mockPaymentHash(invoice);
    return { paymentHash, status: "pending" };
  }

  const result = await callFiberRpc<FiberPaymentResponse>("send_payment", {
    invoice,
  }, "send");

  return {
    paymentHash: result.payment_hash,
    status: normalizePaymentStatus(result.status),
  };
}
