export type ProjectStatus = "Healthy" | "Degraded" | "Deploying" | "Failed";
export type ProjectEnvironment = "Production" | "Staging" | "Development";
export type DeploymentStatus = "Successful" | "Deploying" | "Failed" | "Cancelled";

export interface ProjectDeployment {
  version: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository: string;
  status: ProjectStatus;
  environments: ProjectEnvironment[];
  serviceCount: number;
  lastDeployment?: ProjectDeployment;
}

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
  name: string;
  status: ProjectStatus;
  version: string;
  replicas: number;
  latency?: string;
}

export interface Deployment {
  id: string;
  version: string;
  environment: ProjectEnvironment;
  status: DeploymentStatus;
  commit: string;
  branch: string;
  timestamp: string;
  deployer?: string;
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
