// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function mintArcID(userAddress: string, userData: any) {
  const res = await fetch(`/api/arcid/mint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    } as any,
    body: JSON.stringify({
      userAddress,
      userData,
      proof: userData.proof,
    }),
  });
  return res.json();
}

export async function updateArcID(userAddress: string, userData: any) {
  const res = await fetch(`/api/arcid/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
    } as any,
    body: JSON.stringify({
      userAddress,
      userData,
      reverify: true,
    }),
  });
  return res.json();
}

export async function verifyIdentity(result: any) {
  const res = await fetch(`/api/worldcoin/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });

  return res.json();
}

export async function connectArcId(userAddress: string, signature: string, message: string) {
  const res = await fetch(`/api/arcid/verify-identity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: userAddress,
      signature,
      message,
      dapp_name: "ArcLend",
      dapp_url: "https://docs.arc.network",
    }),
  });

  return res.json();
}

export async function getOffchainIdentity(address: string) {
  const res = await fetch(`/api/arcid/identity/${address}`);
  if (!res.ok) throw new Error("Failed to fetch offchain identity");
  return res.json();
}

export async function getVerificationHistory(address: string) {
  const res = await fetch(`/api/arcid/history/${address}`);
  const json = await res.json();
  return json.events || [];
}

export async function getConnectedDapps(address: string) {
  const res = await fetch(`/api/arcid/connected-dapps/${address}`);
  const json = await res.json();
  return json.data || [];
}

