// Sandbox simulation engine

import { SandboxLead } from "./generator";
import { SandboxCampaign, generateCampaignHistory } from "./campaigns";

export interface SimulationResult {
  success: boolean;
  message: string;
  data?: any;
  costEstimate?: {
    service: string;
    amount: number;
    currency: string;
  }[];
  sandboxMode: boolean;
}

export class SandboxSimulator {
  private leads: SandboxLead[] = [];
  private campaigns: SandboxCampaign[] = [];

  constructor() {
    // Initialize with default sandbox data
    this.initializeSandboxData();
  }

  private initializeSandboxData() {
    // This would load from database or generate on demand
    // For now, we'll generate on demand
  }

  async simulateLeadSearch(params: {
    count: number;
    titles?: string[];
    industry?: string;
    location?: { city?: string; state?: string; country?: string };
    employee_range?: { min?: number; max?: number };
  }): Promise<SimulationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate mock leads (in real app, this would filter from existing sandbox data)
    const mockLeads: SandboxLead[] = [];
    const count = Math.min(params.count, 500); // Limit for demo
    
    for (let i = 0; i < count; i++) {
      // Simplified generation for simulation
      mockLeads.push({
        id: `lead_sim_${i}`,
        first_name: `Lead${i}`,
        last_name: `Test${i}`,
        full_name: `Lead${i} Test${i}`,
        title: params.titles?.[0] || "Marketing Director",
        company: `Company ${i}`,
        company_domain: `company${i}-demo.com`,
        industry: params.industry || "SaaS",
        employee_count: params.employee_range 
          ? Math.floor(((params.employee_range.min || 50) + (params.employee_range.max || 200)) / 2)
          : 100,
        revenue_range: "$10M-$25M",
        location_city: params.location?.city || "San Francisco",
        location_state: params.location?.state || "CA",
        location_country: params.location?.country || "USA",
        email: `lead${i}@company${i}-demo.com`,
        email_status: "valid",
        phone: `+1-555-${String(1000 + i).padStart(4, "0")}`,
        linkedin_url: `linkedin.com/in/lead${i}`,
        linkedin_about: "Marketing professional with 10+ years experience.",
        technologies: ["HubSpot", "Salesforce"],
        enrichment_status: "complete",
        enrichment_source: "apollo",
        verification_status: "valid",
        verification_source: "millionverifier",
        created_at: new Date().toISOString().split("T")[0],
        last_activity: "opened email 2 days ago",
        tags: [],
      });
    }

    this.leads = mockLeads;

    return {
      success: true,
      message: `Found ${mockLeads.length} leads matching criteria`,
      data: { leads: mockLeads, count: mockLeads.length },
      costEstimate: [
        {
          service: "Apollo",
          amount: count * 0.05, // $0.05 per lead
          currency: "USD",
        },
      ],
      sandboxMode: true,
    };
  }

  async simulateEmailVerification(leads: SandboxLead[]): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const results = {
      valid: 0,
      risky: 0,
      invalid: 0,
      catchall: 0,
    };

    leads.forEach(lead => {
      const status = lead.email_status;
      if (status === "valid") results.valid++;
      else if (status === "risky") results.risky++;
      else if (status === "invalid") results.invalid++;
      else if (status === "catchall") results.catchall++;
    });

    const total = leads.length;
    const cost = total * 0.0012; // MillionVerifier pricing

    return {
      success: true,
      message: `Verified ${total} emails`,
      data: {
        total,
        valid: results.valid,
        risky: results.risky,
        invalid: results.invalid,
        catchall: results.catchall,
        validPercentage: ((results.valid / total) * 100).toFixed(1),
      },
      costEstimate: [
        {
          service: "MillionVerifier",
          amount: cost,
          currency: "USD",
        },
      ],
      sandboxMode: true,
    };
  }

  async simulateCampaignLoad(
    campaignName: string,
    leads: SandboxLead[]
  ): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

    const dailyVolume = 45; // Default
    const estimatedDays = Math.ceil(leads.length / dailyVolume);

    return {
      success: true,
      message: `Campaign "${campaignName}" created with ${leads.length} leads`,
      data: {
        campaignName,
        leadsCount: leads.length,
        dailyVolume,
        estimatedDays,
        inboxes: 3,
      },
      costEstimate: [],
      sandboxMode: true,
    };
  }

  async simulateTimeProgression(
    days: number,
    campaignName?: string
  ): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 1000 + days * 100));

    const dailyVolume = 120;
    const totalLeads = 171; // Example
    const history = generateCampaignHistory(days, dailyVolume, totalLeads);

    const stats = history.reduce(
      (acc, day) => ({
        sent: acc.sent + day.sent,
        delivered: acc.delivered + day.delivered,
        opened: acc.opened + day.opened,
        clicked: acc.clicked + day.clicked,
        replied: acc.replied + day.replied,
        bounced: acc.bounced + day.bounced,
      }),
      {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0,
      }
    );

    const openRate = stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0;
    const replyRate = stats.sent > 0 ? (stats.replied / stats.sent) * 100 : 0;
    const clickRate = stats.sent > 0 ? (stats.clicked / stats.sent) * 100 : 0;

    return {
      success: true,
      message: `Simulated ${days} days of campaign activity`,
      data: {
        days,
        history,
        summary: {
          ...stats,
          openRate: openRate.toFixed(1),
          replyRate: replyRate.toFixed(1),
          clickRate: clickRate.toFixed(1),
        },
      },
      sandboxMode: true,
    };
  }

  async simulateEmailGeneration(params: {
    sender?: string;
    receiver?: string;
    senderWebsite?: string;
    receiverWebsite?: string;
  }): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));

    // Try to use real AI email generator if available
    try {
      const { generateColdEmail } = await import("../ai/email-generator");
      
      const sender = {
        name: params.sender?.split(" at ")[0] || params.sender || "John Doe",
        company: params.sender?.split(" at ")[1] || "TechFlow Solutions",
        website: params.senderWebsite || "techflow-demo.com",
        valueProposition: "AI-powered sales automation platform",
        industry: "SaaS",
      };

      const receiver = {
        name: params.receiver?.split(" at ")[0] || params.receiver || "Sarah Chen",
        title: "VP of Marketing",
        company: params.receiver?.split(" at ")[1] || "CloudStack Inc",
        website: params.receiverWebsite || "cloudstack-demo.com",
        industry: "SaaS",
      };

      const generated = await generateColdEmail({
        sender,
        receiver,
        emailType: "initial",
        tone: "professional",
        includePersonalization: true,
      });

      return {
        success: true,
        message: "Email generated successfully",
        data: {
          email: generated,
          sender,
          receiver,
        },
        sandboxMode: !process.env.ANTHROPIC_API_KEY,
      };
    } catch (error) {
      // Fallback to mock email
      const sender = {
        name: params.sender?.split(" at ")[0] || params.sender || "John Doe",
        company: params.sender?.split(" at ")[1] || "TechFlow Solutions",
        website: params.senderWebsite || "techflow-demo.com",
        valueProposition: "AI-powered sales automation platform",
      };

      const receiver = {
        name: params.receiver?.split(" at ")[0] || params.receiver || "Sarah Chen",
        title: "VP of Marketing",
        company: params.receiver?.split(" at ")[1] || "CloudStack Inc",
        website: params.receiverWebsite || "cloudstack-demo.com",
        industry: "SaaS",
      };

      const email = {
        subject: `Quick question about ${receiver.company}'s demand gen`,
        body: `Hi ${receiver.name},

I noticed ${receiver.company} is doing great work in the ${receiver.industry} space. As ${receiver.title}, you're probably dealing with the challenge of scaling demand generation efficiently.

${sender.company} helps companies like yours automate their sales outreach and improve conversion rates. We've helped similar SaaS companies increase their reply rates by 3x while saving 10+ hours per week.

Would you be open to a quick 15-minute call to see if there's a fit? No pressure at all.

Best,
${sender.name}
${sender.company}`,
        personalization: `I noticed ${receiver.company} is doing great work in the ${receiver.industry} space.`,
        reasoning: "Personalized opening with clear value proposition connecting to their role and industry.",
      };

      return {
        success: true,
        message: "Email generated successfully",
        data: {
          email,
          sender,
          receiver,
        },
        sandboxMode: true,
      };
    }
  }

  async simulateDeliverabilityCheck(): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const domains = [
      {
        name: "outreach-demo.com",
        health: 94,
        inboxPlacement: 94,
        spf: true,
        dkim: true,
        dmarc: true,
        blacklistStatus: "clean",
        ageDays: 180,
      },
      {
        name: "company-demo.com",
        health: 67,
        inboxPlacement: 67,
        spf: true,
        dkim: true,
        dmarc: false,
        blacklistStatus: "clean",
        ageDays: 90,
      },
      {
        name: "growth-demo.com",
        health: 89,
        inboxPlacement: 89,
        spf: true,
        dkim: true,
        dmarc: true,
        blacklistStatus: "clean",
        ageDays: 120,
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

    return {
      success: true,
      message: "Deliverability check completed",
      data: {
        overallHealth,
        domains,
        inboxes,
        issues: [
          {
            severity: "warning",
            message: "company-demo.com missing DMARC record",
            impact: "Inbox rate at risk",
          },
          {
            severity: "info",
            message: "sales@ at daily limit",
            impact: "Consider adding inbox",
          },
        ],
      },
      sandboxMode: true,
    };
  }

  async simulateACTLTracker(month?: string, date?: number, year?: number): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    const { generateACTLTracker } = await import("./actl-tracker");
    const trackerData = generateACTLTracker(month, date, year);
    
    return {
      success: true,
      message: `ACTL & Booked Meeting Tracker generated for ${trackerData.date}`,
      data: trackerData,
      sandboxMode: true,
    };
  }

  async simulateOverallCampaignStats(clientName?: string): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    
    const { generateOverallCampaignStats } = await import("./campaign-stats");
    const stats = generateOverallCampaignStats(clientName);
    
    return {
      success: true,
      message: `Overall campaign stats for ${stats.clientName}`,
      data: stats,
      sandboxMode: true,
    };
  }

  async simulateMeetingsCount(clientName?: string, campaignName?: string): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
    
    const { generateMeetingsData } = await import("./campaign-stats");
    const meetingsData = generateMeetingsData(clientName, campaignName);
    
    return {
      success: true,
      message: `Found ${meetingsData.count} meeting${meetingsData.count !== 1 ? 's' : ''} booked`,
      data: {
        count: meetingsData.count,
        clientName,
        campaignName,
      },
      sandboxMode: true,
    };
  }

  async simulateMeetingsDetails(clientName?: string, campaignName?: string): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
    
    const { generateMeetingsData } = await import("./campaign-stats");
    const meetingsData = generateMeetingsData(clientName, campaignName);
    
    return {
      success: true,
      message: `Meeting details for ${clientName || 'all clients'}${campaignName ? ` - ${campaignName}` : ''}`,
      data: meetingsData,
      sandboxMode: true,
    };
  }

  getLeads(): SandboxLead[] {
    return this.leads;
  }

  setLeads(leads: SandboxLead[]) {
    this.leads = leads;
  }
}

