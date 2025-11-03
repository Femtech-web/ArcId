import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, reverify } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (reverify) {
      return NextResponse.json({
        success: true,
        address,
        verified: true,
        lastVerified: new Date().toISOString(),
        message: "Verification refreshed successfully",
      });
    }

    return NextResponse.json({
      success: true,
      address,
      message: "ArcID updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update ArcID" },
      { status: 500 }
    );
  }
}
