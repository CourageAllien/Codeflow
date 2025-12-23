// Campaign stats and meetings data generator

export interface OverallCampaignStats {
  clientName: string;
  contractStartDate: string;
  totalEmailSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalReplied: number;
  totalPositiveReplies: number;
  totalBounced: number;
  totalMeetingsBooked: number;
  openRate: number;
  replyRate: number;
  clickRate: number;
  bounceRate: number;
  positiveReplyRate: number;
}

export interface MeetingDetail {
  id: string;
  prospectName: string;
  email: string;
  company: string;
  title: string;
  campaignName: string;
  meetingDate: string;
  meetingTime: string;
  status: "attended" | "no-show" | "cancelled" | "rescheduled";
  bookedDate: string;
  source: string; // Which email/sequence step led to booking
}

export function generateOverallCampaignStats(clientName?: string): OverallCampaignStats {
  const clients = [
    {
      name: "Adaline",
      contractStart: "2024-01-15",
      totalSent: 28480,
    },
    {
      name: "RocketReach",
      contractStart: "2023-11-20",
      totalSent: 53147,
    },
    {
      name: "Vibes",
      contractStart: "2024-02-01",
      totalSent: 29777,
    },
    {
      name: "Privy",
      contractStart: "2023-12-10",
      totalSent: 18192,
    },
    {
      name: "Uplead",
      contractStart: "2024-03-05",
      totalSent: 5000,
    },
    {
      name: "Humanly",
      contractStart: "2024-01-08",
      totalSent: 48022,
    },
    {
      name: "Consumer Optix",
      contractStart: "2023-10-15",
      totalSent: 21079,
    },
    {
      name: "Superstaff",
      contractStart: "2023-09-01",
      totalSent: 91060,
    },
    {
      name: "Evil Genius",
      contractStart: "2024-02-20",
      totalSent: 16158,
    },
  ];

  // More flexible client matching
  let client = clients[0]; // Default
  if (clientName) {
    const lowerClientName = clientName.toLowerCase();
    client = clients.find(c => 
      c.name.toLowerCase() === lowerClientName ||
      c.name.toLowerCase().includes(lowerClientName) ||
      lowerClientName.includes(c.name.toLowerCase())
    ) || clients.find(c => c.name.toLowerCase().startsWith(lowerClientName)) || clients[0];
  }
  
  const totalSent = client.totalSent;
  const totalDelivered = Math.floor(totalSent * 0.97);
  const totalOpened = Math.floor(totalSent * 0.55);
  const totalClicked = Math.floor(totalOpened * 0.12);
  const totalReplied = Math.floor(totalSent * 0.035);
  const totalPositiveReplies = Math.floor(totalReplied * 0.65);
  const totalBounced = Math.floor(totalSent * 0.02);
  const totalMeetingsBooked = Math.floor(totalPositiveReplies * 0.15);

  return {
    clientName: client.name,
    contractStartDate: client.contractStart,
    totalEmailSent: totalSent,
    totalDelivered,
    totalOpened,
    totalClicked,
    totalReplied,
    totalPositiveReplies,
    totalBounced,
    totalMeetingsBooked,
    openRate: (totalOpened / totalSent) * 100,
    replyRate: (totalReplied / totalSent) * 100,
    clickRate: (totalClicked / totalOpened) * 100,
    bounceRate: (totalBounced / totalSent) * 100,
    positiveReplyRate: (totalPositiveReplies / totalReplied) * 100,
  };
}

export function generateMeetingsData(
  clientName?: string,
  campaignName?: string
): { count: number; meetings: MeetingDetail[]; clientName?: string; campaignName?: string } {
  // Generate more meetings for better sandbox experience
  const allMeetings: MeetingDetail[] = [
    {
      id: "meeting_001",
      prospectName: "Sarah Chen",
      email: "sarah.chen@techflow-demo.com",
      company: "TechFlow Solutions",
      title: "VP of Marketing",
      campaignName: "Q4 SaaS Outreach",
      meetingDate: "2024-12-18",
      meetingTime: "2:00 PM EST",
      status: "attended",
      bookedDate: "2024-12-10",
      source: "Step 1 - Initial outreach",
    },
    {
      id: "meeting_002",
      prospectName: "Marcus Johnson",
      email: "marcus.johnson@cloudstack-demo.com",
      company: "CloudStack Inc",
      title: "Director of Sales",
      campaignName: "Q4 SaaS Outreach",
      meetingDate: "2024-12-20",
      meetingTime: "10:00 AM EST",
      status: "attended",
      bookedDate: "2024-12-12",
      source: "Step 2 - Follow-up",
    },
    {
      id: "meeting_003",
      prospectName: "Emily Rodriguez",
      email: "emily.rodriguez@saasify-demo.com",
      company: "SaaSify",
      title: "Marketing Director",
      campaignName: "Fintech Decision Makers",
      meetingDate: "2024-12-19",
      meetingTime: "3:30 PM EST",
      status: "no-show",
      bookedDate: "2024-12-11",
      source: "Step 1 - Initial outreach",
    },
    {
      id: "meeting_004",
      prospectName: "David Kim",
      email: "david.kim@datapipe-demo.com",
      company: "DataPipe",
      title: "CTO",
      campaignName: "Agency Partnership",
      meetingDate: "2024-12-21",
      meetingTime: "11:00 AM EST",
      status: "rescheduled",
      bookedDate: "2024-12-13",
      source: "Step 3 - Value-add follow-up",
    },
    {
      id: "meeting_005",
      prospectName: "Lisa Thompson",
      email: "lisa.thompson@flowmetrics-demo.com",
      company: "FlowMetrics",
      title: "Head of Growth",
      campaignName: "Q4 SaaS Outreach",
      meetingDate: "2024-12-17",
      meetingTime: "1:00 PM EST",
      status: "attended",
      bookedDate: "2024-12-09",
      source: "Step 1 - Initial outreach",
    },
    {
      id: "meeting_006",
      prospectName: "Michael Chen",
      email: "michael.chen@privy-demo.com",
      company: "Privy",
      title: "VP of Sales",
      campaignName: "Fintech Decision Makers",
      meetingDate: "2024-12-22",
      meetingTime: "2:30 PM EST",
      status: "cancelled",
      bookedDate: "2024-12-14",
      source: "Step 2 - Follow-up",
    },
    {
      id: "meeting_007",
      prospectName: "Jennifer Park",
      email: "jennifer.park@uplead-demo.com",
      company: "Uplead",
      title: "Marketing Manager",
      campaignName: "Agency Partnership",
      meetingDate: "2024-12-16",
      meetingTime: "4:00 PM EST",
      status: "attended",
      bookedDate: "2024-12-08",
      source: "Step 1 - Initial outreach",
    },
    // Privy meetings
    {
      id: "meeting_008",
      prospectName: "Robert Martinez",
      email: "robert.martinez@privy-demo.com",
      company: "Privy",
      title: "VP of Sales",
      campaignName: "Q4 SaaS Outreach",
      meetingDate: "2024-12-19",
      meetingTime: "2:00 PM EST",
      status: "attended",
      bookedDate: "2024-12-11",
      source: "Step 1 - Initial outreach",
    },
    {
      id: "meeting_009",
      prospectName: "Amanda Wilson",
      email: "amanda.wilson@privy-demo.com",
      company: "Privy",
      title: "Director of Marketing",
      campaignName: "Q4 SaaS Outreach",
      meetingDate: "2024-12-21",
      meetingTime: "11:00 AM EST",
      status: "no-show",
      bookedDate: "2024-12-13",
      source: "Step 2 - Follow-up",
    },
    // Adaline meetings
    {
      id: "meeting_010",
      prospectName: "James Anderson",
      email: "james.anderson@adaline-demo.com",
      company: "Adaline",
      title: "CTO",
      campaignName: "Fintech Decision Makers",
      meetingDate: "2024-12-18",
      meetingTime: "3:00 PM EST",
      status: "attended",
      bookedDate: "2024-12-10",
      source: "Step 1 - Initial outreach",
    },
    {
      id: "meeting_011",
      prospectName: "Patricia Brown",
      email: "patricia.brown@adaline-demo.com",
      company: "Adaline",
      title: "Head of Revenue",
      campaignName: "Agency Partnership",
      meetingDate: "2024-12-20",
      meetingTime: "10:30 AM EST",
      status: "rescheduled",
      bookedDate: "2024-12-12",
      source: "Step 3 - Value-add follow-up",
    },
    // RocketReach meetings
    {
      id: "meeting_012",
      prospectName: "Christopher Lee",
      email: "christopher.lee@rocketreach-demo.com",
      company: "RocketReach",
      title: "VP of Marketing",
      campaignName: "Q4 SaaS Outreach",
      meetingDate: "2024-12-17",
      meetingTime: "1:30 PM EST",
      status: "attended",
      bookedDate: "2024-12-09",
      source: "Step 1 - Initial outreach",
    },
    {
      id: "meeting_013",
      prospectName: "Nancy Taylor",
      email: "nancy.taylor@rocketreach-demo.com",
      company: "RocketReach",
      title: "Sales Director",
      campaignName: "Fintech Decision Makers",
      meetingDate: "2024-12-22",
      meetingTime: "2:00 PM EST",
      status: "cancelled",
      bookedDate: "2024-12-14",
      source: "Step 2 - Follow-up",
    },
  ];

  // Filter by client if specified
  let filtered = allMeetings;
  if (clientName) {
    // Map client names to company names in meetings
    const clientToCompany: Record<string, string> = {
      "privy": "Privy",
      "adaline": "Adaline",
      "rocketreach": "RocketReach",
      "vibes": "Vibes",
      "uplead": "Uplead",
      "humanly": "Humanly",
      "consumer optix": "Consumer Optix",
      "superstaff": "Superstaff",
      "evil genius": "Evil Genius",
    };
    
    const companyName = clientToCompany[clientName.toLowerCase()];
    if (companyName) {
      filtered = allMeetings.filter(m => m.company === companyName);
    } else {
      // If no exact match, try partial match
      filtered = allMeetings.filter(m => 
        m.company.toLowerCase().includes(clientName.toLowerCase()) ||
        m.prospectName.toLowerCase().includes(clientName.toLowerCase())
      );
    }
  }

  // Filter by campaign if specified
  if (campaignName) {
    filtered = filtered.filter(m => 
      m.campaignName.toLowerCase().includes(campaignName.toLowerCase())
    );
  }

  return {
    count: filtered.length,
    meetings: filtered,
    clientName,
    campaignName,
  };
}

