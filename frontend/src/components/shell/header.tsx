"use client";

import { MobileSidebar } from "./mobile-sidebar";
import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const getRouteTitle = () => {
    if (!pathname || pathname === '/') return 'Overview';
    const segment = pathname.split('/')[1];
    if (!segment) return 'Overview';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
      <MobileSidebar />
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="hidden lg:flex flex-1 text-sm text-muted-foreground font-medium">
          {getRouteTitle()}
        </div>
        
        {/* Interactive Search Bar */}
        <div className="flex-1 lg:max-w-md ml-auto lg:ml-0 flex items-center justify-end lg:justify-center">
          <div className="relative w-full hidden lg:flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="w-full h-9 rounded-md border border-input bg-transparent pl-9 pr-12 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <kbd className="absolute right-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-8 w-8 rounded-md cursor-pointer border ml-2">
            <AvatarImage src="" alt="@user" />
            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
