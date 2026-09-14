// Auth Endpoints
export const AUTH_LOGIN = "auth/login/";
export const AUTH_REGISTER = "auth/register/";
export const AUTH_REFRESH = "auth/refresh/";
export const AUTH_ME = "auth/me/";

// Organization Endpoints
export const ORGS = "organizations/";

// Project Endpoints
export const PROJECTS = "projects/";
export const PROJECT_ENVIRONMENTS = (projectId: string) => `projects/${projectId}/environments/`;
export const PROJECT_SERVICES = (projectId: string) => `projects/${projectId}/services/`;

// Deployment Endpoints
export const SERVICE_DEPLOYMENTS = (serviceId: string) => `projects/services/${serviceId}/deployments/`;
export const DEPLOYMENT_DETAIL = (id: string) => `projects/deployments/${id}/`;
export const DEPLOYMENT_CANCEL = (id: string) => `projects/deployments/${id}/cancel/`;
export const DEPLOYMENT_LOGS = (id: string) => `projects/deployments/${id}/logs/`;
