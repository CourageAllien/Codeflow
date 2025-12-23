import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";
import { WorkflowList } from "@/components/workflows/workflow-list";

export default function WorkflowsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Workflows</h1>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                + New Workflow
              </button>
            </div>
            <WorkflowList />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

