import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  // Mock data - simulate verified addresses
  const verifiedAddresses = [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  ];

  const isVerified = verifiedAddresses.includes(address.toLowerCase());

  return NextResponse.json({
    address,
    verified: isVerified,
    timestamp: new Date().toISOString(),
  });
}
