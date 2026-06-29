import { describe, expect, it } from "vitest";

import { createPaymentRequest, getNodeInfo, getPaymentStatus, sendPayment } from "./fiber-rpc";

describe("fiber rpc", () => {
  it("creates a deterministic mock payment request without a Fiber node", async () => {
    const request = await createPaymentRequest({
      amount: "1",
      asset: "CKB",
      description: "Family support",
      expirySeconds: 900,
    });

    expect(request.invoiceAddress).toContain("fibt1mock");
    expect(request.amount).toBe("1");
    expect(request.status).toBe("pending");
  });

  it("rejects unsupported Fiber remittance assets", async () => {
    await expect(
      createPaymentRequest({
        amount: "1",
        asset: "BTC",
        description: "BTC request",
        expirySeconds: 900,
      }),
    ).rejects.toThrow("supports CKB invoices only");
  });

  it("submits and checks mock payments", async () => {
    const sent = await sendPayment("fibt1mockinvoice");

    expect(sent.paymentHash).toMatch(/^0x/);
    expect(sent.status).toBe("pending");
    await expect(getPaymentStatus(sent.paymentHash)).resolves.toBe("pending");
  });

  it("reports mock node info when no Fiber node is configured", async () => {
    await expect(getNodeInfo()).resolves.toMatchObject({
      mode: "mock",
      network: "Fibt",
    });
  });
});
