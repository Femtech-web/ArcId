"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

interface VerificationEvent {
  id: string;
  date: string;
  provider: string;
  status: "completed" | "pending";
}

export function VerificationHistory() {
  const events: VerificationEvent[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      provider: "ArcID KYC Service",
      status: "completed",
    },
    {
      id: "2",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      provider: "Identity Verification Gateway",
      status: "completed",
    },
    {
      id: "3",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      provider: "ArcID KYC Service",
      status: "completed",
    },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verification History</CardTitle>
        <CardDescription className="text-base">Timeline of your identity verifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                {event.status === "completed" ? (
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold">{event.provider}</p>
                  <Badge
                    variant={event.status === "completed" ? "default" : "secondary"}
                    className={
                      event.status === "completed"
                        ? "bg-success hover:bg-success/90 text-success-foreground"
                        : ""
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
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