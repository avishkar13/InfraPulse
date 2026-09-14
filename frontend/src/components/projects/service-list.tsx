import { ProjectService } from "@/types/project";
import { ProjectStatusIndicator } from "./project-status";
import { MoreHorizontal } from "lucide-react";
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
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm relative">
            <thead className="sticky top-0 z-10 shadow-sm">
              <tr className="border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/3">Service</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Description</th>
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
                  <td className="p-4 text-muted-foreground text-sm truncate max-w-[200px]">
                    {service.description || "—"}
                  </td>
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
