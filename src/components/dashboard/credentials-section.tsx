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

export function CredentialsSection({
  metadata,
  metadataURI,
}: CredentialsSectionProps) {
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
    <Card className="border shadow-sm w-full">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Credentials
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your verified identity information
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(ipfsGatewayUrl, "_blank")}
            className="h-9 rounded-lg text-sm sm:text-base w-full sm:w-auto"
          >
            <ExternalLink className="mr-2 h-4 w-4 shrink-0" />
            View on IPFS
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-6">
        <div className="space-y-3 sm:space-y-4">
          {credentials.map((credential) => (
            <div
              key={credential.label}
              className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center sm:items-start gap-2">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  {credential.icon}
                </div>
                <div className="sm:hidden">
                  <p className="text-xs font-medium text-muted-foreground">
                    {credential.label}
                  </p>
                  <p className="text-sm font-semibold break-words">
                    {credential.value}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-1 flex-col space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {credential.label}
                </p>
                <p className="text-base font-semibold break-words">
                  {credential.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
