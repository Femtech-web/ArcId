"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { verifyIdentity } from "@/lib/api";
import { toast } from "sonner";

interface OnboardingProps {
  address: string;
  onMint: (email: string, country: string, proof: any) => void;
  isMinting: boolean;
}

export function Onboarding({ address, onMint, isMinting }: OnboardingProps) {
  const [email, setEmail] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [proof, setProof] = React.useState<any>(null);

  const handleVerify = async (result: any) => {
    try {
      setIsVerifying(true);

      const data = await verifyIdentity(result);
      if (!data || !data.success) {
        throw new Error(data?.error || "Worldcoin verification failed");
      }
      setProof(result);
    } catch (err) {
      console.error("❌ Verification failed:", err);
      toast.error("World ID verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSuccess = () => {
    toast.success("World ID verification successful");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && country && proof) {
      onMint(email, country, proof);
    } else {
      alert("Please complete World ID verification first.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="border shadow-lg">
          <CardHeader className="text-center space-y-6 pb-6 sm:pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#B6509E] to-primary flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </motion.div>
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-4xl font-bold">
                Welcome to ArcID
              </CardTitle>
              <CardDescription className="text-base sm:text-lg px-2">
                Verify with World ID to mint your decentralized ArcID
                credential.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-8">
            <div className="text-center space-y-2 pb-4 border-b mb-6">
              <h3 className="text-base sm:text-lg font-medium">
                How to get your ArcID
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter your <span className="font-semibold">email</span> and{" "}
                <span className="font-semibold">country</span>, then verify your
                identity with <span className="font-semibold">World ID</span>.
                Once verified, you’ll be able to mint your{" "}
                <span className="font-semibold">ArcID credential</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isMinting || isVerifying}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm sm:text-base">
                    Country
                  </Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    disabled={isMinting || isVerifying}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">
                    Connected Wallet
                  </Label>
                  <div className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-muted text-xs sm:text-sm font-mono truncate">
                    {address}
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4 text-center">
                <IDKitWidget
                  app_id={process.env.NEXT_PUBLIC_WORLDCOIN_ID! as any}
                  action={process.env.NEXT_PUBLIC_WORLDCOIN_IDENTIFIER!}
                  onSuccess={handleSuccess}
                  handleVerify={handleVerify}
                  verification_level={VerificationLevel.Device}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      onClick={open}
                      disabled={isVerifying || isMinting}
                      className="w-full bg-[#1A1A1A] hover:bg-[#333] text-sm sm:text-base h-11 sm:h-12"
                    >
                      {isVerifying ? "Verifying..." : "Verify with World ID"}
                    </Button>
                  )}
                </IDKitWidget>

                <Button
                  type="submit"
                  disabled={isMinting || !email || !country || !proof}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {isMinting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
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
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
