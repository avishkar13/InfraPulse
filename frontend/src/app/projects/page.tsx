"use client";

import { useState } from "react";
import { ProjectEnvironment } from "@/types/project";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectTable } from "@/components/projects/project-table";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [envFilter, setEnvFilter] = useState<string>("All");

  const filteredProjects = mockProjects.filter((proj) => {
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || proj.status === statusFilter;
    const matchesEnv = envFilter === "All" || proj.environments.includes(envFilter as ProjectEnvironment);
    return matchesSearch && matchesStatus && matchesEnv;
  });

  const healthyCount = mockProjects.filter(p => p.status === "Healthy").length;
  const degradedCount = mockProjects.filter(p => p.status === "Degraded" || p.status === "Failed").length;
  const deployingCount = mockProjects.filter(p => p.status === "Deploying").length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage applications, repositories, environments and deployments.
          </p>
        </div>
        <Button className="shrink-0 cursor-pointer p-4">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox value={mockProjects.length} label="Total Projects" />
        <MetricBox value={healthyCount} label="Healthy" valueClass="text-emerald-500" />
        <MetricBox value={degradedCount} label="Degraded / Failed" valueClass="text-amber-500" />
        <MetricBox value={deployingCount} label="Deploying" valueClass="text-blue-500" />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-card border rounded-lg p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "All")}>
              <SelectTrigger className="w-full sm:w-32 bg-transparent">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Degraded">Degraded</SelectItem>
                <SelectItem value="Deploying">Deploying</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={envFilter} onValueChange={(v) => setEnvFilter(v || "All")}>
              <SelectTrigger className="w-full sm:w-36 bg-transparent">
                <SelectValue placeholder="All Environments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Environments</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Staging">Staging</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto border rounded-md p-1 bg-muted/50">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-sm transition-colors",
              viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded-sm transition-colors",
              viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full p-12 text-center border rounded-xl border-dashed">
              <p className="text-muted-foreground">No projects found matching the criteria.</p>
            </div>
          )}
        </div>
      ) : (
        <ProjectTable projects={filteredProjects} />
      )}
    </div>
  );
}

function MetricBox({ value, label, valueClass }: { value: string | number, label: string, valueClass?: string }) {
  return (
    <div className="flex flex-col border rounded-lg bg-card p-3 shadow-sm">
      <div className={cn("text-2xl font-bold tracking-tight", valueClass)}>{value}</div>
      <div className="text-xs text-muted-foreground font-medium mt-1">{label}</div>
    </div>
  );
}
