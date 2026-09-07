import { Project } from "@/types/project";
import { ProjectStatusIndicator } from "./project-status";
import { FolderGit2, Box, Server, Clock } from "lucide-react";
import Link from "next/link";
// import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link 
      href={`/projects/${project.id}`}
      className="flex flex-col justify-between rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/20 transition-all p-5 h-full group"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Box className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-base tracking-tight group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </div>
          {/* <ProjectStatusIndicator status={project.status} showIcon={false} className="h-2 w-2 rounded-full" /> */}
        </div>

        {/* Description & Repo */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span className="truncate">{project.repository}</span>
          </div>
        </div>

        {/* Environments & Status */}
        <div className="flex items-center gap-4 text-sm mt-2 border-l-2 pl-3" style={{ borderColor: getStatusColor(project.status) }}>
          <div className="font-medium">
            {project.environments.includes("Production") ? "Production" : project.environments[0] || "No environment"}
          </div>
          <ProjectStatusIndicator status={project.status} />
        </div>

        {/* Deployment Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2 mt-2">
          <Clock className="h-3.5 w-3.5" />
          {project.lastDeployment ? (
            <span className="truncate">
              {project.lastDeployment.version} • {project.lastDeployment.timestamp}
            </span>
          ) : (
            <span>No deployments yet</span>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-6 pt-4 border-t">
        <div className="flex items-center gap-1.5">
          <Server className="h-3.5 w-3.5" />
          <span>{project.environments.length} {project.environments.length === 1 ? 'environment' : 'environments'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Box className="h-3.5 w-3.5" />
          <span>{project.serviceCount} {project.serviceCount === 1 ? 'service' : 'services'}</span>
        </div>
      </div>
    </Link>
  );
}

function getStatusColor(status: string) {
  switch(status) {
    case "Healthy": return "var(--emerald-500, #10b981)";
    case "Degraded": return "var(--amber-500, #f59e0b)";
    case "Failed": return "var(--red-500, #ef4444)";
    case "Deploying": return "var(--blue-500, #3b82f6)";
    default: return "var(--muted-foreground)";
  }
}
