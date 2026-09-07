import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, ShieldAlert } from "lucide-react";

type IncidentSeverity = "High" | "Medium" | "Low";
type IncidentStatus = "Investigating" | "Identified" | "Monitoring" | "Resolved";

interface IncidentItem {
  id: string;
  incidentId: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  time: string;
}

const mockIncidents: IncidentItem[] = [
  { id: "i1", incidentId: "INC-102", title: "API latency increased", service: "Backend API", severity: "High", status: "Investigating", time: "12 min ago" },
  { id: "i2", incidentId: "INC-101", title: "Worker restart loop", service: "Worker Service", severity: "Medium", status: "Identified", time: "34 min ago" },
];

export function ActiveIncidents() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col transition-all hover:shadow-md h-full">
      <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold leading-none tracking-tight">Active Incidents</h3>
        </div>
      </div>
      <div className="flex-1 p-0">
        <div className="divide-y">
          {mockIncidents.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 h-full">
              <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
              No active incidents
            </div>
          ) : (
            mockIncidents.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col gap-3 p-4 px-6 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {item.incidentId}
                      </span>
                      <span className="font-medium text-sm leading-none">{item.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.service}
                    </div>
                  </div>
                  <Badge variant={item.severity === "High" ? "destructive" : "secondary"}>
                    {item.severity}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    {item.status}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
