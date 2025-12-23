"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { generateMeetingsData } from "@/lib/sandbox/campaign-stats";

export default function MeetingsPage() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("client") || undefined;
  const campaignName = searchParams.get("campaign") || undefined;

  const [meetingsData, setMeetingsData] = useState<any>(null);

  useEffect(() => {
    const data = generateMeetingsData(clientName, campaignName);
    setMeetingsData(data);
  }, [clientName, campaignName]);

  if (!meetingsData) {
    return <div className="min-h-screen bg-background p-8">Loading...</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "no-show":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "cancelled":
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
      case "rescheduled":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attended":
        return "✓";
      case "no-show":
        return "✗";
      case "cancelled":
        return "🚫";
      case "rescheduled":
        return "🔄";
      default:
        return "•";
    }
  };

  const attended = meetingsData.meetings.filter((m: any) => m.status === "attended").length;
  const noShow = meetingsData.meetings.filter((m: any) => m.status === "no-show").length;
  const cancelled = meetingsData.meetings.filter((m: any) => m.status === "cancelled").length;
  const rescheduled = meetingsData.meetings.filter((m: any) => m.status === "rescheduled").length;
  const showRate = meetingsData.meetings.length > 0 ? ((attended / meetingsData.meetings.length) * 100).toFixed(1) : "0.0";

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
              <h1 className="text-xl font-bold">Meeting Details</h1>
              <p className="text-sm text-muted-foreground">
                {clientName ? `For ${clientName}` : "All Clients"}
                {campaignName ? ` • ${campaignName}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Meetings</div>
              <div className="text-2xl font-bold">{meetingsData.count}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Attended</div>
              <div className="text-2xl font-bold text-green-500">{attended}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">No-Show</div>
              <div className="text-2xl font-bold text-red-500">{noShow}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Cancelled</div>
              <div className="text-2xl font-bold text-gray-500">{cancelled}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Show Rate</div>
              <div className="text-2xl font-bold">{showRate}%</div>
            </div>
          </div>

          {/* Meetings Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Prospect Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Campaign</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Meeting Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {meetingsData.meetings.map((meeting: any, index: number) => (
                    <tr
                      key={meeting.id || index}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{meeting.prospectName}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${meeting.email}`}
                          className="text-primary hover:underline"
                        >
                          {meeting.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">{meeting.company}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{meeting.title}</td>
                      <td className="px-4 py-3 text-sm">{meeting.campaignName}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div>{new Date(meeting.meetingDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground text-xs">{meeting.meetingTime}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getStatusBadge(
                            meeting.status
                          )}`}
                        >
                          {getStatusIcon(meeting.status)} {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{meeting.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {meetingsData.meetings.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No meetings found for the specified criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

