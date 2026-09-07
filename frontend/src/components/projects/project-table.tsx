import { Project } from "@/types/project";
import { ProjectStatusIndicator } from "./project-status";
import Link from "next/link";
import { Box } from "lucide-react";

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Repository</th>
              <th className="px-4 py-3 font-medium text-center">Environments</th>
              <th className="px-4 py-3 font-medium text-center">Services</th>
              <th className="px-4 py-3 font-medium">Last Deployment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
                  >
                    <Box className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <ProjectStatusIndicator status={project.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {project.repository.replace("github.com/", "")}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {project.environments.length}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {project.serviceCount}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {project.lastDeployment ? (
                    <div className="flex flex-col">
                      <span className="font-mono text-xs">{project.lastDeployment.version}</span>
                      <span className="text-xs">{project.lastDeployment.timestamp}</span>
                    </div>
                  ) : (
                    <span className="text-xs">Never</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No projects found matching the criteria.
          </div>
        )}
      </div>
    </div>
  );
}
