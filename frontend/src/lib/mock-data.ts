import { Project, ProjectDetail } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "backend-api",
    name: "Backend API",
    description: "Core backend services and API gateway for InfraPulse.",
    repository: "github.com/company/backend-api",
    status: "Healthy",
    environments: ["Production", "Staging", "Development"],
    serviceCount: 8,
    lastDeployment: { version: "v1.4.2", timestamp: "2 min ago" }
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "Main web application portal for the developer platform.",
    repository: "github.com/company/frontend",
    status: "Healthy",
    environments: ["Production", "Staging"],
    serviceCount: 2,
    lastDeployment: { version: "v2.1.0", timestamp: "1 hour ago" }
  },
  {
    id: "payment-service",
    name: "Payment Service",
    description: "Handles subscription processing and billing webhooks.",
    repository: "github.com/company/payment-service",
    status: "Healthy",
    environments: ["Production"],
    serviceCount: 1,
    lastDeployment: { version: "v1.0.4", timestamp: "5 days ago" }
  },
  {
    id: "notification-service",
    name: "Notification Service",
    description: "Email, SMS and Slack notification router.",
    repository: "github.com/company/notification-service",
    status: "Degraded",
    environments: ["Production", "Staging", "Development"],
    serviceCount: 3,
    lastDeployment: { version: "v0.9.1", timestamp: "12 hours ago" }
  },
  {
    id: "worker-service",
    name: "Worker Service",
    description: "Background job processing and task queues.",
    repository: "github.com/company/worker-service",
    status: "Healthy",
    environments: ["Production", "Staging"],
    serviceCount: 4,
    lastDeployment: { version: "v1.2.0", timestamp: "2 days ago" }
  },
  {
    id: "analytics-platform",
    name: "Analytics Platform",
    description: "Data ingestion, aggregation and business intelligence.",
    repository: "github.com/company/analytics-platform",
    status: "Deploying",
    environments: ["Staging", "Development"],
    serviceCount: 6,
    lastDeployment: { version: "v3.0.0-rc1", timestamp: "Just now" }
  },
  {
    id: "auth-service",
    name: "Authentication Service",
    description: "OAuth2 provider and identity management.",
    repository: "github.com/company/auth-service",
    status: "Healthy",
    environments: ["Production", "Staging", "Development"],
    serviceCount: 2,
    lastDeployment: { version: "v2.0.1", timestamp: "1 week ago" }
  },
  {
    id: "infra-controller",
    name: "Infrastructure Controller",
    description: "Kubernetes operator for infrastructure provisioning.",
    repository: "github.com/company/infra-controller",
    status: "Failed",
    environments: ["Production"],
    serviceCount: 1,
    lastDeployment: { version: "v0.5.2", timestamp: "3 hours ago" }
  }
];

export const mockProjectDetails: Record<string, ProjectDetail> = {
  "backend-api": {
    ...mockProjects[0],
    detailedEnvironments: [
      { id: "env-1", name: "Production", status: "Healthy", serviceCount: 8, version: "v1.4.2", updatedAt: "2 min ago", cluster: "production", region: "AWS / us-east-1" },
      { id: "env-2", name: "Staging", status: "Healthy", serviceCount: 8, version: "v1.5.0-rc.2", updatedAt: "14 min ago", cluster: "staging", region: "AWS / us-east-1" },
      { id: "env-3", name: "Development", status: "Healthy", serviceCount: 8, version: "v1.5.0-dev", updatedAt: "32 min ago", cluster: "dev", region: "AWS / us-east-1" },
    ],
    servicesList: [
      { id: "srv-1", name: "API Gateway", status: "Healthy", version: "v1.4.2", replicas: 3, latency: "42ms" },
      { id: "srv-2", name: "Authentication", status: "Healthy", version: "v2.1.0", replicas: 3, latency: "31ms" },
      { id: "srv-3", name: "Worker", status: "Degraded", version: "v0.9.8", replicas: 2, latency: "118ms" },
      { id: "srv-4", name: "Notification", status: "Healthy", version: "v1.2.1", replicas: 2, latency: "24ms" },
    ],
    deploymentsHistory: [
      { id: "dep-1", version: "v1.4.2", environment: "Production", status: "Successful", commit: "a83f21c", branch: "main", timestamp: "2 min ago", deployer: "CI/CD" },
      { id: "dep-2", version: "v1.4.1", environment: "Production", status: "Successful", commit: "19bc442", branch: "main", timestamp: "2 hours ago", deployer: "CI/CD" },
      { id: "dep-3", version: "v1.4.0", environment: "Production", status: "Failed", commit: "92ca118", branch: "main", timestamp: "1 day ago", deployer: "CI/CD" },
      { id: "dep-4", version: "v1.3.9", environment: "Staging", status: "Successful", commit: "8de331a", branch: "develop", timestamp: "2 days ago", deployer: "Alice M." },
    ],
    activityTimeline: [
      { id: "act-1", title: "Deployment v1.4.2 completed", environment: "Production", timestamp: "2 min ago", type: "deployment" },
      { id: "act-2", title: "Deployment v1.5.0-rc.2 started", environment: "Staging", timestamp: "14 min ago", type: "deployment" },
      { id: "act-3", title: "Environment configuration updated", environment: "Production", timestamp: "1 hour ago", type: "config" },
      { id: "act-4", title: 'Service "Worker" restarted', environment: "Production", timestamp: "3 hours ago", type: "service" },
    ],
    deploymentStats: [
      { name: "Mon", deployments: 2 },
      { name: "Tue", deployments: 4 },
      { name: "Wed", deployments: 3 },
      { name: "Thu", deployments: 6 },
      { name: "Fri", deployments: 5 },
      { name: "Sat", deployments: 1 },
      { name: "Sun", deployments: 3 },
    ]
  },
  "frontend": {
    ...mockProjects[1],
    detailedEnvironments: [
      { id: "env-1", name: "Production", status: "Healthy", serviceCount: 2, version: "v2.1.0", updatedAt: "1 hour ago", cluster: "vercel", region: "Global" },
      { id: "env-2", name: "Staging", status: "Healthy", serviceCount: 2, version: "v2.2.0-beta", updatedAt: "1 day ago", cluster: "vercel", region: "Global" },
    ],
    servicesList: [
      { id: "srv-1", name: "Web Application", status: "Healthy", version: "v2.1.0", replicas: 5, latency: "12ms" },
      { id: "srv-2", name: "Static Assets CDN", status: "Healthy", version: "v2.1.0", replicas: 12, latency: "5ms" },
    ],
    deploymentsHistory: [
      { id: "dep-1", version: "v2.1.0", environment: "Production", status: "Successful", commit: "f39b22a", branch: "main", timestamp: "1 hour ago", deployer: "Vercel" },
    ],
    activityTimeline: [
      { id: "act-1", title: "Deployment v2.1.0 completed", environment: "Production", timestamp: "1 hour ago", type: "deployment" },
    ],
    deploymentStats: [
      { name: "Mon", deployments: 5 },
      { name: "Tue", deployments: 2 },
      { name: "Wed", deployments: 1 },
      { name: "Thu", deployments: 4 },
      { name: "Fri", deployments: 3 },
      { name: "Sat", deployments: 0 },
      { name: "Sun", deployments: 1 },
    ]
  }
};
