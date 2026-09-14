"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectStatusIndicator } from "@/components/projects/project-status";
import { EnvironmentOverview } from "@/components/projects/environment-overview";
import { ServiceList } from "@/components/projects/service-list";
import { ProjectDeployments } from "@/components/projects/project-deployments";
import { ProjectActivity } from "@/components/projects/project-activity";
import { ProjectDeploymentChart } from "@/components/projects/project-deployment-chart";
import { MoreHorizontal, Rocket, Box, Layers, FolderGit2, Loader2, AlertCircle } from "lucide-react";
import { Project, Environment, ProjectService, ProjectStatus, ProjectEnvironment, Deployment } from "@/types/project";
import { apiClient } from "@/api/client";
import { PROJECTS, PROJECT_ENVIRONMENTS, PROJECT_SERVICES, SERVICE_DEPLOYMENTS, DEPLOYMENT_CANCEL } from "@/api/endpoints";
import { mockProjectDetails } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = use(params);
  
  const [project, setProject] = useState<Project | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [services, setServices] = useState<ProjectService[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      setIsLoading(true);
      try {
        const [projRes, envsRes, svcsRes] = await Promise.all([
          apiClient.get<Project>(`${PROJECTS}${projectId}/`),
          apiClient.get<Environment[]>(PROJECT_ENVIRONMENTS(projectId)),
          apiClient.get<ProjectService[]>(PROJECT_SERVICES(projectId))
        ]);
        
        setProject(projRes.data);
        setEnvironments(envsRes.data);
        
        const fetchedServices = svcsRes.data;
        setServices(fetchedServices);

        // Fetch deployments for all services concurrently
        const depsPromises = fetchedServices.map(s => apiClient.get<Deployment[]>(SERVICE_DEPLOYMENTS(s.id)));
        const depsResponses = await Promise.all(depsPromises);
        const allDeployments = depsResponses.flatMap(res => res.data).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setDeployments(allDeployments);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err && (err as { response?: { status?: number } }).response?.status === 404) {
          setError("404");
        } else if (err instanceof Error) {
          setError(err.message || "Failed to load project details");
        } else {
          setError("Failed to load project details");
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectData();
  }, [projectId]);

  const handleCancelDeployment = async (id: string) => {
    try {
      setIsCancelling(id);
      await apiClient.post(DEPLOYMENT_CANCEL(id));
      setDeployments(prev => prev.map(d => d.id === id ? { ...d, status: "CANCELLED" } : d));
    } catch (err: unknown) {
      console.error("Failed to cancel deployment", err);
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error === "404") {
    notFound();
  }

  if (error || !project) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center w-full gap-4">
        <p className="text-red-500 font-medium">{error || "Project not found"}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Summary counts
  const totalServices = services.length;
  const totalDeployments = deployments.length;
  const lastDeploy = deployments[0];

  const mockData = mockProjectDetails["1"] || Object.values(mockProjectDetails)[0];

  // Map environments to detailed environments for the component
  const detailedEnvironments = environments.map(e => ({
    id: e.id,
    name: e.name as ProjectEnvironment,
    status: "Healthy" as ProjectStatus, // mock for now
    serviceCount: services.filter(s => s.environment === e.id).length,
    version: "v1.0.0", // mock for now
    updatedAt: e.updated_at,
  }));


  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-foreground">{project.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Box className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <ProjectStatusIndicator status={project.status as ProjectStatus} />
              </div>
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FolderGit2 className="h-4 w-4" />
                  <span>{project.repository?.name || "No repository"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span>{environments[0]?.name || "No environment"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 lg:mt-0 mt-2">
            <Button className="gap-2">
              <Rocket className="h-4 w-4" />
              Deploy
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Health Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1 relative overflow-hidden">
          <span className="text-sm text-muted-foreground font-medium">Overall Status</span>
          <div className="flex items-center gap-2 mt-1">
            <ProjectStatusIndicator status={project.status as ProjectStatus} showLabel={false} />
            <span className="text-2xl font-bold">{project.status}</span>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1 relative overflow-hidden">
          <span className="text-sm text-muted-foreground font-medium">Services</span>
          <div className="flex items-center gap-2 mt-1">
            <Box className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{totalServices}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1 relative overflow-hidden">
          <span className="text-sm text-muted-foreground font-medium">Deployments</span>
          <div className="flex items-center gap-2 mt-1">
            <Rocket className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{totalDeployments}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1 relative overflow-hidden">
          <span className="text-sm text-muted-foreground font-medium">Last Deployment</span>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{lastDeploy ? `#${lastDeploy.deployment_number}` : "—"}</span>
            </div>
            <span className="text-xs text-muted-foreground">{lastDeploy ? new Date(lastDeploy.created_at).toLocaleString() : "No deployments"}</span>
          </div>
        </div>
      </div>

      {/* Environment Overview */}
      <EnvironmentOverview environments={detailedEnvironments} />

      {/* Services & Deployment Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServiceList services={services} />
        </div>
        <div className="lg:col-span-1 relative">
          <MockBadge overlay />
          <ProjectDeploymentChart data={mockData.deploymentStats} />
        </div>
      </div>

      {/* Deployments & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectDeployments deployments={deployments} onCancel={handleCancelDeployment} isCancelling={isCancelling} />
        </div>
        <div className="lg:col-span-1 relative">
          <MockBadge overlay />
          <ProjectActivity events={mockData.activityTimeline} />
        </div>
      </div>
    </div>
  );
}

function MockBadge({ overlay }: { overlay?: boolean }) {
  return (
    <div className={cn(
      "absolute flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm z-10",
      overlay ? "top-2 right-2" : "top-2 right-2"
    )}>
      <AlertCircle className="h-3 w-3" />
      Mock
    </div>
  );
}
