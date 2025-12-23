"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member" | "viewer";
}

interface TeamManagementProps {
  members: TeamMember[];
  onAddMember: (email: string, role: TeamMember["role"]) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateRole: (memberId: string, role: TeamMember["role"]) => void;
}

export function TeamManagement({
  members,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
}: TeamManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamMember["role"]>("member");

  const handleAddMember = () => {
    if (newMemberEmail) {
      onAddMember(newMemberEmail, newMemberRole);
      setNewMemberEmail("");
      setNewMemberRole("member");
      setShowAddForm(false);
    }
  };

  const getRoleBadgeColor = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/20 text-purple-500";
      case "admin":
        return "bg-blue-500/20 text-blue-500";
      case "member":
        return "bg-green-500/20 text-green-500";
      case "viewer":
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Team Members</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          variant="outline"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={newMemberEmail}
              onChange={e => setNewMemberEmail(e.target.value)}
              placeholder="team@example.com"
              className="w-full px-3 py-2 bg-background border border-border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={newMemberRole}
              onChange={e => setNewMemberRole(e.target.value as TeamMember["role"])}
              className="w-full px-3 py-2 bg-background border border-border rounded-md"
            >
              <option value="viewer">Viewer</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddMember} size="sm">
              Invite
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setNewMemberEmail("");
              }}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {members.map(member => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={member.role}
                onChange={e => onUpdateRole(member.id, e.target.value as TeamMember["role"])}
                className="px-2 py-1 text-xs bg-background border border-border rounded"
                disabled={member.role === "owner"}
              >
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
              {member.role !== "owner" && (
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="p-1 text-destructive hover:bg-destructive/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

