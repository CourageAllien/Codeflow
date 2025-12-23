"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Terminal as TerminalIcon, 
  BarChart3, 
  Mail, 
  Shield, 
  Workflow,
  Settings,
  Zap,
  Users
} from "lucide-react";
import { WorkspaceSelector } from "@/components/workspaces/workspace-selector";

const navItems = [
  { href: "/app", label: "Terminal", icon: TerminalIcon },
  { href: "/app/campaigns", label: "Campaigns", icon: BarChart3 },
  { href: "/app/replies", label: "Replies", icon: Mail },
  { href: "/app/deliverability", label: "Deliverability", icon: Shield },
  { href: "/app/workflows", label: "Workflows", icon: Workflow },
  { href: "/app/integrations", label: "Integrations", icon: Zap },
  { href: "/app/team", label: "Team", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

const mockWorkspaces = [
  { id: "1", name: "Acme Corp", clientName: "Acme Corp", activeCampaigns: 3, meetingsPerMonth: 12 },
  { id: "2", name: "TechStart Inc", clientName: "TechStart Inc", activeCampaigns: 2, meetingsPerMonth: 8 },
  { id: "3", name: "GrowthCo", clientName: "GrowthCo", activeCampaigns: 5, meetingsPerMonth: 22 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentWorkspaceId, setCurrentWorkspaceId] = React.useState("1");

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">ColdFlow</h1>
        <p className="text-xs text-muted-foreground mt-1">v1.0.0</p>
      </div>

      <div className="p-4 border-b border-border">
        <WorkspaceSelector
          workspaces={mockWorkspaces}
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={setCurrentWorkspaceId}
          onAddWorkspace={() => console.log("Add workspace")}
        />
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/app" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-3 py-2 text-xs text-muted-foreground bg-accent/20 rounded-md">
          🧪 Sandbox Mode
        </div>
      </div>
    </div>
  );
}

