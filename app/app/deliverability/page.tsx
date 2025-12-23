import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";
import { DeliverabilityDashboard } from "@/components/deliverability/dashboard";

export default function DeliverabilityPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Deliverability</h1>
            <DeliverabilityDashboard />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

