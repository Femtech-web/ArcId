import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadMetadataToStoracha } from "@/lib/storachaUploader";
import { buildDataHash } from "@/lib/utils";
import { ArcIDService } from "@/lib/arcidService";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userAddress, userData, payload, salt, reverify } = body;

    if (!userAddress) {
      return NextResponse.json({ error: "userAddress required" }, { status: 400 });
    }

    let metadataURI = body.metadataURI || "";
    let newDataHash = "";
    let kycResult: any = null;
    let creditScore = 0;


    const svc = new ArcIDService(
      process.env.RPC_URL!,
      process.env.VERIFIER_PRIVATE_KEY!,
      process.env.ARCID_CONTRACT_ADDRESS!
    );

    if (reverify && userData) {
      creditScore = svc.deriveCreditScore(userData, kycResult.proof || {});

      const metadata = {
        name: "ArcID Credential (Updated)",
        description: "Updated identity credential after re-verification",
        verifier: "ArcID KYC Service",
        kyc: kycResult,
        userData: {
          country: userData.country,
          email: userData.email,
        },
        updatedAt: new Date().toISOString(),
      };

      metadataURI = await uploadMetadataToStoracha(metadata);

      newDataHash = buildDataHash(metadataURI, salt || "");

      const { error: dbError1 } = await supabase.from("arcid_identities").upsert({
        address: userAddress.toLowerCase(),
        email: userData.email,
        country: userData.country,
        provider: "Worldcoin",
        metadata_uri: metadataURI,
        data_hash: newDataHash,
        credit_score: creditScore,
        verified: true,
        updated_at: new Date().toISOString(),
      });
      if (dbError1) console.error("Supabase upsert error:", dbError1);

      const { error: dbError2 } = await supabase.from("arcid_verifications").insert({
        address: userAddress.toLowerCase(),
        provider: "Worldcoin",
        status: "completed",
        type: "reverify",
      });
      if (dbError2) console.error("Supabase verification insert error:", dbError2);
    } else if (payload) {
      newDataHash = buildDataHash(payload, salt || "");

      const { error: dbError3 } = await supabase.from("arcid_verifications").insert({
        address: userAddress.toLowerCase(),
        provider: "ArcID",
        status: "completed",
        type: "update",
      });
      if (dbError3) console.error("Supabase verification insert error:", dbError3);
    } else {
      return NextResponse.json(
        { error: "payload or reverify required" },
        { status: 400 }
      );
    }

    const result = await svc.updateIdentity({
      user: userAddress,
      newDataHash,
      newMetadataURI: metadataURI,
      newCreditScore: creditScore,
      verifiedFlag: true,
    });

    return NextResponse.json({
      success: true,
      reverified: !!reverify,
      metadataURI,
      newDataHash,
      creditScore,
      kyc: kycResult,
      result,
    });
  } catch (err: any) {
    console.error("update error", err);
    return NextResponse.json(
      { error: err.message || "update failed" },
      { status: 500 }
    );
  }
}
