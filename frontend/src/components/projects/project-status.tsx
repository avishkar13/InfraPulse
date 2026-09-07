import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types/project";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface ProjectStatusIndicatorProps {
  status: ProjectStatus;
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
}

export function ProjectStatusIndicator({ 
  status, 
  className,
  showIcon = true,
  showLabel = true
}: ProjectStatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm font-medium", className)}>
      {showIcon && (
        <>
          {status === "Healthy" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          {status === "Degraded" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
          {status === "Failed" && <XCircle className="h-4 w-4 text-red-500" />}
          {status === "Deploying" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
        </>
      )}
      {showLabel && (
        <span className={cn(
          status === "Healthy" && "text-emerald-500",
          status === "Degraded" && "text-amber-500",
          status === "Failed" && "text-red-500",
          status === "Deploying" && "text-blue-500"
        )}>
          {status}
        </span>
      )}
    </div>
  );
}
