import { ProjectActivityEvent } from "@/types/project";
import { Rocket, Settings2, Box, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectActivityProps {
  events: ProjectActivityEvent[];
}

export function ProjectActivity({ events }: ProjectActivityProps) {
  const getEventIcon = (type: ProjectActivityEvent["type"]) => {
    switch (type) {
      case "deployment": return Rocket;
      case "config": return Settings2;
      case "service": return Box;
      case "alert": return AlertTriangle;
    }
  };

  const getEventColor = (type: ProjectActivityEvent["type"]) => {
    switch (type) {
      case "deployment": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "config": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "service": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "alert": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">Activity</h2>
      <div className="rounded-lg border bg-card p-4">
        <div className="relative border-l border-muted ml-3 space-y-6 pb-2">
          {events.map((event) => {
            const Icon = getEventIcon(event.type);
            const colorClass = getEventColor(event.type);

            return (
              <div key={event.id} className="relative pl-6">
                <div className={cn("absolute -left-3.5 top-1 flex h-7 w-7 items-center justify-center rounded-full border", colorClass)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                  <span className="font-medium">{event.title}</span>
                  <span className="text-xs text-muted-foreground">{event.environment}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
