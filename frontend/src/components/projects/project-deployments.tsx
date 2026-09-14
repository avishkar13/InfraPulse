import { Deployment } from "@/types/project";
import { GitCommit, ExternalLink, CheckCircle2, XCircle, Loader2, XOctagon, StopCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectDeploymentsProps {
  deployments: Deployment[];
  onCancel?: (id: string) => void;
  isCancelling?: string | null;
}

export function ProjectDeployments({ deployments, onCancel, isCancelling }: ProjectDeploymentsProps) {
  const getStatusConfig = (status: Deployment["status"]) => {
    switch (status) {
      case "SUCCESSFUL":
        return { icon: CheckCircle2, color: "text-emerald-500" };
      case "FAILED":
        return { icon: XCircle, color: "text-red-500" };
      case "RUNNING":
        return { icon: RefreshCw, color: "text-blue-500 animate-spin" };
      case "PENDING":
        return { icon: Loader2, color: "text-amber-500 animate-spin" };
      case "CANCELLED":
        return { icon: XOctagon, color: "text-muted-foreground" };
      default:
        return { icon: Loader2, color: "text-muted-foreground" };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Recent Deployments</h2>
      </div>

      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
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
                    <span className="font-semibold">#{deployment.deployment_number}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {deployment.image || "No image"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={cn("font-medium", statusColor)}>{deployment.status}</span>
                    <span>•</span>
                    <span>{new Date(deployment.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground sm:pl-4 sm:border-l pl-9">
                {deployment.commit_sha && (
                  <div className="flex items-center gap-1.5">
                    <GitCommit className="h-4 w-4" />
                    <span className="font-mono">{deployment.commit_sha.substring(0, 7)}</span>
                  </div>
                )}
                
                {(deployment.status === "PENDING" || deployment.status === "RUNNING") && onCancel && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCancel(deployment.id);
                    }}
                    disabled={isCancelling === deployment.id}
                  >
                    {isCancelling === deployment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <StopCircle className="h-4 w-4 mr-1.5" />
                        Cancel
                      </>
                    )}
                  </Button>
                )}
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
