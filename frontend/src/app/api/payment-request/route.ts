import { NextResponse } from "next/server";

import { createPaymentRequest } from "@/lib/fiber-rpc";
import type { AssetType } from "@/types/fibersave";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      amount?: string;
      asset?: AssetType;
      description?: string;
      expirySeconds?: number;
    };
    const paymentRequest = await createPaymentRequest({
      amount: body.amount ?? "",
      asset: body.asset ?? "CKB",
      description: body.description ?? "",
      expirySeconds: body.expirySeconds ?? 3_600,
    });

    return NextResponse.json(paymentRequest);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create payment request." },
      { status: 400 },
    );
  }
}
