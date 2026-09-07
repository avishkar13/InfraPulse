import { notFound } from "next/navigation";
import Link from "next/link";
import { mockProjectDetails } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ProjectStatusIndicator } from "@/components/projects/project-status";
import { EnvironmentOverview } from "@/components/projects/environment-overview";
import { ServiceList } from "@/components/projects/service-list";
import { ProjectDeployments } from "@/components/projects/project-deployments";
import { ProjectActivity } from "@/components/projects/project-activity";
import { ProjectDeploymentChart } from "@/components/projects/project-deployment-chart";
import { MoreHorizontal, Rocket, Box, Layers, FolderGit2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = mockProjectDetails[projectId];

  if (!project) {
    notFound();
  }

  // Summary counts
  const totalServices = project.servicesList.length;
  const totalDeployments = project.deploymentsHistory.length;
  const lastDeploy = project.deploymentsHistory[0];

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
                <ProjectStatusIndicator status={project.status} />
              </div>
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FolderGit2 className="h-4 w-4" />
                  <span>{project.repository}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span>{project.environments[0]}</span>
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
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground font-medium">Overall Status</span>
          <div className="flex items-center gap-2 mt-1">
            <ProjectStatusIndicator status={project.status} showLabel={false} />
            <span className="text-2xl font-bold">{project.status}</span>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground font-medium">Services</span>
          <div className="flex items-center gap-2 mt-1">
            <Box className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{totalServices}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground font-medium">Deployments</span>
          <div className="flex items-center gap-2 mt-1">
            <Rocket className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{totalDeployments}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground font-medium">Last Deployment</span>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{lastDeploy?.version || "—"}</span>
            </div>
            <span className="text-xs text-muted-foreground">{lastDeploy?.timestamp || "No deployments"}</span>
          </div>
        </div>
      </div>

      {/* Environment Overview */}
      <EnvironmentOverview environments={project.detailedEnvironments} />

      {/* Services & Deployment Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServiceList services={project.servicesList} />
        </div>
        <div className="lg:col-span-1">
          <ProjectDeploymentChart data={project.deploymentStats} />
        </div>
      </div>

      {/* Deployments & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectDeployments deployments={project.deploymentsHistory} />
        </div>
        <div className="lg:col-span-1">
          <ProjectActivity events={project.activityTimeline} />
        </div>
      </div>
    </div>
  );
}
