import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params;

    const { data, error } = await supabase
      .from("arcid_verifications")
      .select("*")
      .eq("address", address.toLowerCase())
      .order("verified_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      events: data || [],
    });
  } catch (err: any) {
    console.error("history fetch error", err);
    return NextResponse.json(
      { error: err.message || "failed to fetch history" },
      { status: 500 }
    );
  }
}
