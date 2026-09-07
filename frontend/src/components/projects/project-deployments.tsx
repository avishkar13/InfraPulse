import { Deployment } from "@/types/project";
import { GitCommit, ExternalLink, CheckCircle2, XCircle, Loader2, XOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectDeploymentsProps {
  deployments: Deployment[];
}

export function ProjectDeployments({ deployments }: ProjectDeploymentsProps) {
  const getStatusConfig = (status: Deployment["status"]) => {
    switch (status) {
      case "Successful":
        return { icon: CheckCircle2, color: "text-emerald-500" };
      case "Failed":
        return { icon: XCircle, color: "text-red-500" };
      case "Deploying":
        return { icon: Loader2, color: "text-blue-500 animate-spin" };
      case "Cancelled":
        return { icon: XOctagon, color: "text-muted-foreground" };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Recent Deployments</h2>
      </div>

      <div className="flex flex-col gap-3">
        {deployments.map((deployment) => {
          const StatusIcon = getStatusConfig(deployment.status).icon;
          const statusColor = getStatusConfig(deployment.status).color;

          return (
            <div 
              key={deployment.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className={cn("mt-0.5 sm:mt-0 flex-shrink-0", statusColor)}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{deployment.version}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {deployment.environment}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={cn("font-medium", statusColor)}>{deployment.status}</span>
                    <span>•</span>
                    <span>{deployment.timestamp}</span>
                    {deployment.deployer && (
                      <>
                        <span>•</span>
                        <span>by {deployment.deployer}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground sm:pl-4 sm:border-l pl-9">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="h-4 w-4" />
                  <span className="font-mono">{deployment.commit.substring(0, 7)}</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-muted/50 font-mono text-xs">
                  {deployment.branch}
                </div>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
