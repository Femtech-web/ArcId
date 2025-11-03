"use client";

import * as React from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { Toaster } from "@/components/ui/sonner";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          {mounted ? children : null}
          <Toaster richColors position="top-right" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
