import * as Client from "@storacha/client";
import { StoreMemory } from "@storacha/client/stores/memory";
import * as Proof from "@storacha/client/proof";
import { Signer } from "@storacha/client/principal/ed25519";
import { Blob } from "buffer";

const File =
  globalThis.File ||
  class File extends Blob {
    name: string;
    lastModified: number;
    constructor(parts: any[], name: string, options: any = {}) {
      super(parts, options);
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
    }
  };

export async function uploadMetadataToStoracha(metadata: any) {
  try {
    const principal = Signer.parse(process.env.STORACHA_KEY!);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });

    const proof = await Proof.parse(process.env.STORACHA_PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());

    const json = JSON.stringify(metadata, null, 2);
    const buffer = Buffer.from(json);
    const file = new File([buffer], "metadata.json", {
      type: "application/json",
    });

    const cid = await client.uploadFile(file);

    return `ipfs://${cid}`;
  } catch (err) {
    console.error("❌ Storacha upload failed:", err);
    throw new Error("Failed to upload to Storacha");
  }
}
