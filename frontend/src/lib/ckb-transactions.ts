import { ccc } from "@ckb-ccc/core";

import { parseAssetAmount } from "./format";

const DEFAULT_CONFIRMATION_TIMEOUT_MS = 120_000;

export type CkbTransactionState = "pending" | "complete" | "failed";

export async function validateCkbTransfer(
  signer: ccc.Signer,
  recipient: string,
  amount: string,
) {
  const recipientAddress = await ccc.Address.fromString(recipient.trim(), signer.client);
  const amountShannons = parseAssetAmount(amount);
  const balance = await signer.getBalance();
  const output = ccc.CellOutput.from({
    lock: recipientAddress.script,
    capacity: amountShannons,
  });
  const minimumCapacity = ccc.fixedPointFrom(output.occupiedSize);

  if (amountShannons < minimumCapacity) {
    throw new Error(
      `CKB transfers to this address require at least ${ccc.fixedPointToString(minimumCapacity)} CKB.`,
    );
  }

  if (amountShannons >= balance) {
    throw new Error("Amount must leave enough CKB in the wallet to pay the network fee.");
  }

  return {
    amountShannons,
    recipientAddress,
  };
}

export async function sendCkbTransfer(
  signer: ccc.Signer,
  recipient: string,
  amount: string,
) {
  const { amountShannons, recipientAddress } = await validateCkbTransfer(
    signer,
    recipient,
    amount,
  );
  const transaction = ccc.Transaction.from({
    outputs: [
      {
        lock: recipientAddress.script,
        capacity: amountShannons,
      },
    ],
  });

  await transaction.completeInputsByCapacity(signer);
  await transaction.completeFeeBy(signer);

  return signer.sendTransaction(transaction);
}

export async function getCkbTransactionState(
  signer: ccc.Signer,
  txHash: string,
): Promise<CkbTransactionState> {
  const response = await signer.client.getTransaction(txHash);

  if (response?.status === "committed") {
    return "complete";
  }

  if (response?.status === "rejected") {
    return "failed";
  }

  return "pending";
}

export async function waitForCkbTransaction(
  signer: ccc.Signer,
  txHash: string,
  timeout = DEFAULT_CONFIRMATION_TIMEOUT_MS,
): Promise<CkbTransactionState> {
  try {
    const response = await signer.client.waitTransaction(txHash, 0, timeout);
    return response?.status === "committed" ? "complete" : "failed";
  } catch {
    return getCkbTransactionState(signer, txHash);
  }
}

export function getCkbExplorerTransactionUrl(txHash: string) {
  const network = process.env.NEXT_PUBLIC_CKB_NETWORK?.toLowerCase();
  const baseUrl =
    network === "mainnet"
      ? "https://explorer.nervos.org"
      : "https://pudge.explorer.nervos.org";

  return `${baseUrl}/transaction/${txHash}`;
}
