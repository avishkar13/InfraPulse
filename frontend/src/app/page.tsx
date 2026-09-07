import { StatsCard } from "@/components/dashboard/stats-card";
import { DeploymentActivity } from "@/components/dashboard/deployment-activity";
import { SystemHealth } from "@/components/dashboard/system-health";
import { RecentDeployments } from "@/components/dashboard/recent-deployments";
import { ActiveIncidents } from "@/components/dashboard/active-incidents";
import { FolderGit2, Rocket, Server, AlertTriangle } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Cloud infrastructure, deployments, services and reliability at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          All systems operational
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard 
          title="Projects" 
          value="12" 
          description="+2 this month" 
          icon={<FolderGit2 />} 
        />
        <StatsCard 
          title="Deployments" 
          value="38" 
          description="+14% vs last month" 
          icon={<Rocket />} 
          status="success"
        />
        <StatsCard 
          title="Services" 
          value="24" 
          description="23 healthy, 1 degraded" 
          icon={<Server />} 
          status="warning"
        />
        <StatsCard 
          title="Active Incidents" 
          value="2" 
          description="1 high severity" 
          icon={<AlertTriangle />} 
          status="destructive"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column (Spans 2 on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
          <DeploymentActivity />
          <RecentDeployments />
        </div>
        
        {/* Right Column (Spans 1 on large screens) */}
        <div className="flex flex-col gap-4 md:gap-6">
          <SystemHealth />
          <ActiveIncidents />
        </div>
      </div>
    </div>
  );
}
