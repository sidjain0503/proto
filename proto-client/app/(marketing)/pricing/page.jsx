import Link from "next/link";
import { appConfig } from "@/config/app.config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "during development",
    description: "Fork Proto and run locally with core features.",
    features: [
      "Auth & user management",
      "Chat with streaming",
      "Document upload & RAG",
      "Self-hosted deployment",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Client",
    price: "Custom",
    period: "per project",
    description: "Deploy a branded SaaS app for your client on Proto.",
    features: [
      "Everything in Starter",
      "Custom branding & domain",
      "Feature flags per client",
      "Usage tracking & billing hooks",
      "Production deploy presets",
    ],
    cta: "Talk to us",
    href: `mailto:${appConfig.app.supportEmail}`,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    description: "SSO, team management, and dedicated support.",
    features: [
      "Everything in Client",
      "SSO / SAML",
      "Team & role management",
      "SLA & priority support",
      "Custom AI workflows",
    ],
    cta: "Contact sales",
    href: `mailto:${appConfig.app.supportEmail}`,
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Proto is a foundation you fork — pricing reflects how you deliver
          client projects, not seat-based SaaS billing.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? "border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                : undefined
            }
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
