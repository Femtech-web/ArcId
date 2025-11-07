"use client";

import { useWalletClient } from "wagmi";
import { useMemo } from "react";
import { ethers } from "ethers";


export function useEthers() {
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!walletClient) return { signer: null, provider: null };

    const provider = new ethers.BrowserProvider(walletClient as any);
    return { signer: provider.getSigner(), provider };
  }, [walletClient]);
}
