import { EnvironmentDetail } from "@/types/project";
import { ProjectStatusIndicator } from "./project-status";
import { Server, Activity, Clock, Box } from "lucide-react";

interface EnvironmentOverviewProps {
  environments: EnvironmentDetail[];
}

export function EnvironmentOverview({ environments }: EnvironmentOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">Environment Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {environments.map((env) => (
          <div 
            key={env.id} 
            className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm hover:border-emerald-500/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                <h3 className="font-semibold">{env.name}</h3>
              </div>
              <ProjectStatusIndicator status={env.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm mt-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Box className="h-3.5 w-3.5" />
                <span>{env.serviceCount} services</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Activity className="h-3.5 w-3.5" />
                <span className="truncate">{env.version}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated {env.updatedAt}</span>
              </div>
            </div>

            {(env.cluster || env.region) && (
              <div className="mt-2 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                {env.cluster && <span>Cluster: {env.cluster}</span>}
                {env.region && <span>{env.region}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
