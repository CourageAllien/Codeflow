"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";
import { TeamManagement } from "@/components/workspaces/team-management";

const mockMembers = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    role: "owner" as const,
  },
  {
    id: "2",
    email: "sarah@example.com",
    name: "Sarah Chen",
    role: "admin" as const,
  },
  {
    id: "3",
    email: "mike@example.com",
    name: "Mike Johnson",
    role: "member" as const,
  },
];

export default function TeamPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Team Management</h1>
            <TeamManagement
              members={mockMembers}
              onAddMember={(email, role) => {
                console.log("Add member:", email, role);
              }}
              onRemoveMember={(id) => {
                console.log("Remove member:", id);
              }}
              onUpdateRole={(id, role) => {
                console.log("Update role:", id, role);
              }}
            />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

