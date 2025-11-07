import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params;

    const { data, error } = await supabase
      .from("arcid_identities")
      .select(
        "email, country, provider, metadata_uri, data_hash, credit_score, issued_at, verified"
      )
      .eq("address", address.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch identity metadata" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No record found for this address" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
      ...data,
    });
  } catch (err: any) {
    console.error("identity fetch error", err);
    return NextResponse.json(
      { error: err.message || "fetch failed" },
      { status: 500 }
    );
  }
}
