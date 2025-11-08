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
import { useArcID } from "@/hooks/useArcID";

export default function Home() {
  const { address, isConnected } = useAccount();
  const {
    state,
    identityData,
    isMinting,
    isRefreshing,
    handleMint,
    handleRefresh,
  } = useArcID(address);

  if (state === "loading") {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 sm:space-y-6 text-center"
      >
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary" />
        <p className="text-base sm:text-lg text-muted-foreground">
          Loading your identity...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 sm:space-y-8 px-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#B6509E] to-primary flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
            <div className="space-y-3 sm:space-y-4 max-w-md sm:max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
                Welcome to ArcID
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                Connect your wallet to access your decentralized identity
                dashboard
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
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
                  isMinting={isMinting}
                />
              </motion.div>
            )}

            {(state === "pending" || isMinting) && (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 sm:space-y-8 text-center px-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#B6509E] to-primary animate-pulse shadow-2xl" />
                  <Loader2 className="absolute inset-0 m-auto w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Verifying Identity...
                  </h2>
                  <p className="text-sm sm:text-lg text-muted-foreground">
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
                className="space-y-6 sm:space-y-8"
              >
                <div className="px-2 sm:px-0">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">
                    Dashboard
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Manage your decentralized identity
                  </p>
                </div>

                <IdentityOverview
                  address={address || ""}
                  verified={identityData.verified}
                  creditScore={identityData.creditScore}
                  metadataURI={identityData.metadataURI}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />

                <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
                  <CredentialsSection
                    metadata={identityData.metadata}
                    metadataURI={identityData.metadataURI}
                  />
                  <VerificationHistory address={address as string} />
                </div>
                <ConnectedDApps address={address as string} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
