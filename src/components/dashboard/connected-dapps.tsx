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
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { getConnectedDapps } from "@/lib/api";

interface DApp {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  gradient: string;
}

export function ConnectedDApps({ address }: { address: string }) {
  const [connected, setConnected] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        const data = await getConnectedDapps(address);
        setConnected(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  if (loading)
    return (
      <p className="text-muted-foreground text-center text-sm sm:text-base">
        Loading connected dapps...
      </p>
    );
  if (!connected.length)
    return (
      <p className="text-muted-foreground text-center text-sm sm:text-base">
        No connected dapps yet.
      </p>
    );

  return (
    <Card className="border shadow-sm w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Connected dApps</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Services using your ArcID for authentication and access
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          {connected.map((dapp) => (
            <div
              key={dapp.dapp_name}
              className="group relative overflow-hidden rounded-lg border bg-card p-4 sm:p-6 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-sm`}
                >
                  {dapp.icon}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
                  onClick={() => window.open(dapp.dapp_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                {dapp.dapp_name}
              </h3>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
