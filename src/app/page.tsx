"use client";

import * as React from "react";
import { useAccount } from "wagmi";
import { Navigation } from "@/components/navigation";
import { IdentityOverview } from "@/components/dashboard/identity-overview";
import { CredentialsSection } from "@/components/dashboard/credentials-section";
import { VerificationHistory } from "@/components/dashboard/verification-history";
import { ConnectedDApps } from "@/components/dashboard/connected-dapps";
import { Onboarding } from "@/components/dashboard/onboarding";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

export default function Home() {
  const { address, isConnected } = useAccount();
  const [state, setState] = React.useState<DashboardState>("loading");
  const [identityData, setIdentityData] = React.useState<IdentityData | null>(null);
  const [isMinting, setIsMinting] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Fetch identity data when wallet connects
  React.useEffect(() => {
    if (!address) {
      setState("loading");
      return;
    }

    fetchIdentityData(address);
  }, [address]);

  const fetchIdentityData = async (userAddress: string) => {
    setState("loading");
    
    try {
      // Fetch verification status and credit score in parallel
      const [verifiedRes, creditRes] = await Promise.all([
        fetch(`/api/arcid/isVerified/${userAddress}`),
        fetch(`/api/arcid/creditScore/${userAddress}`),
      ]);

      const verifiedData = await verifiedRes.json();
      const creditData = await creditRes.json();

      if (verifiedData.verified) {
        // User has an identity, load full data
        setIdentityData({
          verified: true,
          creditScore: creditData.creditScore,
          metadataURI: "ipfs://QmX4fG7h9kJnBvZ8YtR3mP2sL6wQ1eN5cA7dV9xK",
          metadata: {
            email: "user@example.com",
            country: "United States",
            issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            kycProvider: "ArcID KYC Service",
          },
        });
        setState("verified");
      } else {
        // User needs to mint identity
        setState("unverified");
      }
    } catch (error) {
      console.error("Error fetching identity data:", error);
      toast.error("Failed to load identity data");
      setState("unverified");
    }
  };

  const handleMint = async (email: string, country: string) => {
    if (!address) return;

    setIsMinting(true);
    setState("pending");

    try {
      const response = await fetch("/api/arcid/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          email,
          country,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("🎉 ArcID minted successfully!");
        
        // Update identity data with minted info
        setIdentityData({
          verified: true,
          creditScore: 650, // Starting credit score
          metadataURI: data.metadataURI,
          metadata: data.metadata,
        });

        setState("verified");
      } else {
        throw new Error(data.error || "Failed to mint ArcID");
      }
    } catch (error) {
      console.error("Error minting ArcID:", error);
      toast.error("Failed to mint ArcID. Please try again.");
      setState("unverified");
    } finally {
      setIsMinting(false);
    }
  };

  const handleRefresh = async () => {
    if (!address) return;

    setIsRefreshing(true);

    try {
      const response = await fetch("/api/arcid/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          reverify: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Verification refreshed successfully!");
        await fetchIdentityData(address);
      } else {
        throw new Error(data.error || "Failed to refresh verification");
      }
    } catch (error) {
      console.error("Error refreshing verification:", error);
      toast.error("Failed to refresh verification");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#B6509E] to-primary flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl font-bold text-foreground">
                Welcome to ArcID
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect your wallet to access your decentralized identity dashboard
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[70vh] space-y-6"
              >
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Loading your identity...</p>
              </motion.div>
            )}

            {state === "unverified" && !isMinting && (
              <motion.div
                key="unverified"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Onboarding
                  address={address || ""}
                  onMint={handleMint}
                  isMinting={false}
                />
              </motion.div>
            )}

            {(state === "pending" || isMinting) && (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[70vh] space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#B6509E] to-primary animate-pulse shadow-2xl" />
                  <Loader2 className="absolute inset-0 m-auto w-12 h-12 text-white animate-spin" />
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold">Verifying Identity...</h2>
                  <p className="text-muted-foreground text-lg">
                    Your identity is being verified on-chain
                  </p>
                </div>
              </motion.div>
            )}

            {state === "verified" && identityData && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                  <p className="text-muted-foreground text-lg">Manage your decentralized identity</p>
                </div>

                <IdentityOverview
                  address={address || ""}
                  verified={identityData.verified}
                  creditScore={identityData.creditScore}
                  metadataURI={identityData.metadataURI}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />

                <div className="grid gap-8 lg:grid-cols-2">
                  <CredentialsSection
                    metadata={identityData.metadata}
                    metadataURI={identityData.metadataURI}
                  />
                  <VerificationHistory />
                </div>

                <ConnectedDApps />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}