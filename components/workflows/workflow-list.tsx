"use client";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: string;
  runsPerMonth: number;
  enabled: boolean;
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "New Lead Processor",
    trigger: "New row in Google Sheet",
    steps: "Enrich → Verify → Personalize → Load campaign",
    runsPerMonth: 847,
    enabled: true,
  },
  {
    id: "2",
    name: "Daily Deliverability Check",
    trigger: "Every day at 8:00 AM",
    steps: "Check domains → Check warmup → Alert if issues",
    runsPerMonth: 30,
    enabled: true,
  },
  {
    id: "3",
    name: "Positive Reply Handler",
    trigger: "New positive reply detected",
    steps: "Pause sequence → Tag lead → Create deal → Notify",
    runsPerMonth: 52,
    enabled: true,
  },
];

export function WorkflowList() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">My Workflows</h2>
        <div className="space-y-3">
          {mockWorkflows.map(workflow => (
            <div
              key={workflow.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📋</span>
                    <h3 className="font-semibold">{workflow.name}</h3>
                    {workflow.enabled ? (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-500 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-gray-500/20 text-gray-500 rounded">
                        Paused
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Trigger: {workflow.trigger}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Steps: {workflow.steps}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Runs: {workflow.runsPerMonth}/mo</div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30">
                  Run Now
                </button>
                <button className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80">
                  {workflow.enabled ? "Pause" : "Resume"}
                </button>
                <button className="px-3 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Bounce Handler",
            "Weekly Client Report",
            "Re-engagement Loader",
            "Unsubscribe Processor",
          ].map(template => (
            <div
              key={template}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span className="font-medium">{template}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

