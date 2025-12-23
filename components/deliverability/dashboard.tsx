"use client";

export function DeliverabilityDashboard() {
  const domains = [
    {
      name: "outreach-demo.com",
      health: 94,
      inboxPlacement: 94,
      spf: true,
      dkim: true,
      dmarc: true,
    },
    {
      name: "company-demo.com",
      health: 67,
      inboxPlacement: 67,
      spf: true,
      dkim: true,
      dmarc: false,
    },
    {
      name: "growth-demo.com",
      health: 89,
      inboxPlacement: 89,
      spf: true,
      dkim: true,
      dmarc: true,
    },
  ];

  const inboxes = [
    {
      email: "john@outreach-demo.com",
      warmupScore: 92,
      sentToday: 23,
      limit: 45,
      reputation: 9.2,
    },
    {
      email: "sales@company-demo.com",
      warmupScore: 78,
      sentToday: 30,
      limit: 30,
      reputation: 7.8,
    },
    {
      email: "mike@growth-demo.com",
      warmupScore: 100,
      sentToday: 0,
      limit: 50,
      reputation: 9.5,
    },
  ];

  const overallHealth = Math.round(
    domains.reduce((sum, d) => sum + d.health, 0) / domains.length
  );

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overall Health</h2>
          <span className="text-3xl font-bold">{overallHealth}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all"
            style={{ width: `${overallHealth}%` }}
          />
        </div>
      </div>

      {/* Domains */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Domains</h2>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Domain</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Health</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Inbox %</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">SPF</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">DKIM</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">DMARC</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(domain => (
              <tr key={domain.name} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{domain.name}</td>
                <td className="px-4 py-3">
                  <span className={domain.health >= 90 ? "text-green-500" : domain.health >= 70 ? "text-yellow-500" : "text-red-500"}>
                    {domain.health}%
                  </span>
                </td>
                <td className="px-4 py-3">{domain.inboxPlacement}%</td>
                <td className="px-4 py-3">
                  {domain.spf ? "✓" : "✗"}
                </td>
                <td className="px-4 py-3">
                  {domain.dkim ? "✓" : "✗"}
                </td>
                <td className="px-4 py-3">
                  {domain.dmarc ? "✓" : domain.dmarc === false ? <span className="text-yellow-500">⚠️</span> : "✗"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {domains.some(d => !d.dmarc) && (
          <div className="p-4 bg-yellow-500/10 border-t border-border">
            <div className="flex items-center gap-2 text-yellow-500">
              <span>⚠️</span>
              <span>ACTION REQUIRED: company-demo.com missing DMARC record</span>
            </div>
            <button className="mt-2 text-sm text-primary hover:underline">
              Show me how to fix this
            </button>
          </div>
        )}
      </div>

      {/* Sending Inboxes */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Sending Inboxes</h2>
        </div>
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Inbox</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Warmup</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Sent Today</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Limit</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Reputation</th>
            </tr>
          </thead>
          <tbody>
            {inboxes.map(inbox => (
              <tr key={inbox.email} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{inbox.email}</td>
                <td className="px-4 py-3">
                  <span className={inbox.warmupScore >= 90 ? "text-green-500" : inbox.warmupScore >= 70 ? "text-yellow-500" : "text-red-500"}>
                    {inbox.warmupScore}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {inbox.sentToday}/{inbox.limit}
                  {inbox.sentToday >= inbox.limit && (
                    <span className="ml-2 text-yellow-500">⚠️</span>
                  )}
                </td>
                <td className="px-4 py-3">{inbox.limit}</td>
                <td className="px-4 py-3">
                  <span className={inbox.reputation >= 9 ? "text-green-500" : inbox.reputation >= 7 ? "text-yellow-500" : "text-red-500"}>
                    {inbox.reputation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issues & Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Issues & Recommendations</h2>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-red-500">
            <span>🔴</span>
            <span>DMARC missing on company-demo.com — Inbox rate at risk</span>
          </div>
          <div className="flex items-start gap-2 text-yellow-500">
            <span>🟡</span>
            <span>sales@ at daily limit — Consider adding inbox</span>
          </div>
          <div className="flex items-start gap-2 text-green-500">
            <span>🟢</span>
            <span>No blacklist issues detected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

