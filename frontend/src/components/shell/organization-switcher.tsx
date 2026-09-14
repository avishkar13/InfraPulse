"use client";

import { useOrganization } from "@/providers/org-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function OrganizationSwitcher() {
  const { organizations, currentOrganization, setCurrentOrganization, isLoading } = useOrganization();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 border-b h-[60px]">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading orgs...</span>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 border-b h-[60px]">
        <span className="text-sm text-muted-foreground">No organizations</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-white/5">
      <Select
        value={currentOrganization?.id || ""}
        onValueChange={(val) => {
          const org = organizations.find((o) => o.id === val);
          if (org) setCurrentOrganization(org);
        }}
      >
        <SelectTrigger className="w-full bg-transparent border-0 shadow-none focus:ring-0 p-0 h-auto hover:bg-muted/50 rounded-md transition-colors data-[state=open]:bg-muted/50">
          <div className="flex items-center gap-2 w-full px-2 py-1.5">
            <Avatar className="h-6 w-6 rounded-md shrink-0">
              {currentOrganization?.avatar && <AvatarImage src={currentOrganization.avatar} alt={currentOrganization.name} />}
              <AvatarFallback className="rounded-md bg-primary/20 text-primary text-xs">
                {currentOrganization?.name.substring(0, 2).toUpperCase() || "OR"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-foreground">
              {currentOrganization?.name || "Select Organization"}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent align="start" className="w-[calc(100vw-32px)] sm:w-[240px]">
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 rounded-md">
                  {org.avatar && <AvatarImage src={org.avatar} alt={org.name} />}
                  <AvatarFallback className="rounded-md bg-primary/20 text-primary text-[10px]">
                    {org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{org.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
