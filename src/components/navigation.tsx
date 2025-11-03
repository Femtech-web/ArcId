"use client";

import * as React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Moon, Sun, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    setTheme(newTheme);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#B6509E] to-primary">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            ArcID
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg h-10 w-10"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}