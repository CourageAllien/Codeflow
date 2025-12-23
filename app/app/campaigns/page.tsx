import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";
import { CampaignList } from "@/components/campaigns/campaign-list";
import { generateSandboxCampaigns } from "@/lib/sandbox/campaigns";

export default function CampaignsPage() {
  const campaigns = generateSandboxCampaigns();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                + New Campaign
              </button>
            </div>
            <CampaignList campaigns={campaigns} />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

