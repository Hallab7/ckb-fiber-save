import { NextResponse } from "next/server";

import { sendPayment } from "@/lib/fiber-rpc";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      invoiceAddress?: string;
    };

    return NextResponse.json(await sendPayment(body.invoiceAddress ?? ""));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send Fiber payment." },
      { status: 400 },
    );
  }
}
