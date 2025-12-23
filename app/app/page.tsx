import { Terminal } from "@/components/terminal/terminal";
import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";

export default function AppPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Terminal />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

