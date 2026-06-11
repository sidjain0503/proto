"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig } from "@/config/app.config";
import { cn } from "@/lib/utils";
import { User, CreditCard, Users, Building2 } from "lucide-react";

const settingsLinks = [
  {
    id: "profile",
    title: "Profile",
    href: "/settings/profile",
    icon: User,
    enabled: true,
  },
  {
    id: "organization",
    title: "Organization",
    href: "/settings",
    icon: Building2,
    enabled: true,
  },
  {
    id: "billing",
    title: "Billing",
    href: "/settings/billing",
    icon: CreditCard,
    enabled: appConfig.features.billing,
  },
  {
    id: "team",
    title: "Team",
    href: "/settings/team",
    icon: Users,
    enabled: appConfig.features.team,
  },
];

export const SettingsNav = () => {
  const pathname = usePathname();
  const links = settingsLinks.filter((link) => link.enabled);

  return (
    <nav
      className="flex flex-col gap-1"
      aria-label="Settings navigation"
    >
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          pathname === link.href ||
          (link.href !== "/settings" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
};
