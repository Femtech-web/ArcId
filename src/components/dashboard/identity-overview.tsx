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
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface IdentityOverviewProps {
  address: string;
  verified: boolean;
  creditScore: number;
  metadataURI: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function IdentityOverview({
  address,
  verified,
  creditScore,
  metadataURI,
  onRefresh,
  isRefreshing,
}: IdentityOverviewProps) {
  const [copied, setCopied] = React.useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const ipfsHash = metadataURI.replace("ipfs://", "");
  const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

  return (
    <Card className="border shadow-sm w-full">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl">
              Identity Overview
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your on-chain identity credentials
            </CardDescription>
          </div>
          <div className="flex items-center justify-start sm:justify-end gap-2">
            {verified ? (
              <Badge className="bg-success hover:bg-success/90 text-success-foreground gap-1.5 px-2.5 py-1 text-xs sm:text-sm">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="gap-1.5 px-2.5 py-1 text-xs sm:text-sm"
              >
                <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Not Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 px-4 sm:px-6 pb-6">
        {/* Address + Credit Score */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          {/* Wallet Address */}
          <div className="space-y-2 sm:space-y-3 w-full">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Wallet Address
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <code className="text-xs sm:text-sm bg-muted px-3 sm:px-4 py-2.5 rounded-lg flex-1 truncate font-mono break-all">
                {address}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyAddress}
                className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-lg mx-auto sm:mx-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Credit Score */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Credit Score
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="text-3xl sm:text-4xl font-bold text-primary">
                {creditScore}
              </div>
              <Badge
                variant="outline"
                className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 self-start sm:self-center"
              >
                {creditScore > 700
                  ? "Excellent"
                  : creditScore > 200
                    ? "Good"
                    : "Fair"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            Metadata URI
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <code className="text-xs sm:text-sm bg-muted px-3 sm:px-4 py-2.5 rounded-lg flex-1 truncate font-mono break-all">
              {metadataURI}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(ipfsGatewayUrl, "_blank")}
              className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-lg mx-auto sm:mx-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Optional refresh (kept commented) */}
        {/* <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 sm:px-6 h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Verification
              </>
            )}
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
