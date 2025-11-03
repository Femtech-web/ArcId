"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Mail, Globe, Shield } from "lucide-react";

interface Credential {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface CredentialsSectionProps {
  metadata: {
    email: string;
    country: string;
    issuedAt: string;
    kycProvider: string;
  };
  metadataURI: string;
}

export function CredentialsSection({ metadata, metadataURI }: CredentialsSectionProps) {
  const credentials: Credential[] = [
    {
      label: "Email",
      value: metadata.email,
      icon: <Mail className="w-4 h-4 text-primary" />,
    },
    {
      label: "Country",
      value: metadata.country,
      icon: <Globe className="w-4 h-4 text-primary" />,
    },
    {
      label: "Issued At",
      value: new Date(metadata.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      icon: <Calendar className="w-4 h-4 text-primary" />,
    },
    {
      label: "KYC Provider",
      value: metadata.kycProvider,
      icon: <Shield className="w-4 h-4 text-primary" />,
    },
  ];

  const ipfsHash = metadataURI.replace("ipfs://", "");
  const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Credentials</CardTitle>
            <CardDescription className="text-base">Your verified identity information</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(ipfsGatewayUrl, "_blank")}
            className="h-9 rounded-lg"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on IPFS
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {credentials.map((credential) => (
            <div
              key={credential.label}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="mt-1 p-2 rounded-lg bg-primary/10">
                {credential.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {credential.label}
                </p>
                <p className="text-base font-semibold">{credential.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}