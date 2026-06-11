"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { appConfig } from "@/config/app.config";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export const MarketingHeader = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${appConfig.app.name} home`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 ring-1 ring-cyan-500/20">
            <Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {appConfig.app.name}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          {appConfig.marketing.showPricing && (
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button
              type="button"
              onClick={handleDashboardClick}
              aria-label="Go to dashboard"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLoginClick}
                aria-label="Log in"
              >
                Log in
              </Button>
              {appConfig.auth.signupEnabled && (
                <Button
                  type="button"
                  onClick={handleSignupClick}
                  aria-label="Sign up"
                >
                  Sign up
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
