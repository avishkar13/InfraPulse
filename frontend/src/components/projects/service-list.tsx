import { ProjectService } from "@/types/project";
import { ProjectStatusIndicator } from "./project-status";
import { Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceListProps {
  services: ProjectService[];
}

export function ServiceList({ services }: ServiceListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Services</h2>
        <Button variant="outline" size="sm">Manage Services</Button>
      </div>
      
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/3">Service</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Version</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Replicas</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Latency</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr 
                  key={service.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <td className="p-4 font-medium">{service.name}</td>
                  <td className="p-4">
                    <ProjectStatusIndicator status={service.status} />
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[100px] inline-block">{service.version}</span>
                      <Copy className="h-3 w-3 text-transparent group-hover:text-muted-foreground hover:!text-foreground transition-colors cursor-pointer" />
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{service.replicas}</td>
                  <td className="p-4 text-muted-foreground">{service.latency || "—"}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
