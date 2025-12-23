import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground">Settings page coming soon...</p>
            </div>
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

