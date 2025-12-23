"use client";

import { SandboxCampaign } from "@/lib/sandbox/campaigns";
import { cn } from "@/lib/utils";

interface CampaignListProps {
  campaigns: SandboxCampaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "paused":
        return "text-yellow-500";
      case "draft":
        return "text-gray-500";
      case "completed":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "🟢";
      case "paused":
        return "🟡";
      case "draft":
        return "⚪";
      case "completed":
        return "✓";
      default:
        return "⚪";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <select className="px-3 py-2 bg-card border border-border rounded-md text-sm">
          <option>All</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Draft</option>
          <option>Completed</option>
        </select>
        <input
          type="text"
          placeholder="Search campaigns..."
          className="flex-1 px-3 py-2 bg-card border border-border rounded-md text-sm"
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Campaign</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Sent</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Opens</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Replies</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Meetings</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => {
              const openRate = campaign.stats.sent > 0
                ? ((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(1)
                : "0";
              const replyRate = campaign.stats.sent > 0
                ? ((campaign.stats.replied / campaign.stats.sent) * 100).toFixed(1)
                : "0";

              return (
                <tr
                  key={campaign.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{campaign.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("flex items-center gap-2", getStatusColor(campaign.status))}>
                      <span>{getStatusIcon(campaign.status)}</span>
                      <span className="capitalize">{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {campaign.stats.sent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{openRate}%</td>
                  <td className="px-4 py-3 text-sm">{replyRate}%</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {campaign.stats.meetings_booked}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Stats (Last 7 Days)</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Emails Sent</div>
            <div className="text-2xl font-bold">2,847</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Avg Open Rate</div>
            <div className="text-2xl font-bold">54.2%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Avg Reply Rate</div>
            <div className="text-2xl font-bold">3.8%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Positive Replies</div>
            <div className="text-2xl font-bold">67</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Meetings Booked</div>
            <div className="text-2xl font-bold">14</div>
          </div>
        </div>
      </div>
    </div>
  );
}

