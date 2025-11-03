"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface OnboardingProps {
  address: string;
  onMint: (email: string, country: string) => void;
  isMinting: boolean;
}

export function Onboarding({ address, onMint, isMinting }: OnboardingProps) {
  const [email, setEmail] = React.useState("");
  const [country, setCountry] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && country) {
      onMint(email, country);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="border shadow-lg">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#B6509E] to-primary flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <div className="space-y-3">
              <CardTitle className="text-4xl">Welcome to ArcID</CardTitle>
              <CardDescription className="text-lg">
                Create your decentralized identity to access exclusive features and services
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isMinting}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    disabled={isMinting}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Connected Wallet</Label>
                  <div className="px-4 py-3 rounded-lg bg-muted text-sm font-mono truncate">
                    {address}
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={isMinting || !email || !country}
                >
                  {isMinting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                      Minting Your ArcID...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Mint Your ArcID
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    By minting your ArcID, you agree to our Terms of Service
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Your data is encrypted and stored on IPFS</span>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}