import { ethers } from "ethers";
import ABI_JSON from "@/abi/ArcId.json";

const ARCID_ABI = ABI_JSON.abi;

export class ArcIDService {
  signer: ethers.Wallet;
  contract: ethers.Contract;

  constructor(rpcUrl: string, privateKey: string, contractAddress: string) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    this.signer = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, ARCID_ABI, this.signer);
  }

  async mintIdentity({
    to,
    dataHash,
    metadataURI = "",
    creditScore = 0,
  }: {
    to: string;
    dataHash: string;
    metadataURI?: string;
    creditScore?: number;
  }) {
    const tx = await this.contract.mintIdentity(to, dataHash, metadataURI, creditScore);
    const receipt = await tx.wait();
    return { txHash: receipt.transactionHash, receipt };
  }

  async updateIdentity({
    user,
    newDataHash,
    newMetadataURI = "",
    newCreditScore = 0,
    verifiedFlag = true,
  }: {
    user: string;
    newDataHash: string;
    newMetadataURI?: string;
    newCreditScore?: number;
    verifiedFlag?: boolean;
  }) {
    const tx = await this.contract.updateIdentity(
      user,
      newDataHash,
      newMetadataURI,
      newCreditScore,
      verifiedFlag
    );
    const receipt = await tx.wait();
    return { txHash: receipt.transactionHash, receipt };
  }

  async revokeIdentity({ user }: { user: string }) {
    const tx = await this.contract.revokeIdentity(user);
    const receipt = await tx.wait();
    return { txHash: receipt.transactionHash, receipt };
  }

  async isVerified(user: string) {
    return await this.contract.isVerified(user);
  }

  async getIdentityData(user: string) {
    return await this.contract.getIdentityData(user);
  }

  deriveCreditScore(userData: any, proof: any) {
    let base = 100;

    // Email trust factor
    if (userData.email) base += 50;
    if (userData.email.endsWith(".edu")) base += 25;
    if (userData.email.endsWith(".gov")) base += 40;

    // Country factor
    if (userData.country) base += 30;

    // Proof verification depth
    if (proof?.merkle_root) base += 80;
    if (proof?.nullifier_hash) base += 40;
    if (proof?.verification_level === "orb") base += 100;

    return Math.min(Math.max(base, 100), 850);
  }
}
