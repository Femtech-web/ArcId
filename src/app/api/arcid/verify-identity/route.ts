import { NextRequest, NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import { supabase } from "@/lib/supabase";
import { ArcIDService } from "@/lib/arcidService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, signature, message, dapp_name, dapp_url } = body;

    if (!address || !signature || !message || !dapp_name || !dapp_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recovered = verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const svc = new ArcIDService(
      process.env.RPC_URL!,
      process.env.VERIFIER_PRIVATE_KEY!,
      process.env.ARCID_CONTRACT_ADDRESS!
    );

    const isVerified = await svc.isVerified(address);
    if (!isVerified) {
      return NextResponse.json(
        { error: "User does not have a verified ArcID identity" },
        { status: 403 }
      );
    }

    const identityData = await svc.getIdentityData(address);
    const creditScore = Number(identityData.creditScore);
    const metadataURI = identityData.metadataURI;

    const { error } = await supabase.from("connected_dapps").upsert(
      {
        address: address.toLowerCase(),
        dapp_name,
        dapp_url,
      } as any,
      { onConflict: ["address", "dapp_name"] } as any
    );
    if (error) throw error;

    return NextResponse.json({
      success: true,
      verified: true,
      address,
      creditScore,
      metadataURI,
      dapp: { name: dapp_name, url: dapp_url },
    });
  } catch (err) {
    console.error("connect-dapp error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
