import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const proof = await request.json();
    const { verification_level } = proof;
    const appId = process.env.WORLDCOIN_APP_ID!;
    const actionId = process.env.WORLDCOIN_ACTION_ID!;

    if (verification_level === "device") {
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Device verification accepted (no Orb required)",
        proof,
      });
    }


    const response = await fetch(
      `${process.env.WORLDCOIN_BASE_URL}/v2/verify/${appId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...proof, action: actionId }),
      }
    );

    const data = await response.json();

    if (response.ok && data.verified) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ success: false, data }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Worldcoin verify error:", err);
    return NextResponse.json(
      { error: err.message || "Worldcoin verification failed" },
      { status: 500 }
    );
  }
}
