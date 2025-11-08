import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadMetadataToStoracha } from "@/lib/storachaUploader";
import { buildDataHash } from "@/lib/utils";
import { ArcIDService } from "@/lib/arcidService";


export async function POST(request: NextRequest) {
  try {
    const { userAddress, userData, proof, salt } = await request.json();

    if (!userAddress || !userData || !proof) {
      return NextResponse.json(
        { error: "userAddress, userData, and proof are required" },
        { status: 400 }
      );
    }

    const appId = process.env.WORLDCOIN_APP_ID;
    const actionId = process.env.WORLDCOIN_ACTION_ID;

    const svc = new ArcIDService(process.env.RPC_URL!,
      process.env.VERIFIER_PRIVATE_KEY!,
      process.env.ARCID_CONTRACT_ADDRESS!);

    const creditScore = svc.deriveCreditScore(userData, proof);

    const metadata = {
      name: "ArcID Credential",
      description:
        "Worldcoin-verified decentralized identity for Arc Network",
      verifier: "Worldcoin",
      userData: {
        country: userData.country,
        email: userData.email,
      },
      worldcoin: {
        verified: true,
        appId,
        actionId,
        timestamp: new Date().toISOString(),
        nullifier_hash: proof.nullifier_hash,
      },
      timestamp: Date.now(),
    };

    const metadataURI = await uploadMetadataToStoracha(metadata);

    const dataHash = buildDataHash(metadataURI, salt || "");

    const result = await svc.mintIdentity({
      to: userAddress,
      dataHash,
      metadataURI,
      creditScore,
    });

    const { error: dbError } = await supabase.from("arcid_identities").upsert({
      address: userAddress.toLowerCase(),
      email: userData.email,
      country: userData.country,
      provider: "Worldcoin",
      metadata_uri: metadataURI,
      data_hash: dataHash,
      credit_score: creditScore,
      verified: true,
      issued_at: new Date().toISOString(),
    });

    await supabase.from("arcid_verifications").insert({
      address: userAddress.toLowerCase(),
      provider: "Worldcoin",
      status: "completed",
      type: "mint",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    return NextResponse.json({
      success: true,
      metadataURI,
      dataHash,
      creditScore,
      metadata,
      result,
    });
  } catch (err: any) {
    console.error("mint error", err);
    return NextResponse.json(
      { error: err.message || "mint failed" },
      { status: 500 }
    );
  }
}
