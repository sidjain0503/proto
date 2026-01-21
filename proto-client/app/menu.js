import { 
  MessageSquare, 
  GitBranch, 
  Brain, 
  BarChart3, 
  FileText, 
  Settings,
  Home 
} from "lucide-react"

export const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    section: "Products",
    items: [
      {
        title: "Chat",
        url: "/chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    section: "Infrastructure",
    items: [
      {
        title: "Chains",
        url: "/chains",
        icon: GitBranch,
      },
      {
        title: "Models",
        url: "/models",
        icon: Brain,
      },
    ],
  },
  {
    section: "Management",
    items: [
      {
        title: "Usage",
        url: "/usage",
        icon: BarChart3,
      },
      {
        title: "Prompts",
        url: "/prompts",
        icon: FileText,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]
