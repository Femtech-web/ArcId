"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet, CreditCard, Building2, TrendingUp } from "lucide-react";

interface DApp {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  gradient: string;
}

export function ConnectedDApps() {
  const dapps: DApp[] = [
    {
      name: "ArcLend",
      description: "Decentralized lending protocol with identity-based credit lines",
      icon: <Wallet className="w-6 h-6" />,
      url: "#",
      gradient: "from-primary to-primary/70",
    },
    {
      name: "ArcPay",
      description: "Seamless crypto payments with verified identity",
      icon: <CreditCard className="w-6 h-6" />,
      url: "#",
      gradient: "from-[#B6509E] to-primary",
    },
    {
      name: "ArcBank",
      description: "Digital banking services for the decentralized world",
      icon: <Building2 className="w-6 h-6" />,
      url: "#",
      gradient: "from-success to-primary",
    },
    {
      name: "ArcInvest",
      description: "Investment platform with exclusive opportunities for verified users",
      icon: <TrendingUp className="w-6 h-6" />,
      url: "#",
      gradient: "from-primary to-[#B6509E]",
    },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Connected dApps</CardTitle>
        <CardDescription className="text-base">
          Services using your ArcID for authentication and access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {dapps.map((dapp) => (
            <div
              key={dapp.name}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${dapp.gradient} flex items-center justify-center text-white shadow-sm`}
                >
                  {dapp.icon}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9 rounded-lg"
                  onClick={() => window.open(dapp.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-2">{dapp.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{dapp.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}