"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { generateACTLTracker } from "@/lib/sandbox/actl-tracker";

export default function ACTLTrackerPage() {
  const searchParams = useSearchParams();
  const month = searchParams.get("month") || undefined;
  const date = searchParams.get("date") ? parseInt(searchParams.get("date")!) : undefined;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

  const [trackerData, setTrackerData] = useState<any>(null);

  useEffect(() => {
    // Always generate data, even if parameters are missing (will use defaults)
    const data = generateACTLTracker(month || undefined, date, year);
    setTrackerData(data);
  }, [month, date, year]);

  if (!trackerData) {
    return <div className="min-h-screen bg-background p-8">Loading...</div>;
  }

  const getCompletionColor = (rate: number) => {
    if (rate >= 98) return "bg-green-500/20 text-green-500 border-green-500/30";
    if (rate >= 85) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    if (rate >= 60) return "bg-orange-500/20 text-orange-500 border-orange-500/30";
    return "bg-red-500/20 text-red-500 border-red-500/30";
  };

  const getCompletionBgColor = (rate: number) => {
    if (rate >= 98) return "bg-green-500/10";
    if (rate >= 85) return "bg-yellow-500/10";
    if (rate >= 60) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  const getHealthBadge = (health: string) => {
    if (health.includes("Good") || health.includes("✔")) {
      return "bg-green-500/20 text-green-500 border-green-500/30";
    }
    return "bg-red-500/20 text-red-500 border-red-500/30";
  };

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
              <h1 className="text-xl font-bold">ACTL & Booked Meeting Tracker</h1>
              <p className="text-sm text-muted-foreground">
                {trackerData.date}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Email Sent</div>
              <div className="text-2xl font-bold">{trackerData.totals.totalEmailSent.toLocaleString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Replies</div>
              <div className="text-2xl font-bold">{trackerData.totals.totalReplies.toLocaleString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Meetings Booked</div>
              <div className="text-2xl font-bold">{trackerData.totals.meetingsBooked}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg Reply Rate</div>
              <div className="text-2xl font-bold">{trackerData.totals.replyRate.toFixed(2)}%</div>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Client Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Client Name + Campaigns</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Completion Rate</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Positive Replies</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Replies</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Email Sent</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Meetings Booked</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Reply Rate</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Positive Reply Rate</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Positive Reply To Meeting</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Health Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {trackerData.clients.map((client: any, index: number) => (
                    <tr
                      key={index}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{client.clientName}</td>
                      <td className="px-6 py-4">
                        <div className={`px-3 py-1.5 rounded ${getCompletionBgColor(client.completionRate)}`}>
                          <span className="text-sm font-medium">
                            {client.completionRate.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{client.positiveReplies}</td>
                      <td className="px-6 py-4">{client.totalReplies}</td>
                      <td className="px-6 py-4">{client.totalEmailSent.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {client.meetingsBooked === "-" ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          client.meetingsBooked
                        )}
                      </td>
                      <td className="px-6 py-4">{client.replyRate.toFixed(2)}%</td>
                      <td className="px-6 py-4">{client.positiveReplyRate.toFixed(2)}%</td>
                      <td className="px-6 py-4">
                        {client.positiveReplyToMeeting === "#VALUE!" ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          `${client.positiveReplyToMeeting.toFixed(2)}%`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getHealthBadge(client.healthScore)}`}>
                          {client.healthScore.includes("Good") || client.healthScore.includes("✔") ? "✓" : "⚠️"} {client.healthScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {client.notes || "-"}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="border-t-2 border-border bg-muted/20 font-semibold">
                    <td className="px-6 py-4">TOTAL</td>
                    <td className="px-6 py-4">{trackerData.totals.completionRate.toFixed(2)}%</td>
                    <td className="px-6 py-4">{trackerData.totals.positiveReplies}</td>
                    <td className="px-6 py-4">{trackerData.totals.totalReplies}</td>
                    <td className="px-6 py-4">{trackerData.totals.totalEmailSent.toLocaleString()}</td>
                    <td className="px-6 py-4">{trackerData.totals.meetingsBooked}</td>
                    <td className="px-6 py-4">{trackerData.totals.replyRate.toFixed(2)}%</td>
                    <td className="px-6 py-4">{trackerData.totals.positiveReplyRate.toFixed(2)}%</td>
                    <td className="px-6 py-4">{trackerData.totals.positiveReplyToMeeting.toFixed(2)}%</td>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Completion Rate Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
                <span>98-100% (Excellent)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
                <span>85-97% (Good)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/30"></div>
                <span>60-84% (Needs Attention)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
                <span>&lt;60% (Critical)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

