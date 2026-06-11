import {
  MessageSquare,
  FileUp,
  GitBranch,
  Brain,
  BarChart3,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const appConfig = {
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
  marketing: {
    showPricing: true,
    ctaLabel: "Get started",
    ctaHref: "/signup",
  },
};

export const coreFeatures = [
  {
    id: "dashboard",
    enabled: true,
    section: null,
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and quick actions",
  },
  {
    id: "chat",
    enabled: appConfig.features.chat,
    section: "Products",
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
    description: "AI conversations with streaming",
  },
  {
    id: "documents",
    enabled: appConfig.features.documents,
    section: "Products",
    title: "Documents",
    url: "/documents",
    icon: FileUp,
    description: "Upload and manage RAG sources",
  },
  {
    id: "chains",
    enabled: appConfig.features.chains,
    section: "Infrastructure",
    title: "Chains",
    url: "/chains",
    icon: GitBranch,
    description: "Execution chains and workflows",
  },
  {
    id: "models",
    enabled: appConfig.features.models,
    section: "Infrastructure",
    title: "Models",
    url: "/models",
    icon: Brain,
    description: "Model registry and routing",
  },
  {
    id: "usage",
    enabled: appConfig.features.usage,
    section: "Management",
    title: "Usage",
    url: "/usage",
    icon: BarChart3,
    description: "Token and cost monitoring",
  },
  {
    id: "prompts",
    enabled: appConfig.features.prompts,
    section: "Management",
    title: "Prompts",
    url: "/prompts",
    icon: FileText,
    description: "Prompt library",
  },
  {
    id: "settings",
    enabled: true,
    section: "Management",
    title: "Settings",
    url: "/settings/profile",
    icon: Settings,
    description: "Account and workspace settings",
  },
];

export const getEnabledNavItems = () =>
  coreFeatures.filter((feature) => feature.enabled);

export const buildNavFromFeatures = (extraSections = []) => {
  const enabled = getEnabledNavItems();
  const sections = new Map();

  enabled.forEach((feature) => {
    if (!feature.section) {
      sections.set(`__single_${feature.id}`, {
        title: feature.title,
        url: feature.url,
        icon: feature.icon,
      });
      return;
    }

    if (!sections.has(feature.section)) {
      sections.set(feature.section, { section: feature.section, items: [] });
    }
    sections.get(feature.section).items.push({
      id: feature.id,
      title: feature.title,
      url: feature.url,
      icon: feature.icon,
    });
  });

  const nav = [];
  sections.forEach((value, key) => {
    if (key.startsWith("__single_")) {
      nav.push(value);
    } else {
      nav.push(value);
    }
  });

  return [...nav, ...extraSections];
};
