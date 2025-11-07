"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { getVerificationHistory } from "@/lib/api";

interface VerificationEvent {
  id: string;
  verified_at: string;
  provider: string;
  status: "completed" | "pending";
  type: "mint" | "update" | "reverify";
}

export function VerificationHistory({ address }: { address: string }) {
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    (async () => {
      try {
        const data = await getVerificationHistory(address);
        setEvents(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  if (loading)
    return (
      <p className="text-muted-foreground text-center text-sm sm:text-base py-6">
        Loading verification history...
      </p>
    );

  if (!events.length)
    return (
      <p className="text-muted-foreground text-center text-sm sm:text-base py-6">
        No verifications yet.
      </p>
    );

  return (
    <Card className="border shadow-sm w-full">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Verification History
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Timeline of your identity verifications
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-6">
        <div className="space-y-3 sm:space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 self-start sm:self-auto">
                {event.status === "completed" ? (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                  </div>
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1 sm:space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <p className="text-sm sm:text-base font-semibold break-words">
                    {event.provider}
                    {event.type && (
                      <span className="text-muted-foreground text-xs sm:text-sm ml-1 sm:ml-2">
                        ({event.type})
                      </span>
                    )}
                  </p>

                  <Badge
                    variant={
                      event.status === "completed" ? "default" : "secondary"
                    }
                    className={`text-xs sm:text-sm ${
                      event.status === "completed"
                        ? "bg-success hover:bg-success/90 text-success-foreground"
                        : ""
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground">
                  {new Date(event.verified_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
