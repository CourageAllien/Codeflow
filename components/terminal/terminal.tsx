"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { parseCommand } from "@/lib/commands/parser";
import { validateCommand } from "@/lib/commands/validator";
import { SandboxSimulator } from "@/lib/sandbox/simulator";
import { generateColdEmail } from "@/lib/ai/email-generator";
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle } from "lucide-react";

interface CommandHistory {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  success: boolean;
}

interface TerminalProps {
  demoMode?: boolean;
}

export function Terminal({ demoMode = false }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentLeads, setCurrentLeads] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef(new SandboxSimulator());

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (demoMode) {
      // Add demo commands to history
      setHistory([
        {
          id: "1",
          command: "find 500 marketing directors at SaaS companies",
          output: "✓ Found 500 leads from Apollo\n\nPreview (showing 5 of 500):\n┌────────────────────────────────────────────────────────────────────┐\n│ Name              │ Title                │ Company          │ Size │\n├────────────────────────────────────────────────────────────────────┤\n│ Sarah Chen        │ Director of Marketing│ TechFlow         │ 127  │\n│ Marcus Johnson    │ Marketing Director   │ CloudStack       │ 89   │\n│ Emily Rodriguez   │ Dir. of Demand Gen   │ SaaSify          │ 234  │\n│ David Kim         │ Marketing Director   │ DataPipe         │ 56   │\n│ Lisa Thompson     │ Director, Marketing  │ FlowMetrics      │ 178  │\n└────────────────────────────────────────────────────────────────────┘\n\n500 leads ready for next step.\n\n💡 SANDBOX: No API credits used. Connect Apollo to search real leads.",
          timestamp: new Date(),
          success: true,
        },
      ]);
    }
  }, [demoMode]);

  const executeCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setIsExecuting(true);
    const commandId = Date.now().toString();

    // Add command to history immediately
    setHistory(prev => [
      ...prev,
      {
        id: commandId,
        command,
        output: "⠋ Processing...",
        timestamp: new Date(),
        success: true,
      },
    ]);

    try {
      // Parse command
      const parsed = await parseCommand(command);
      
      // For unknown commands, provide helpful feedback
      if (parsed.action === "unknown") {
        setHistory(prev =>
          prev.map(h =>
            h.id === commandId
              ? {
                  ...h,
                  output: `🤔 I'm not sure what you mean by "${command}".\n\n💡 Try:\n- "I need 200 marketing directors" (to find leads)\n- "Show me my campaigns" (to view campaigns)\n- "Check my domain health" (for deliverability)\n- "help" (for more examples)\n\nOr visit the Command Guide for more examples and tips.`,
                  success: false,
                }
              : h
          )
        );
        return;
      }

      // Validate command
      const validation = validateCommand(parsed, {
        hasCurrentLeads: currentLeads.length > 0,
        availableCampaigns: [],
        integrations: [],
      });

      if (!validation.valid) {
        let errorMsg = `❌ ${validation.errors.join(", ")}`;
        if (validation.warnings.length > 0) {
          errorMsg += `\n\n⚠️ ${validation.warnings.join(", ")}`;
        }
        errorMsg += `\n\n💡 Try rephrasing your request or type "help" for examples.`;
        
        setHistory(prev =>
          prev.map(h =>
            h.id === commandId
              ? {
                  ...h,
                  output: errorMsg,
                  success: false,
                }
              : h
          )
        );
        return;
      }

      // Execute command (sandbox mode)
      let output = "";
      let success = true;

      const simulator = simulatorRef.current;

      switch (parsed.action) {
        case "find":
        case "search": {
          const searchParams: {
            count: number;
            titles?: string[];
            industry?: string;
            location?: { city?: string; state?: string; country?: string };
            employee_range?: { min?: number; max?: number };
          } = {
            count: parsed.parameters.count || 100,
            titles: parsed.parameters.titles as string[] | undefined,
            industry: parsed.parameters.industry as string | undefined,
            location: parsed.parameters.location as { city?: string; state?: string; country?: string } | undefined,
            employee_range: parsed.parameters.employee_range as { min?: number; max?: number } | undefined,
          };
          const result = await simulator.simulateLeadSearch(searchParams);
          output = formatLeadSearchOutput(result);
          if (result.data?.leads) {
            setCurrentLeads(result.data.leads);
          }
          success = result.success;
          break;
        }

        case "verify": {
          const leadsToVerify = currentLeads.length > 0 ? currentLeads : [];
          if (leadsToVerify.length === 0) {
            output = "⚠️ No leads available. Search for leads first.";
            success = false;
          } else {
            const result = await simulator.simulateEmailVerification(leadsToVerify);
            output = formatVerificationOutput(result);
            success = result.success;
          }
          break;
        }

        case "load_into_campaign":
        case "create_campaign": {
          const campaignName = parsed.parameters.campaign_name || "New Campaign";
          const leads = currentLeads.length > 0 ? currentLeads : [];
          const result = await simulator.simulateCampaignLoad(campaignName, leads);
          output = formatCampaignLoadOutput(result);
          success = result.success;
          break;
        }

        case "simulate": {
          const days = parsed.parameters.days || 7;
          const result = await simulator.simulateTimeProgression(days);
          output = formatSimulationOutput(result);
          success = result.success;
          break;
        }

        case "show_campaigns": {
          output = formatCampaignsOutput();
          break;
        }

        case "help": {
          output = formatHelpOutput();
          break;
        }

        case "show_replies": {
          const filter = parsed.parameters.filter;
          let filterText = "";
          if (filter === "unread") filterText = " (Unread)";
          if (filter === "positive") filterText = " (Positive)";
          if (filter === "today") filterText = " (Today)";
          
          output = `📧 Reply Inbox${filterText}\n\n`;
          output += `[SANDBOX MODE]\n\n`;
          output += `📊 Reply Summary:\n`;
          output += `├── Total Replies: 127\n`;
          output += `├── Unread: 23\n`;
          output += `├── Positive: 8\n`;
          output += `├── Negative: 3\n`;
          output += `└── Neutral: 116\n\n`;
          output += `Recent Replies:\n`;
          output += `├── Sarah Chen (CloudStack) - Positive ✓\n`;
          output += `├── Marcus Johnson (TechFlow) - Positive ✓\n`;
          output += `└── Emily Rodriguez (SaaSify) - Neutral\n\n`;
          output += `💡 SANDBOX: Simulated reply data. In live mode, this shows real replies from your campaigns.`;
          break;
        }
        
        case "campaign_performance": {
          output = `📊 Campaign Performance\n\n`;
          output += `[SANDBOX MODE]\n\n`;
          output += `Overall Performance:\n`;
          output += `├── Total Campaigns: 3\n`;
          output += `├── Active: 3\n`;
          output += `├── Total Sent: 2,847\n`;
          output += `├── Open Rate: 58.2%\n`;
          output += `├── Reply Rate: 3.8%\n`;
          output += `├── Click Rate: 12.1%\n`;
          output += `└── Meetings Booked: 7\n\n`;
          output += `Top Performing Campaign:\n`;
          output += `└── Q4 SaaS Outreach: 4.2% reply rate\n\n`;
          output += `💡 SANDBOX: Simulated performance data. In live mode, this shows real-time campaign metrics.`;
          break;
        }
        
        case "pause_campaign": {
          const campaignName = parsed.parameters.campaign_name || "campaign";
          output = `⏸️ Campaign Paused\n\n`;
          output += `[SANDBOX MODE]\n\n`;
          output += `Campaign "${campaignName}" has been paused.\n`;
          output += `No new emails will be sent until you resume.\n\n`;
          output += `💡 SANDBOX: Simulated pause. In live mode, this actually pauses the campaign.`;
          break;
        }
        
        case "resume_campaign": {
          const campaignName = parsed.parameters.campaign_name || "campaign";
          output = `▶️ Campaign Resumed\n\n`;
          output += `[SANDBOX MODE]\n\n`;
          output += `Campaign "${campaignName}" has been resumed.\n`;
          output += `Emails will continue sending according to schedule.\n\n`;
          output += `💡 SANDBOX: Simulated resume. In live mode, this actually resumes the campaign.`;
          break;
        }
        
        case "enrich": {
          const source = parsed.parameters.source || "apollo";
          output = `🔍 Enriching Leads\n\n`;
          output += `[SANDBOX MODE]\n\n`;
          output += `⠋ Enriching leads with ${source}...\n`;
          output += `████████████████████████████████████████ 100%\n\n`;
          output += `✓ Enriched 150 leads\n`;
          output += `├── Added phone numbers: 142\n`;
          output += `├── Added LinkedIn profiles: 138\n`;
          output += `├── Added company data: 150\n`;
          output += `└── Added technologies: 127\n\n`;
          output += `💡 SANDBOX: Simulated enrichment. Connect ${source} for real data enrichment.`;
          break;
        }

        case "check_deliverability": {
          const result = await simulator.simulateDeliverabilityCheck();
          output = formatDeliverabilityOutput(result);
          success = result.success;
          break;
        }

        case "generate_email": {
          // Try to use real AI if available, otherwise use simulator
          if (process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
            try {
              // In a real implementation, we'd extract sender/receiver info from context
              // For now, use simulator which will call AI if configured
              const result = await simulator.simulateEmailGeneration(parsed.parameters);
              output = formatEmailGenerationOutput(result);
              success = result.success;
            } catch (error) {
              // Fallback to simulator
              const result = await simulator.simulateEmailGeneration(parsed.parameters);
              output = formatEmailGenerationOutput(result);
              success = result.success;
            }
          } else {
            const result = await simulator.simulateEmailGeneration(parsed.parameters);
            output = formatEmailGenerationOutput(result);
            success = result.success;
          }
          break;
        }

        case "actl_tracker": {
          const result = await simulator.simulateACTLTracker(
            parsed.parameters.month,
            parsed.parameters.date,
            parsed.parameters.year
          );
          // Pass parameters to the formatter so it can build the correct URL
          const resultWithParams = {
            ...result,
            parameters: parsed.parameters,
          };
          output = formatACTLTrackerOutput(resultWithParams);
          success = result.success;
          break;
        }

        case "overall_campaign_stats": {
          const result = await simulator.simulateOverallCampaignStats(parsed.parameters.clientName);
          output = formatOverallCampaignStatsOutput(result);
          success = result.success;
          break;
        }

        case "meetings_count": {
          const result = await simulator.simulateMeetingsCount(
            parsed.parameters.clientName,
            parsed.parameters.campaignName
          );
          output = formatMeetingsCountOutput(result);
          success = result.success;
          break;
        }

        case "meetings_details": {
          const result = await simulator.simulateMeetingsDetails(
            parsed.parameters.clientName,
            parsed.parameters.campaignName
          );
          output = formatMeetingsDetailsOutput(result);
          success = result.success;
          break;
        }

        default:
          if (parsed.action === "unknown") {
            output = `🤔 I'm not sure what you mean by "${command}".\n\n💡 Try:\n- "I need 200 marketing directors" (to find leads)\n- "Show me my campaigns" (to view campaigns)\n- "Check my domain health" (for deliverability)\n- "help" (for more examples)\n\nOr visit the Command Guide for more examples and tips.`;
          } else {
            output = `❓ Unknown command: ${parsed.action}\n\n💡 Try typing what you want in plain English, or type "help" for examples.`;
          }
          success = false;
      }

      setHistory(prev =>
        prev.map(h =>
          h.id === commandId
            ? {
                ...h,
                output,
                success,
              }
            : h
        )
      );
    } catch (error) {
      setHistory(prev =>
        prev.map(h =>
          h.id === commandId
            ? {
                ...h,
                output: `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                success: false,
              }
            : h
        )
      );
    } finally {
      setIsExecuting(false);
    }
  }, [currentLeads]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExecuting || !input.trim()) return;
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // TODO: Navigate command history
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // TODO: Navigate command history
    } else if (e.key === "Tab") {
      e.preventDefault();
      // TODO: Autocomplete
    }
  };

  return (
    <div className="terminal-container bg-background border border-border rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-4 text-sm text-muted-foreground">
          {demoMode ? "coldflow v1.0.0 (Demo)" : "coldflow v1.0.0"}
        </span>
        {!demoMode && (
          <span className="ml-auto px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded">
            🧪 SANDBOX MODE
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/commands-guide">
              <BookOpen className="w-4 h-4 mr-1" />
              Guide
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 font-mono text-sm">
        {history.length === 0 && (
          <div className="text-muted-foreground">
            Type 'help' for commands or just describe what you want to do
          </div>
        )}
        {history.map(item => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-primary">$</span>
              <span className="flex-1">{item.command}</span>
            </div>
            <div
              className={`ml-6 whitespace-pre-wrap ${
                item.success ? "text-foreground" : "text-destructive"
              }`}
            >
              {item.output.split('\n').map((line, i) => {
                // Check if line contains a URL
                const urlMatch = line.match(/(http:\/\/[^\s]+)/);
                if (urlMatch) {
                  const parts = line.split(urlMatch[1]);
                  return (
                    <span key={i}>
                      {parts[0]}
                      <Link
                        href={urlMatch[1].replace('http://localhost:3000', '')}
                        className="text-blue-400 hover:text-blue-300 underline"
                        target="_blank"
                      >
                        {urlMatch[1]}
                      </Link>
                      {parts[1]}
                      {'\n'}
                    </span>
                  );
                }
                return <span key={i}>{line}{'\n'}</span>;
              })}
            </div>
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-primary font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          placeholder={isExecuting ? "Executing..." : "Enter command..."}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
          autoFocus
        />
        {isExecuting && (
          <span className="text-muted-foreground animate-pulse">⠋</span>
        )}
      </form>
    </div>
  );
}

function formatLeadSearchOutput(result: any): string {
  const leads = result.data?.leads || [];
  const preview = leads.slice(0, 5);
  
  let output = `[SANDBOX MODE]\n\n`;
  output += `⠋ Simulating Apollo search...\n`;
  output += `✓ Found ${leads.length} leads matching criteria\n\n`;
  
  if (preview.length > 0) {
    output += `Preview (showing ${preview.length} of ${leads.length}):\n`;
    output += `┌────────────────────────────────────────────────────────────────────┐\n`;
    output += `│ Name              │ Title                │ Company          │ Size │\n`;
    output += `├────────────────────────────────────────────────────────────────────┤\n`;
    preview.forEach((lead: any) => {
      const name = (lead.full_name || `${lead.first_name} ${lead.last_name}`).padEnd(18);
      const title = (lead.title || "").padEnd(20);
      const company = (lead.company || "").padEnd(16);
      const size = String(lead.employee_count || 0).padStart(4);
      output += `│ ${name} │ ${title} │ ${company} │ ${size} │\n`;
    });
    output += `└────────────────────────────────────────────────────────────────────┘\n\n`;
  }
  
  output += `${leads.length} leads ready for next step.\n\n`;
  output += `💡 SANDBOX: No API credits used. Connect Apollo to search real leads.`;
  
  if (result.costEstimate && result.costEstimate.length > 0) {
    const cost = result.costEstimate[0];
    output += `\n\nEstimated cost if live: $${cost.amount.toFixed(2)}`;
  }
  
  return output;
}

function formatVerificationOutput(result: any): string {
  const data = result.data || {};
  const valid = data.valid || 0;
  const risky = data.risky || 0;
  const invalid = data.invalid || 0;
  const catchall = data.catchall || 0;
  const total = data.total || 1;
  
  let output = "[SANDBOX MODE]\n\n";
  output += "⠋ Simulating MillionVerifier check...\n";
  output += "████████████████████████████████████████ 100%\n\n";
  output += "Results:\n";
  output += `├── ✓ Valid:     ${String(valid).padStart(5)} (${data.validPercentage || 0}%)\n`;
  output += `├── ⚠ Risky:      ${String(risky).padStart(5)} (${((risky / total) * 100).toFixed(1)}%)\n`;
  output += `├── ✗ Invalid:     ${String(invalid).padStart(5)} (${((invalid / total) * 100).toFixed(1)}%)\n`;
  output += `└── ? Catch-all:   ${String(catchall).padStart(5)} (${((catchall / total) * 100).toFixed(1)}%)\n\n`;
  
  if (result.costEstimate && result.costEstimate.length > 0) {
    const cost = result.costEstimate[0];
    output += `Estimated cost if live: $${cost.amount.toFixed(2)}\n\n`;
  }
  
  output += `Recommended action: Proceed with ${valid} valid emails.\n`;
  output += `Remove ${invalid} invalid to protect sender reputation.\n\n`;
  output += "💡 SANDBOX: Simulated verification. Connect MillionVerifier for real checks.";
  
  return output;
}

function formatCampaignLoadOutput(result: any): string {
  const data = result.data || {};
  let output = `[SANDBOX MODE]\n\n`;
  output += `⠋ Simulating Instantly campaign creation...\n\n`;
  output += `✓ Campaign "${data.campaignName || "New Campaign"}" created\n`;
  output += `├── Leads added: ${data.leadsCount || 0}\n`;
  output += `├── Inboxes assigned: ${data.inboxes || 3}\n`;
  output += `├── Daily send volume: ${data.dailyVolume || 45}/inbox = ${(data.dailyVolume || 45) * (data.inboxes || 3)} total/day\n`;
  output += `├── Estimated completion: ${data.estimatedDays || 0} days\n`;
  output += `└── Sequence: Using default 4-step sequence\n\n`;
  output += `Sequence preview:\n`;
  output += `┌─────────────────────────────────────────────────────────────────┐\n`;
  output += `│ Step 1 (Day 0): Initial outreach                                │\n`;
  output += `│ Step 2 (Day 3): Follow-up if no reply                          │\n`;
  output += `│ Step 3 (Day 7): Value-add follow-up                            │\n`;
  output += `│ Step 4 (Day 12): Break-up email                                │\n`;
  output += `└─────────────────────────────────────────────────────────────────┘\n\n`;
  output += `Ready to activate? Say "start campaign" or "schedule for monday"\n\n`;
  output += `💡 SANDBOX: Connect Instantly to create real campaigns.`;
  
  return output;
}

function formatSimulationOutput(result: any): string {
  const data = result.data || {};
  const summary = data.summary || {};
  let output = `[SANDBOX MODE]\n\n`;
  output += `⏩ Fast-forwarding ${data.days || 0} days...\n\n`;
  
  if (data.history && data.history.length > 0) {
    output += `Day-by-Day Results:\n`;
    output += `┌──────────────────────────────────────────────────────────────────┐\n`;
    output += `│ Day │ Sent │ Delivered │ Opens │ Clicks │ Replies │ Bounces     │\n`;
    output += `├──────────────────────────────────────────────────────────────────┤\n`;
    data.history.forEach((day: any) => {
      const dayStr = String(day.day).padStart(3);
      const sent = String(day.sent).padStart(4);
      const delivered = String(day.delivered).padStart(9);
      const opens = String(day.opened).padStart(5);
      const clicks = String(day.clicked).padStart(6);
      const replies = String(day.replied).padStart(7);
      const bounces = String(day.bounced).padStart(11);
      output += `│ ${dayStr}  │ ${sent} │ ${delivered} │ ${opens} │ ${clicks} │ ${replies} │ ${bounces}       │\n`;
    });
    output += `└──────────────────────────────────────────────────────────────────┘\n\n`;
  }
  
  output += `${data.days || 0}-Day Summary:\n`;
  output += `├── Total sent: ${summary.sent || 0} / ${data.totalLeads || 0} leads\n`;
  output += `├── Delivery rate: ${summary.deliveryRate || 98.4}%\n`;
  output += `├── Open rate: ${summary.openRate || 0}%\n`;
  output += `├── Click rate: ${summary.clickRate || 0}%\n`;
  output += `├── Reply rate: ${summary.replyRate || 0}% (${summary.replied || 0} replies)\n`;
  output += `├── Bounce rate: ${summary.bounceRate || 0}%\n`;
  output += `└── Estimated meetings: ${Math.floor((summary.replied || 0) * 0.15)}\n\n`;
  output += `Campaign health: ✓ GOOD\n`;
  output += `This is above-average performance for SaaS outreach.\n\n`;
  output += `💡 These projections are based on industry benchmarks. Real results vary.`;
  
  return output;
}

function formatCampaignsOutput(): string {
  return `Active Campaigns:\n\n` +
    `┌───────────────────────────────────────────────────────────────┐\n` +
    `│ Campaign          │ Status  │ Sent  │ Opens │ Replies│ Mtgs  │\n` +
    `├───────────────────────────────────────────────────────────────┤\n` +
    `│ Q4 SaaS Outreach  │ 🟢 Active│ 1,890 │ 59%   │ 4.2%  │ 12   │\n` +
    `│ Fintech DMs       │ 🟢 Active│  645  │ 52%   │ 2.8%  │  3   │\n` +
    `│ Agency Partners   │ 🟢 Active│  312  │ 61%   │ 6.1%  │  8   │\n` +
    `└───────────────────────────────────────────────────────────────┘\n\n` +
    `Use "show campaign [name]" for detailed stats.`;
}

function formatDeliverabilityOutput(result: any): string {
  const data = result.data || {};
  let output = "[SANDBOX MODE]\n\n";
  output += "⠋ Checking domain health and deliverability...\n";
  output += "████████████████████████████████████████ 100%\n\n";
  
  output += `Overall Health: ${data.overallHealth || 87}% `;
  const healthBar = "█".repeat(Math.floor((data.overallHealth || 87) / 5)) + "░".repeat(20 - Math.floor((data.overallHealth || 87) / 5));
  output += healthBar + "\n\n";
  
  if (data.domains && data.domains.length > 0) {
    output += "Domains:\n";
    output += "┌───────────────────────────────────────────────────────────────┐\n";
    output += "│ Domain             │ Health │ Inbox % │ SPF │ DKIM │ DMARC   │\n";
    output += "├───────────────────────────────────────────────────────────────┤\n";
    data.domains.forEach((domain: any) => {
      const name = (domain.name || "").padEnd(18);
      const health = String(domain.health || 0).padStart(5);
      const inbox = String(domain.inboxPlacement || 0).padStart(7);
      const spf = domain.spf ? "✓" : "✗";
      const dkim = domain.dkim ? "✓" : "✗";
      const dmarc = domain.dmarc ? "✓" : domain.dmarc === false ? "⚠️" : "✗";
      output += `│ ${name} │ ${health}% │ ${inbox}% │ ${spf}   │ ${dkim}   │ ${dmarc.padEnd(7)} │\n`;
    });
    output += "└───────────────────────────────────────────────────────────────┘\n\n";
  }
  
  if (data.inboxes && data.inboxes.length > 0) {
    output += "Sending Inboxes:\n";
    output += "┌───────────────────────────────────────────────────────────────┐\n";
    output += "│ Inbox                    │ Warmup │ Sent Today │ Limit │ Rep │\n";
    output += "├───────────────────────────────────────────────────────────────┤\n";
    data.inboxes.forEach((inbox: any) => {
      const email = (inbox.email || "").padEnd(22);
      const warmup = String(inbox.warmupScore || 0).padStart(6);
      const sent = `${inbox.sentToday || 0}/${inbox.limit || 0}`.padStart(11);
      const limit = String(inbox.limit || 0).padStart(5);
      const rep = String(inbox.reputation || 0).padStart(4);
      output += `│ ${email} │ ${warmup}% │ ${sent} │ ${limit} │ ${rep} │\n`;
    });
    output += "└───────────────────────────────────────────────────────────────┘\n\n";
  }
  
  if (data.issues && data.issues.length > 0) {
    output += "Issues & Recommendations:\n";
    data.issues.forEach((issue: any) => {
      const icon = issue.severity === "critical" ? "🔴" : issue.severity === "warning" ? "🟡" : "🟢";
      output += `${icon} ${issue.message || ""} — ${issue.impact || ""}\n`;
    });
    output += "\n";
  }
  
  output += "💡 SANDBOX: Simulated deliverability check. Connect your domains for real monitoring.";
  
  return output;
}

function formatEmailGenerationOutput(result: any): string {
  const data = result.data || {};
  const email = data.email || {};
  const sender = data.sender || {};
  const receiver = data.receiver || {};
  
  let output = "[SANDBOX MODE]\n\n";
  output += "⠋ Generating personalized cold email...\n";
  output += "████████████████████████████████████████ 100%\n\n";
  
  output += "✓ Email Generated\n\n";
  output += `From: ${sender.name} at ${sender.company}\n`;
  output += `To: ${receiver.name}, ${receiver.title} at ${receiver.company}\n\n`;
  output += "─────────────────────────────────────────────────────────────\n";
  output += "SUBJECT:\n";
  output += `${email.subject || "Quick question about " + receiver.company}\n\n`;
  output += "─────────────────────────────────────────────────────────────\n";
  output += "BODY:\n";
  output += `${email.body || ""}\n\n`;
  output += "─────────────────────────────────────────────────────────────\n\n";
  
  if (email.personalization) {
    output += `Personalization: ${email.personalization}\n\n`;
  }
  
  if (email.reasoning) {
    output += `Why this works: ${email.reasoning}\n\n`;
  }
  
  output += "💡 SANDBOX: This is a simulated email. In live mode with Claude API, emails are generated based on:\n";
  output += "   • Sender's website and value proposition\n";
  output += "   • Receiver's company website and industry\n";
  output += "   • Personalized connection between their needs and your solution\n\n";
  output += "To generate real emails, connect Claude API and provide website URLs.";
  
  return output;
}

function formatACTLTrackerOutput(result: any): string {
  const data = result.data || {};
  const clients = data.clients || [];
  const totals = data.totals || {};
  
  // Extract date components from the result or use parameters
  // The date string format is "Month Day, Year" (e.g., "July 15, 2022")
  let month: string | undefined;
  let date: number | undefined;
  let year: number | undefined;
  
  if (data.date) {
    const dateMatch = data.date.match(/(\w+)\s+(\d+),\s+(\d{4})/);
    if (dateMatch) {
      month = dateMatch[1]; // Full month name
      date = parseInt(dateMatch[2]);
      year = parseInt(dateMatch[3]);
    }
  }
  
  // Also check if we have parameters from the command
  if (result.parameters) {
    if (result.parameters.month) month = result.parameters.month;
    if (result.parameters.date) date = result.parameters.date;
    if (result.parameters.year) year = result.parameters.year;
  }
  
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (date) params.set("date", date.toString());
  if (year) params.set("year", year.toString());
  
  const dashboardUrl = `/dashboard/actl-tracker?${params.toString()}`;
  
  let output = `[SANDBOX MODE]\n\n`;
  output += `ACTL & Booked Meeting Tracker for ${data.date || "Current Period"}\n`;
  output += `═══════════════════════════════════════════════════════════════════════════════\n\n`;
  
  output += `📊 Summary:\n`;
  output += `├── Total Email Sent: ${totals.totalEmailSent.toLocaleString()}\n`;
  output += `├── Total Replies: ${totals.totalReplies.toLocaleString()}\n`;
  output += `├── Positive Replies: ${totals.positiveReplies}\n`;
  output += `├── Meetings Booked: ${totals.meetingsBooked}\n`;
  output += `├── Reply Rate: ${totals.replyRate.toFixed(2)}%\n`;
  output += `└── Positive Reply Rate: ${totals.positiveReplyRate.toFixed(2)}%\n\n`;
  
  output += `📋 Clients: ${clients.length} total\n\n`;
  
  // Show top 5 clients in terminal
  const topClients = clients.slice(0, 5);
  output += `Top Clients (showing 5 of ${clients.length}):\n`;
  topClients.forEach((client: any, index: number) => {
    const icon = client.completionRate >= 98 ? "🟢" : client.completionRate >= 85 ? "🟡" : client.completionRate >= 60 ? "🟠" : "🔴";
    output += `${index + 1}. ${client.clientName} - ${icon} ${client.completionRate.toFixed(1)}% | ${client.totalReplies} replies | ${client.meetingsBooked === "-" ? "0" : client.meetingsBooked} meetings\n`;
  });
  
  if (clients.length > 5) {
    output += `... and ${clients.length - 5} more clients\n\n`;
  }
  
  output += `\n🔗 View Full Dashboard:\n`;
  output += `   http://localhost:3000${dashboardUrl}\n\n`;
  output += `💡 Click the link above to see the complete dashboard with all clients and detailed metrics.`;
  
  return output;
}

function formatOverallCampaignStatsOutput(result: any): string {
  const data = result.data || {};
  
  const dashboardUrl = `/dashboard/overall-stats${data.clientName ? `?client=${encodeURIComponent(data.clientName)}` : ""}`;
  
  let output = "[SANDBOX MODE]\n\n";
  output += "⠋ Gathering overall campaign statistics...\n";
  output += "████████████████████████████████████████ 100%\n\n";
  
  output += `Overall Campaign Stats for ${data.clientName || "Client"}\n`;
  output += "════════════════════════════════════════════════════════════\n\n";
  
  output += `📅 Contract Start: ${data.contractStartDate || "N/A"}\n`;
  output += `📧 Total Email Sent: ${data.totalEmailSent?.toLocaleString() || 0}\n\n`;
  
  output += "📊 Key Metrics:\n";
  const deliveryRate = data.totalEmailSent > 0 ? ((data.totalDelivered / data.totalEmailSent) * 100).toFixed(2) : "0.00";
  output += `├── Delivered: ${data.totalDelivered?.toLocaleString() || 0} (${deliveryRate}%)\n`;
  output += `├── Opened: ${data.totalOpened?.toLocaleString() || 0} (${data.openRate?.toFixed(2) || 0}%)\n`;
  output += `├── Clicked: ${data.totalClicked?.toLocaleString() || 0} (${data.clickRate?.toFixed(2) || 0}%)\n`;
  output += `├── Replied: ${data.totalReplied?.toLocaleString() || 0} (${data.replyRate?.toFixed(2) || 0}%)\n`;
  output += `├── Positive Replies: ${data.totalPositiveReplies?.toLocaleString() || 0} (${data.positiveReplyRate?.toFixed(2) || 0}%)\n`;
  output += `├── Bounced: ${data.totalBounced?.toLocaleString() || 0} (${data.bounceRate?.toFixed(2) || 0}%)\n`;
  output += `└── Meetings Booked: ${data.totalMeetingsBooked?.toLocaleString() || 0}\n\n`;
  
  output += `🔗 View Full Dashboard:\n`;
  output += `   http://localhost:3000${dashboardUrl}\n\n`;
  output += `💡 Click the link above to see detailed metrics, visual charts, and performance breakdown.`;
  
  return output;
}

function formatMeetingsCountOutput(result: any): string {
  const data = result.data || {};
  const count = data.count || 0;
  const clientName = data.clientName ? ` for ${data.clientName}` : "";
  const campaignName = data.campaignName ? ` in "${data.campaignName}"` : "";
  
  let output = "[SANDBOX MODE]\n\n";
  output += "⠋ Counting booked meetings...\n";
  output += "████████████████████████████████████████ 100%\n\n";
  
  output += `Meetings Booked${clientName}${campaignName}\n`;
  output += "════════════════════════════════════════════════════════════\n\n";
  
  output += `Total Meetings: ${count}\n\n`;
  
  if (count > 0) {
    output += `💡 To see meeting details, ask:\n`;
    output += `   • "Who booked meetings${clientName}${campaignName}"\n`;
    output += `   • "Show meeting details${clientName}${campaignName}"\n`;
    output += `   • "List meetings${clientName}${campaignName}"\n\n`;
  }
  
  output += "💡 SANDBOX: Simulated count. In live mode, this shows real booked meetings.";
  
  return output;
}

function formatMeetingsDetailsOutput(result: any): string {
  const data = result.data || {};
  const meetings = data.meetings || [];
  const clientName = data.clientName || undefined;
  const campaignName = data.campaignName || undefined;
  
  const params = new URLSearchParams();
  if (clientName) params.set("client", clientName);
  if (campaignName) params.set("campaign", campaignName);
  
  const dashboardUrl = `/dashboard/meetings?${params.toString()}`;
  
  let output = "[SANDBOX MODE]\n\n";
  output += "⠋ Retrieving meeting details...\n";
  output += "████████████████████████████████████████ 100%\n\n";
  
  if (meetings.length === 0) {
    output += "No meetings found.\n";
  } else {
    output += `📅 Meeting Details${clientName ? ` for ${clientName}` : ""}${campaignName ? ` - ${campaignName}` : ""}\n`;
    output += "════════════════════════════════════════════════════════════\n\n";
    
    output += `Total Meetings: ${meetings.length}\n\n`;
    
    // Summary by status
    const attended = meetings.filter((m: any) => m.status === "attended").length;
    const noShow = meetings.filter((m: any) => m.status === "no-show").length;
    const cancelled = meetings.filter((m: any) => m.status === "cancelled").length;
    const rescheduled = meetings.filter((m: any) => m.status === "rescheduled").length;
    
    output += "📊 Status Summary:\n";
    output += `├── ✓ Attended: ${attended}\n`;
    output += `├── ✗ No-Show: ${noShow}\n`;
    output += `├── 🚫 Cancelled: ${cancelled}\n`;
    output += `└── 🔄 Rescheduled: ${rescheduled}\n\n`;
    
    // Show rate
    const showRate = meetings.length > 0 ? ((attended / meetings.length) * 100).toFixed(1) : "0.0";
    output += `Show Rate: ${showRate}%\n\n`;
    
    // Show first 3 meetings as preview
    const preview = meetings.slice(0, 3);
    output += "Preview (showing 3 of " + meetings.length + "):\n";
    preview.forEach((meeting: any, index: number) => {
      const statusIcon = meeting.status === "attended" ? "✓" : 
                         meeting.status === "no-show" ? "✗" : 
                         meeting.status === "cancelled" ? "🚫" : "🔄";
      output += `${index + 1}. ${meeting.prospectName} (${meeting.company}) - ${statusIcon} ${meeting.status}\n`;
      output += `   📧 ${meeting.email} | 📅 ${new Date(meeting.meetingDate).toLocaleDateString()}\n`;
    });
    
    if (meetings.length > 3) {
      output += `... and ${meetings.length - 3} more meetings\n\n`;
    }
    
    output += `\n🔗 View Full Dashboard:\n`;
    output += `   http://localhost:3000${dashboardUrl}\n\n`;
    output += `💡 Click the link above to see all meeting details in a clean, organized table.`;
  }
  
  return output;
}

function formatHelpOutput(): string {
  return `💡 ColdFlow Command Help\n\n` +
    `You can type anything in natural language! No specific format needed.\n\n` +
    `📋 Common Examples:\n\n` +
    `Finding Leads:\n` +
    `  • "I need 200 marketing directors"\n` +
    `  • "Find me CTOs at SaaS companies"\n` +
    `  • "Show me VP of Sales in California"\n\n` +
    `Email Verification:\n` +
    `  • "Verify these emails"\n` +
    `  • "Check if these are valid"\n` +
    `  • "Are these emails good?"\n\n` +
    `Campaigns:\n` +
    `  • "Create a campaign called Q1 Outreach"\n` +
    `  • "Load leads into my campaign"\n` +
    `  • "Show me all campaigns"\n` +
    `  • "Pause the Healthcare campaign"\n\n` +
    `Email Generation:\n` +
    `  • "Generate an email to Sarah Chen at CloudStack"\n` +
    `  • "Write a cold email for marketing directors"\n` +
    `  • "Create an email from TechFlow to SaaS companies"\n\n` +
    `Deliverability:\n` +
    `  • "Check my domain health"\n` +
    `  • "What's my deliverability status?"\n` +
    `  • "Show me inbox placement"\n\n` +
    `Analytics:\n` +
    `  • "How are my campaigns doing?"\n` +
    `  • "Show me campaign stats"\n` +
    `  • "What's my open rate?"\n` +
    `  • "Give me ACTL & Booked Meeting Tracker for December 5 2024"\n` +
    `  • "Overall campaign stats for Adaline"\n` +
    `  • "Total emails sent since contract start"\n\n` +
    `Meetings:\n` +
    `  • "How many meetings booked for Privy?"\n` +
    `  • "Meetings booked in Q4 SaaS Outreach"\n` +
    `  • "Who booked meetings for RocketReach"\n` +
    `  • "Show meeting details for all clients"\n\n` +
    `💡 Tip: Just describe what you want in plain English!\n\n` +
    `📚 For more examples, visit the Command Guide page.`;
}

