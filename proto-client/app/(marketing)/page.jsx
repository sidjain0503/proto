import Link from "next/link";
import {
  MessageSquare,
  FileUp,
  Shield,
  Zap,
  GitBranch,
  BarChart3,
} from "lucide-react";
import { appConfig } from "@/config/app.config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Streaming chat",
    description:
      "Production-ready chat with session history, streaming responses, and message persistence.",
  },
  {
    icon: FileUp,
    title: "Document RAG",
    description:
      "Upload PDFs and markdown, chunk, embed, and retrieve context automatically in conversations.",
  },
  {
    icon: GitBranch,
    title: "Chain execution",
    description:
      "Composable AI workflows with provider-agnostic chains — swap models without rewriting logic.",
  },
  {
    icon: Shield,
    title: "Auth built in",
    description:
      "JWT authentication, protected routes, and user-scoped data from day one.",
  },
  {
    icon: BarChart3,
    title: "Usage tracking",
    description:
      "Token and cost monitoring hooks so you can meter AI usage per user.",
  },
  {
    icon: Zap,
    title: "Fork in a day",
    description:
      "Configure branding, features, and providers — then build client-specific functionality.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Fork & configure",
    description: "Clone Proto, set app name, features, and AI providers in one config file.",
  },
  {
    step: "02",
    title: "Deploy baseline",
    description: "Spin up auth, database, chat, and RAG with docker-compose and deploy presets.",
  },
  {
    step: "03",
    title: "Build client features",
    description: "Focus on unique business logic — the SaaS shell is already running.",
  },
];

export default function MarketingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-background to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-400">
              Full-stack SaaS foundation
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {appConfig.app.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {appConfig.app.tagline}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {appConfig.app.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={appConfig.marketing.ctaHref}>
                  {appConfig.marketing.ctaLabel}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to ship AI SaaS
            </h2>
            <p className="mt-3 text-muted-foreground">
              Auth, chat, RAG, and observability — wired together so you can
              fork and deliver client projects fast.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-border/80">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              From fork to production in days
            </h2>
            <p className="mt-3 text-muted-foreground">
              A repeatable workflow for client delivery.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="relative rounded-xl border border-border bg-card p-6">
                <span className="text-3xl font-bold text-cyan-400/40">
                  {item.step}
                </span>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to build your next client app?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start with a production-grade baseline and ship what makes your
            client unique.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href={appConfig.marketing.ctaHref}>
              {appConfig.marketing.ctaLabel} free
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
