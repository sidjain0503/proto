import Link from "next/link";
import { appConfig } from "@/config/app.config";

export const MarketingFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">{appConfig.app.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {appConfig.app.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Sign up
          </Link>
          <a
            href={`mailto:${appConfig.app.supportEmail}`}
            className="hover:text-foreground"
          >
            Support
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {year} {appConfig.app.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
