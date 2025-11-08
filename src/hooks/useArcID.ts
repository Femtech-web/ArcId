"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getOffchainIdentity,
  mintArcID,
  updateArcID,
} from "@/lib/api";
import { useArcIDContract } from "@/hooks/useArcIDContract";
import { useAccount } from "wagmi";

interface IdentityData {
  verified: boolean;
  creditScore: number;
  metadataURI: string;
  metadata: {
    email: string;
    country: string;
    issuedAt: string;
    kycProvider: string;
  };
}

type DashboardState = "loading" | "unverified" | "verified" | "pending";

export function useArcID(address?: string) {
  const [state, setState] = useState<DashboardState>("loading");
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { chainId } = useAccount();

  const {
    getIdentityDataOnChain,
    contract
  } = useArcIDContract();

  const fetchIdentityData = useCallback(async (userAddress: string) => {
    setState("loading");

    try {
      const [identity, dbRes] = await Promise.all([
        getIdentityDataOnChain(userAddress),
        getOffchainIdentity(userAddress),
      ]);

      if (!identity?.verified && chainId !== Number(process.env.NEXT_PUBLIC_ANVIL_CHAINID)) {
        setState("unverified");
        return;
      }

      const mergedData: IdentityData = {
        verified: true,
        creditScore: identity?.creditScore || 0,
        metadataURI: identity?.metadataURI || dbRes?.metadata_uri || "",
        metadata: {
          email: dbRes?.email || "unknown",
          country: dbRes?.country || "unknown",
          issuedAt: dbRes?.issued_at || new Date((identity?.issuedAt ?? 0) * 1000).toISOString(),
          kycProvider: dbRes?.provider || "ArcID",
        },
      };

      setIdentityData(mergedData);
      setState("verified");
    } catch (error) {
      console.error("Error fetching identity data:", error);
      toast.error("Failed to load identity data");
      setState("unverified");
    }
  }, [contract]);


  async function handleMint(email: string, country: string, proof?: any) {
    if (!address) return;
    setIsMinting(true);
    setState("pending");

    try {
      if (!proof) {
        toast.error("Please complete World ID verification first.");
        setState("unverified");
        setIsMinting(false);
        return;
      }

      const result = await mintArcID(address, { email, country, proof });

      if (result.success) {
        toast.success("🎉 ArcID minted successfully!");
        window.location.reload()
      } else {
        throw new Error(result.error || "Failed to mint ArcID");
      }
    } catch (error: any) {
      console.error("Error minting ArcID:", error);
      toast.error(error.message || "Failed to mint ArcID. Please try again.");
      setState("unverified");
    } finally {
      setIsMinting(false);
    }
  }

  async function handleRefresh() {
    if (!address) return;
    setIsRefreshing(true);

    try {
      const result = await updateArcID(address, { reverify: true });
      if (result.success) {
        toast.success("Verification refreshed successfully!");
        await fetchIdentityData(address);
      } else {
        throw new Error(result.error || "Failed to refresh verification");
      }
    } catch (error) {
      console.error("Error refreshing verification:", error);
      toast.error("Failed to refresh verification");
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    if (!address || !contract) return;
    let mounted = true;

    (async () => {
      try {
        await fetchIdentityData(address);
      } catch (e) {
        if (mounted) console.error("Skipping identity fetch until contract ready", e);
      }
    })();

    return () => { mounted = false };
  }, [address, contract, chainId]);

  return {
    state,
    identityData,
    isMinting,
    isRefreshing,
    fetchIdentityData,
    handleMint,
    handleRefresh,
  };
}

