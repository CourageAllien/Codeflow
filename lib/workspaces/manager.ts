// Workspace management for multi-client support

export interface Workspace {
  id: string;
  name: string;
  clientName?: string;
  settings?: Record<string, any>;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member" | "viewer";
  workspaceId?: string;
}

export class WorkspaceManager {
  private currentWorkspaceId: string | null = null;
  private workspaces: Workspace[] = [];
  private teamMembers: TeamMember[] = [];

  setCurrentWorkspace(workspaceId: string) {
    this.currentWorkspaceId = workspaceId;
  }

  getCurrentWorkspace(): Workspace | null {
    if (!this.currentWorkspaceId) return null;
    return this.workspaces.find(w => w.id === this.currentWorkspaceId) || null;
  }

  getWorkspaces(): Workspace[] {
    return this.workspaces;
  }

  addWorkspace(workspace: Workspace) {
    this.workspaces.push(workspace);
  }

  getTeamMembers(workspaceId?: string): TeamMember[] {
    if (workspaceId) {
      return this.teamMembers.filter(m => m.workspaceId === workspaceId);
    }
    return this.teamMembers;
  }

  addTeamMember(member: TeamMember) {
    this.teamMembers.push(member);
  }

  removeTeamMember(memberId: string) {
    this.teamMembers = this.teamMembers.filter(m => m.id !== memberId);
  }

  updateTeamMemberRole(memberId: string, role: TeamMember["role"]) {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (member) {
      member.role = role;
    }
  }
}

