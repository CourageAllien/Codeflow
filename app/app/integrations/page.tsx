import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";
import { IntegrationsHub } from "@/components/integrations/hub";

export default function IntegrationsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Integrations</h1>
            <IntegrationsHub />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

