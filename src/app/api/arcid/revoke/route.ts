import { NextRequest, NextResponse } from "next/server";
import { ArcIDService } from "@/lib/arcidService";


function requireApiKey(req: NextRequest): NextResponse | null {
  const header = req.headers.get("x-api-key");
  if (!header || header !== process.env.API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const unauthorized = requireApiKey(req);
    if (unauthorized) return unauthorized;

    const body = await req.json();
    const { userAddress } = body;
    if (!userAddress) {
      return NextResponse.json({ error: "userAddress required" }, { status: 400 });
    }

    const svc = new ArcIDService(
      process.env.RPC_URL!,
      process.env.VERIFIER_PRIVATE_KEY!,
      process.env.ARCID_CONTRACT_ADDRESS!
    );

    const result = await svc.revokeIdentity({ user: userAddress });
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("revoke error", err);
    return NextResponse.json(
      { error: err.message || "revoke failed" },
      { status: 500 }
    );
  }
}
