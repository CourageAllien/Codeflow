"use client";

interface Reply {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  classification: "positive" | "negative" | "neutral" | "ooo" | "bounce";
  campaign: string;
  timeAgo: string;
  unread: boolean;
}

const mockReplies: Reply[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP Marketing",
    company: "TechFlow",
    content: "This is actually relevant to what we're doing. Can you send over some case studies?",
    classification: "positive",
    campaign: "Q4 SaaS Outreach",
    timeAgo: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "Director",
    company: "CloudStack",
    content: "Let's do a quick call. Thursday or Friday work?",
    classification: "positive",
    campaign: "Q4 SaaS Outreach",
    timeAgo: "5 hours ago",
    unread: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Marketing",
    company: "SaaSify",
    content: "Not the right time. Reach out again in Q2?",
    classification: "neutral",
    campaign: "Fintech DMs",
    timeAgo: "1 day ago",
    unread: false,
  },
  {
    id: "4",
    name: "David Kim",
    title: "CEO",
    company: "DataPipe",
    content: "Please remove me from your list.",
    classification: "negative",
    campaign: "Q4 SaaS Outreach",
    timeAgo: "1 day ago",
    unread: false,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    title: "FlowMetrics",
    company: "FlowMetrics",
    content: "I'm out of office until January 15th...",
    classification: "ooo",
    campaign: "Agency Partners",
    timeAgo: "2 days ago",
    unread: false,
  },
];

export function ReplyInbox() {
  const getClassificationColor = (classification: Reply["classification"]) => {
    switch (classification) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      case "neutral":
        return "text-yellow-500";
      case "ooo":
        return "text-blue-500";
      case "bounce":
        return "text-gray-500";
    }
  };

  const getClassificationIcon = (classification: Reply["classification"]) => {
    switch (classification) {
      case "positive":
        return "🟢";
      case "negative":
        return "🔴";
      case "neutral":
        return "🟡";
      case "ooo":
        return "⚪";
      case "bounce":
        return "📧";
    }
  };

  const unreadCount = mockReplies.filter(r => r.unread).length;
  const positiveCount = mockReplies.filter(r => r.classification === "positive" && r.unread).length;
  const neutralCount = mockReplies.filter(r => r.classification === "neutral" && r.unread).length;
  const negativeCount = mockReplies.filter(r => r.classification === "negative" && r.unread).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select className="px-3 py-2 bg-card border border-border rounded-md text-sm">
          <option>All</option>
          <option>Unread</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
        <input
          type="text"
          placeholder="Search replies..."
          className="flex-1 px-3 py-2 bg-card border border-border rounded-md text-sm"
        />
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {mockReplies.map(reply => (
          <div
            key={reply.id}
            className={`p-4 hover:bg-muted/30 ${reply.unread ? "bg-primary/5" : ""}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={getClassificationColor(reply.classification)}>
                  {getClassificationIcon(reply.classification)}
                </span>
                {reply.unread && (
                  <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    NEW
                  </span>
                )}
                <span className="font-semibold">{reply.name}</span>
                <span className="text-muted-foreground">
                  — {reply.title}, {reply.company}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{reply.timeAgo}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Campaign: {reply.campaign}
              </span>
              <div className="flex gap-2">
                {reply.classification === "positive" && (
                  <>
                    <button className="px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30">
                      Reply
                    </button>
                    <button className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80">
                      Schedule Meeting
                    </button>
                  </>
                )}
                {reply.classification === "neutral" && (
                  <button className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80">
                    Snooze until Q2
                  </button>
                )}
                {reply.classification === "negative" && (
                  <button className="px-3 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30">
                    Unsubscribe
                  </button>
                )}
                <button className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80">
                  Mark Handled
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Unread</div>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Positive</div>
            <div className="text-2xl font-bold text-green-500">{positiveCount}</div>
            <div className="text-xs text-muted-foreground">(need response)</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Neutral</div>
            <div className="text-2xl font-bold text-yellow-500">{neutralCount}</div>
            <div className="text-xs text-muted-foreground">(review needed)</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Negative</div>
            <div className="text-2xl font-bold text-red-500">{negativeCount}</div>
            <div className="text-xs text-muted-foreground">(auto-handled)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

