import { cn } from "@/lib/utils";

type ServiceHealthStatus = "Healthy" | "Degraded" | "Failed";

interface HealthItem {
  id: string;
  name: string;
  status: ServiceHealthStatus;
  latency?: string;
}

const mockHealthData: HealthItem[] = [
  { id: "h1", name: "API Gateway", status: "Healthy", latency: "42ms" },
  { id: "h2", name: "Kubernetes", status: "Healthy" },
  { id: "h3", name: "PostgreSQL", status: "Healthy", latency: "18ms" },
  { id: "h4", name: "Redis", status: "Healthy", latency: "4ms" },
  { id: "h5", name: "Monitoring", status: "Healthy" },
];

export function SystemHealth() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col transition-all hover:shadow-md h-full">
      <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b">
        <h3 className="font-semibold leading-none tracking-tight">System Health</h3>
      </div>
      <div className="flex-1 p-0">
        <div className="divide-y">
          {mockHealthData.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-32 font-medium text-sm">
                  {item.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    item.status === "Healthy" ? "bg-emerald-500" : 
                    item.status === "Degraded" ? "bg-amber-500" : "bg-red-500"
                  )} />
                  {item.status}
                </div>
              </div>
              {item.latency && (
                <div className="text-sm font-mono text-muted-foreground">
                  {item.latency}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
