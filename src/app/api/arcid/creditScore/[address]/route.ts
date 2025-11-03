import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  // Mock credit score calculation based on address
  const hash = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const creditScore = 300 + (hash % 550); // Score between 300-850

  return NextResponse.json({
    address,
    creditScore,
    rating: creditScore > 700 ? "Excellent" : creditScore > 600 ? "Good" : "Fair",
    lastUpdated: new Date().toISOString(),
  });
}
