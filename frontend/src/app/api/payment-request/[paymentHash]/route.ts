import { NextResponse } from "next/server";

import { getInvoiceStatus, getPaymentStatus } from "@/lib/fiber-rpc";

type RouteContext = {
  params: Promise<{
    paymentHash: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { paymentHash } = await context.params;
    const [invoiceStatus, paymentStatus] = await Promise.all([
      getInvoiceStatus(paymentHash),
      getPaymentStatus(paymentHash).catch(() => "pending" as const),
    ]);

    return NextResponse.json({
      paymentHash,
      status: paymentStatus === "paid" ? paymentStatus : invoiceStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch payment status." },
      { status: 400 },
    );
  }
}
