"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Workspace {
  id: string;
  name: string;
  clientName?: string;
  activeCampaigns?: number;
  meetingsPerMonth?: number;
}

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  currentWorkspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
  onAddWorkspace: () => void;
}

export function WorkspaceSelector({
  workspaces,
  currentWorkspaceId,
  onWorkspaceChange,
  onAddWorkspace,
}: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md hover:bg-accent transition-colors"
      >
        <span className="font-medium">
          {currentWorkspace?.name || "Select Workspace"}
        </span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20">
            <div className="p-2">
              {workspaces.map(workspace => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    onWorkspaceChange(workspace.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors",
                    workspace.id === currentWorkspaceId && "bg-primary/10 text-primary"
                  )}
                >
                  <div className="font-medium">{workspace.name}</div>
                  {workspace.clientName && (
                    <div className="text-xs text-muted-foreground">
                      {workspace.clientName}
                    </div>
                  )}
                  {workspace.activeCampaigns !== undefined && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {workspace.activeCampaigns} campaigns, {workspace.meetingsPerMonth || 0} meetings/mo
                    </div>
                  )}
                </button>
              ))}
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={() => {
                    onAddWorkspace();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors text-muted-foreground"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Client</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

