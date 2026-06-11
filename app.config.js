/** @type {import('./proto-client/config/app.config.schema').AppConfig} */
module.exports = {
  app: {
    name: "Proto",
    tagline: "AI infrastructure you can ship",
    description:
      "A full-stack SaaS foundation with auth, chat, RAG, and provider-agnostic AI — ready to fork for client projects.",
    logo: "/logo.svg",
    supportEmail: "support@example.com",
  },
  features: {
    chat: true,
    documents: true,
    chains: false,
    models: false,
    usage: true,
    prompts: false,
    billing: true,
    team: true,
  },
  auth: {
    signupEnabled: true,
    loginRedirect: "/dashboard",
  },
  ai: {
    defaultProvider: "local",
    defaultModel: "gemma4:e2b",
    rag: { topK: 5, chunkSize: 512 },
  },
  marketing: {
    showPricing: true,
    ctaLabel: "Get started",
    ctaHref: "/signup",
  },
};
