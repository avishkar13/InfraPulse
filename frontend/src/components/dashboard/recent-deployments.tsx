import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DeploymentStatus = "Successful" | "Deploying" | "Failed" | "Pending";

interface DeploymentItem {
  id: string;
  service: string;
  version: string;
  environment: string;
  status: DeploymentStatus;
  time: string;
}

const mockDeployments: DeploymentItem[] = [
  { id: "d1", service: "Backend API", version: "v1.4.2", environment: "production", status: "Successful", time: "2 min ago" },
  { id: "d2", service: "Frontend", version: "v2.1.0", environment: "production", status: "Successful", time: "8 min ago" },
  { id: "d3", service: "Worker", version: "v0.9.8", environment: "staging", status: "Deploying", time: "14 min ago" },
  { id: "d4", service: "Notification Service", version: "v1.2.1", environment: "production", status: "Failed", time: "21 min ago" },
];

export function RecentDeployments() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col transition-all hover:shadow-md h-full">
      <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b">
        <h3 className="font-semibold leading-none tracking-tight">Recent Deployments</h3>
      </div>
      <div className="flex-1 p-0">
        <div className="divide-y">
          {mockDeployments.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium text-sm flex items-center gap-2">
                  {item.service}
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {item.version}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.environment}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {item.status === "Successful" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {item.status === "Deploying" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                  {item.status === "Failed" && <XCircle className="h-4 w-4 text-red-500" />}
                  {item.status === "Pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                  <span className={cn(
                    "text-sm",
                    item.status === "Successful" ? "text-emerald-500" :
                    item.status === "Deploying" ? "text-blue-500" :
                    item.status === "Failed" ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground w-20 text-right">
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
