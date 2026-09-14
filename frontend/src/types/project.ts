export type ProjectStatus = "Healthy" | "Degraded" | "Deploying" | "Failed";
export type ProjectEnvironment = "Production" | "Staging" | "Development";
export type DeploymentStatus = "PENDING" | "RUNNING" | "SUCCESSFUL" | "FAILED" | "CANCELLED";

export interface ProjectDeployment {
  version: string;
  timestamp: string;
}

export interface Repository {
  id: string;
  provider: string;
  name: string;
  url: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
}

export interface Environment {
  id: string;
  name: string;
  slug: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  lastDeployment?: ProjectDeployment;
  id: string;
  organization: string; // uuid
  name: string;
  slug: string;
  description: string;
  status: string; // e.g. "active", "degraded", etc.
  repository: Repository | null;
  environments: Environment[];
  services_count: number;
  created_at: string;
  updated_at: string;
}



// Keeping the mock interfaces below for now

export interface EnvironmentDetail {
  id: string;
  name: ProjectEnvironment;
  status: ProjectStatus;
  serviceCount: number;
  version: string;
  updatedAt: string;
  cluster?: string;
  region?: string;
}

export interface ProjectService {
  id: string;
  environment: string;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  service: string;
  deployment_number: number;
  commit_sha: string;
  image: string;
  status: DeploymentStatus;
  started_at: string | null;
  finished_at: string | null;
  logs: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectActivityEvent {
  id: string;
  title: string;
  environment: ProjectEnvironment;
  timestamp: string;
  type: "deployment" | "config" | "service" | "alert";
}

export interface ProjectDetail extends Project {
  detailedEnvironments: EnvironmentDetail[];
  servicesList: ProjectService[];
  deploymentsHistory: Deployment[];
  activityTimeline: ProjectActivityEvent[];
  deploymentStats: { name: string; deployments: number }[];
}
