import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  status?: "default" | "success" | "warning" | "destructive";
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  status = "default",
}: StatsCardProps) {
  const statusColors = {
    default: "text-muted-foreground",
    success: "text-emerald-500",
    warning: "text-amber-500",
    destructive: "text-red-500",
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground h-4 w-4">{icon}</div>}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className={cn("text-xs", statusColors[status])}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
