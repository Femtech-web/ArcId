import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await context.params;

    const { data, error } = await supabase
      .from("connected_dapps")
      .select("*")
      .eq("address", address.toLowerCase());

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: any) {
    console.error("connected dapps fetch error", err);
    return NextResponse.json(
      { error: err.message || "failed to fetch connected dapps" },
      { status: 500 }
    );
  }
}
