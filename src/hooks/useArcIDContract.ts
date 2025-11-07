import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ethers } from "ethers";
import { useEthers } from "./useEthers";
import ArcIdJson from "@/abi/ArcId.json";

interface UseArcIDContractOptions {
  rpcUrl?: string;
  contractAddress?: string;
}

export function useArcIDContract(options: UseArcIDContractOptions = {}) {
  const { provider: walletProvider } = useEthers();
  const contractAddress = options.contractAddress || process.env.NEXT_PUBLIC_ARCID_CONTRACT!;
  const rpcUrl = options.rpcUrl || process.env.NEXT_PUBLIC_RPC_URL!;
  const ARCID_ABI = ArcIdJson.abi;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractRef = useRef<ethers.Contract | null>(null);
  const providerRef = useRef<ethers.Provider | null>(null);

  const provider = useMemo(() => {
    if (walletProvider) return walletProvider;
    return new ethers.JsonRpcProvider(rpcUrl);
  }, [walletProvider, rpcUrl]);

  useEffect(() => {
    if (!contractAddress || !provider) return;

    try {
      const runner = walletProvider
        ? (provider as ethers.BrowserProvider).getSigner()
        : provider;

      Promise.resolve(runner).then((resolvedRunner) => {
        const _contract = new ethers.Contract(contractAddress, ARCID_ABI, resolvedRunner);
        contractRef.current = _contract;
        providerRef.current = provider;
        setError(null);
      });
    } catch (err: any) {
      console.error("Error initializing ArcID contract:", err);
      setError("Failed to initialize contract");
    }
  }, [contractAddress, provider, walletProvider, ARCID_ABI]);

  const getContract = useCallback(() => {
    return contractRef.current;
  }, []);

  const safeCall = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      return await fn();
    } catch (err) {
      console.error(err);
      setError("On-chain call failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getIdentityDataOnChain = useCallback(
    async (address: string) => {
      const c = getContract();
      if (!c) throw new Error("Contract not ready");
      const identity = await safeCall(() => c.getIdentityData(address));
      if (!identity) return null;
      return {
        dataHash: identity.dataHash,
        verified: identity.verified,
        creditScore: Number(identity.creditScore),
        issuedAt: Number(identity.issuedAt),
        metadataURI: identity.metadataURI,
      };
    },
    [getContract, safeCall]
  );

  return {
    provider,
    contract: contractRef.current,
    loading,
    error,
    getIdentityDataOnChain,
  };
}
