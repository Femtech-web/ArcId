"use client";

import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-muted/30 text-foreground w-full lg:px-[25%] sm:px-[10%] overflow-x-hidden">
      <div className="container max-w-4xl py-10 px-5 sm:px-6 space-y-12 overflow-x-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6509E] to-primary shadow-md shadow-primary/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                ArcID Docs
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                The decentralized identity layer for Web3
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base leading-relaxed max-w-2xl"
        >
          ArcID is a decentralized identity protocol that gives users a
          verifiable on-chain identity, powered by wallet verification, device
          proof (via Worldcoin), and optional metadata like country and email.
        </motion.p>

        {/* Sections */}
        <div className="space-y-10">
          {[
            {
              title: "What is ArcID?",
              content: (
                <>
                  <p>
                    ArcID provides a universal, verifiable identity layer for
                    Web3 users. Instead of relying on centralized sign-ins,
                    ArcID lets users prove they’re real, verified humans, using
                    wallet signatures and Worldcoin device proofs.
                  </p>
                  <p>
                    Once verified, users can mint an{" "}
                    <strong>on-chain ArcID NFT</strong>, a soulbound token
                    containing their identity hash and metadata.
                  </p>
                </>
              ),
            },
            {
              title: "Onboarding Flow",
              content: (
                <ol className="list-decimal ml-5 space-y-2">
                  <li>Enter your email and select your country.</li>
                  <li>
                    Scan a Worldcoin QR code to verify device/human proof.
                  </li>
                  <li>Once verified, mint your ArcID identity on-chain.</li>
                  <li>
                    You’ll get a credit score and identity metadata URI stored
                    on-chain.
                  </li>
                </ol>
              ),
            },
            {
              title: "Integrating ArcID in Your dApp",
              content: (
                <>
                  <p>
                    dApps can integrate ArcID for user authentication and
                    identity verification, similar to “Sign in with Google,” but
                    decentralized.
                  </p>
                  <p>Here’s how it works:</p>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li>User connects their wallet and signs a message.</li>
                    <li>
                      Your dApp calls ArcID’s <code>/verify-identity</code>{" "}
                      endpoint.
                    </li>
                    <li>
                      ArcID verifies the user’s signature and on-chain ArcID
                      token.
                    </li>
                    <li>
                      If valid, ArcID returns the verified identity data and
                      credit score.
                    </li>
                  </ol>
                  <div className="bg-gradient-to-br from-muted to-background/60 border rounded-xl p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
                    <pre className="text-muted-foreground">{`
        POST https://api.arcid.xyz/api/arcid/verify-identity
          {
            "address": "0x123...",
            "signature": "...",
            "message": "Login to ArcLend",
            "dapp_name": "ArcLend",
            "dapp_url": "https://appurl.xyz"
          }`}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ✅ If verification succeeds, your dApp can grant access or
                    load user data.
                  </p>
                </>
              ),
            },
            {
              title: "Example Response",
              content: (
                <div className="bg-gradient-to-br from-muted to-background/60 border rounded-xl p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner">
                  <pre className="text-muted-foreground">{`
                  {
                    "success": true,
                    "verified": true,
                    "address": "0x123...",
                    "creditScore": 720,
                    "metadataURI": "ipfs://...",
                    "dapp": {
                      "name": "ArcLend",
                      "url": "https://appurl.xyz"
                    }
                  }`}</pre>
                </div>
              ),
            },
            {
              title: "Why ArcID Matters",
              content: (
                <>
                  <p>
                    Web3 lacks a universal, privacy-preserving identity layer.
                    ArcID bridges that gap, enabling reputation,
                    proof-of-personhood, and seamless sign-ins across dApps.
                  </p>
                  <p>
                    It’s identity without centralization, secure, composable,
                    and user-owned.
                  </p>
                </>
              ),
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="border-none bg-gradient-to-b from-card/50 to-muted/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-primary to-[#B6509E] bg-clip-text text-transparent">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {section.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
