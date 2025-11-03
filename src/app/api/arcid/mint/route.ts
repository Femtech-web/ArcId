import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, email, country } = body;

    if (!address || !email || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simulate minting delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock IPFS hash
    const mockIPFSHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    return NextResponse.json({
      success: true,
      address,
      metadataURI: `ipfs://${mockIPFSHash}`,
      metadata: {
        email,
        country,
        issuedAt: new Date().toISOString(),
        kycProvider: "ArcID KYC Service",
        verified: true,
      },
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to mint ArcID" },
      { status: 500 }
    );
  }
}
