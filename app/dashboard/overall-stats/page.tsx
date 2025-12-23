"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { generateOverallCampaignStats } from "@/lib/sandbox/campaign-stats";

export default function OverallStatsPage() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("client") || undefined;

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const data = generateOverallCampaignStats(clientName);
    setStats(data);
  }, [clientName]);

  if (!stats) {
    return <div className="min-h-screen bg-background p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sandbox">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sandbox
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Overall Campaign Stats</h1>
              <p className="text-sm text-muted-foreground">
                {stats.clientName} • Since Contract Start
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Contract Start</div>
              <div className="text-2xl font-bold">{new Date(stats.contractStartDate).toLocaleDateString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Email Sent</div>
              <div className="text-3xl font-bold text-primary">{stats.totalEmailSent.toLocaleString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Meetings Booked</div>
              <div className="text-3xl font-bold text-green-500">{stats.totalMeetingsBooked}</div>
            </div>
          </div>

          {/* Performance Metrics Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Performance Metrics</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Metric</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Count</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Emails Sent</td>
                    <td className="px-6 py-4 text-right">{stats.totalEmailSent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">100.00%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Delivered</td>
                    <td className="px-6 py-4 text-right">{stats.totalDelivered.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-green-500">
                      {((stats.totalDelivered / stats.totalEmailSent) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Opened</td>
                    <td className="px-6 py-4 text-right">{stats.totalOpened.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-blue-500">{stats.openRate.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Clicked</td>
                    <td className="px-6 py-4 text-right">{stats.totalClicked.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-purple-500">{stats.clickRate.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Replied</td>
                    <td className="px-6 py-4 text-right">{stats.totalReplied.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-yellow-500">{stats.replyRate.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Positive Replies</td>
                    <td className="px-6 py-4 text-right">{stats.totalPositiveReplies.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-green-500">{stats.positiveReplyRate.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-6 py-4 font-medium">Bounced</td>
                    <td className="px-6 py-4 text-right">{stats.totalBounced.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-red-500">{stats.bounceRate.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-t-2 border-border bg-muted/20 font-semibold">
                    <td className="px-6 py-4">Meetings Booked</td>
                    <td className="px-6 py-4 text-right">{stats.totalMeetingsBooked}</td>
                    <td className="px-6 py-4 text-right">
                      {stats.totalPositiveReplies > 0
                        ? `${((stats.totalMeetingsBooked / stats.totalPositiveReplies) * 100).toFixed(2)}%`
                        : "0.00%"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Email Funnel</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sent</span>
                    <span className="font-medium">{stats.totalEmailSent.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Delivered</span>
                    <span className="font-medium">{((stats.totalDelivered / stats.totalEmailSent) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.totalDelivered / stats.totalEmailSent) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Opened</span>
                    <span className="font-medium">{stats.openRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.openRate}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Replied</span>
                    <span className="font-medium">{stats.replyRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.replyRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Key Rates</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Open Rate</span>
                    <span className="font-semibold">{stats.openRate.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(stats.openRate, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Reply Rate</span>
                    <span className="font-semibold">{stats.replyRate.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${Math.min(stats.replyRate * 10, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Positive Reply Rate</span>
                    <span className="font-semibold">{stats.positiveReplyRate.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min(stats.positiveReplyRate * 10, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Bounce Rate</span>
                    <span className="font-semibold text-red-500">{stats.bounceRate.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${Math.min(stats.bounceRate * 20, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

