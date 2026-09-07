import {
  LayoutDashboard,
  FolderGit2,
  Rocket,
  Server,
  Network,
  Activity,
  ScrollText,
  Workflow,
  BellRing,
  AlertTriangle,
  Target,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Overview",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Projects",
        href: "/projects",
        icon: FolderGit2,
      },
      {
        title: "Deployments",
        href: "/deployments",
        icon: Rocket,
      },
      {
        title: "Infrastructure",
        href: "/infrastructure",
        icon: Server,
      },
      {
        title: "Kubernetes",
        href: "/kubernetes",
        icon: Network,
      },
    ],
  },
  {
    title: "Observability",
    items: [
      {
        title: "Metrics",
        href: "/metrics",
        icon: Activity,
      },
      {
        title: "Logs",
        href: "/logs",
        icon: ScrollText,
      },
      {
        title: "Traces",
        href: "/traces",
        icon: Workflow,
      },
      {
        title: "Alerts",
        href: "/alerts",
        icon: BellRing,
      },
    ],
  },
  {
    title: "Reliability",
    items: [
      {
        title: "Incidents",
        href: "/incidents",
        icon: AlertTriangle,
      },
      {
        title: "SLOs",
        href: "/slos",
        icon: Target,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
