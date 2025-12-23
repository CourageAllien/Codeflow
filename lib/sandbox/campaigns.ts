// Sandbox campaign data generator

export interface SandboxCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "completed";
  leads_total: number;
  leads_contacted: number;
  leads_remaining: number;
  sequence_steps: number;
  daily_send_volume: number;
  started_at: string;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    positive_replies: number;
    neutral_replies: number;
    negative_replies: number;
    bounced: number;
    meetings_booked: number;
  };
  daily_history: Array<{
    day: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
  }>;
}

export function generateCampaignHistory(
  days: number,
  dailyVolume: number,
  totalLeads: number
): Array<{
  day: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
}> {
  const history = [];
  let totalSent = 0;

  for (let day = 0; day < days; day++) {
    const remaining = totalLeads - totalSent;
    const sent = Math.min(
      Math.floor(dailyVolume * (0.9 + Math.random() * 0.2)),
      remaining
    );
    const openRate = 0.45 + Math.random() * 0.25;
    const replyRate = 0.02 + Math.random() * 0.04;
    const clickRate = 0.12 + Math.random() * 0.08;

    const delivered = Math.floor(sent * 0.97);
    const opened = Math.floor(sent * openRate);
    const clicked = Math.floor(sent * openRate * clickRate);
    const replied = Math.floor(sent * replyRate);
    const bounced = Math.floor(sent * 0.02);

    history.push({
      day: day + 1,
      sent,
      delivered,
      opened,
      clicked,
      replied,
      bounced,
    });

    totalSent += sent;
    if (totalSent >= totalLeads) break;
  }

  return history;
}

export function generateSandboxCampaigns(): SandboxCampaign[] {
  const campaigns: SandboxCampaign[] = [];

  // Campaign 1: Q4 SaaS Outreach
  const campaign1History = generateCampaignHistory(30, 120, 2340);
  const campaign1Stats = campaign1History.reduce(
    (acc, day) => ({
      sent: acc.sent + day.sent,
      delivered: acc.delivered + day.delivered,
      opened: acc.opened + day.opened,
      clicked: acc.clicked + day.clicked,
      replied: acc.replied + day.replied,
      bounced: acc.bounced + day.bounced,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }),
    {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }
  );
  campaign1Stats.positive_replies = Math.floor(campaign1Stats.replied * 0.66);
  campaign1Stats.neutral_replies = Math.floor(campaign1Stats.replied * 0.23);
  campaign1Stats.negative_replies = campaign1Stats.replied - campaign1Stats.positive_replies - campaign1Stats.neutral_replies;
  campaign1Stats.meetings_booked = Math.floor(campaign1Stats.positive_replies * 0.15);

  campaigns.push({
    id: "campaign_001",
    name: "Q4 SaaS Outreach",
    status: "active",
    leads_total: 2340,
    leads_contacted: 1890,
    leads_remaining: 450,
    sequence_steps: 4,
    daily_send_volume: 120,
    started_at: "2024-01-01",
    stats: campaign1Stats,
    daily_history: campaign1History,
  });

  // Campaign 2: Fintech Decision Makers
  const campaign2History = generateCampaignHistory(20, 60, 890);
  const campaign2Stats = campaign2History.reduce(
    (acc, day) => ({
      sent: acc.sent + day.sent,
      delivered: acc.delivered + day.delivered,
      opened: acc.opened + day.opened,
      clicked: acc.clicked + day.clicked,
      replied: acc.replied + day.replied,
      bounced: acc.bounced + day.bounced,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }),
    {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }
  );
  campaign2Stats.positive_replies = Math.floor(campaign2Stats.replied * 0.60);
  campaign2Stats.neutral_replies = Math.floor(campaign2Stats.replied * 0.30);
  campaign2Stats.negative_replies = campaign2Stats.replied - campaign2Stats.positive_replies - campaign2Stats.neutral_replies;
  campaign2Stats.meetings_booked = Math.floor(campaign2Stats.positive_replies * 0.12);

  campaigns.push({
    id: "campaign_002",
    name: "Fintech Decision Makers",
    status: "active",
    leads_total: 890,
    leads_contacted: 645,
    leads_remaining: 245,
    sequence_steps: 4,
    daily_send_volume: 60,
    started_at: "2024-01-05",
    stats: campaign2Stats,
    daily_history: campaign2History,
  });

  // Campaign 3: Agency Partnership
  const campaign3History = generateCampaignHistory(15, 40, 312);
  const campaign3Stats = campaign3History.reduce(
    (acc, day) => ({
      sent: acc.sent + day.sent,
      delivered: acc.delivered + day.delivered,
      opened: acc.opened + day.opened,
      clicked: acc.clicked + day.clicked,
      replied: acc.replied + day.replied,
      bounced: acc.bounced + day.bounced,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }),
    {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }
  );
  campaign3Stats.positive_replies = Math.floor(campaign3Stats.replied * 0.70);
  campaign3Stats.neutral_replies = Math.floor(campaign3Stats.replied * 0.20);
  campaign3Stats.negative_replies = campaign3Stats.replied - campaign3Stats.positive_replies - campaign3Stats.neutral_replies;
  campaign3Stats.meetings_booked = Math.floor(campaign3Stats.positive_replies * 0.18);

  campaigns.push({
    id: "campaign_003",
    name: "Agency Partnership",
    status: "active",
    leads_total: 312,
    leads_contacted: 312,
    leads_remaining: 0,
    sequence_steps: 4,
    daily_send_volume: 40,
    started_at: "2024-01-10",
    stats: campaign3Stats,
    daily_history: campaign3History,
  });

  // Campaign 4: Healthcare Outreach (paused)
  campaigns.push({
    id: "campaign_004",
    name: "Healthcare Outreach",
    status: "paused",
    leads_total: 500,
    leads_contacted: 200,
    leads_remaining: 300,
    sequence_steps: 4,
    daily_send_volume: 50,
    started_at: "2024-01-08",
    stats: {
      sent: 200,
      delivered: 194,
      opened: 68,
      clicked: 8,
      replied: 1,
      positive_replies: 0,
      neutral_replies: 1,
      negative_replies: 0,
      bounced: 6,
      meetings_booked: 0,
    },
    daily_history: generateCampaignHistory(4, 50, 200),
  });

  // Campaign 5: E-commerce Q1 (draft)
  campaigns.push({
    id: "campaign_005",
    name: "E-commerce Q1",
    status: "draft",
    leads_total: 500,
    leads_contacted: 0,
    leads_remaining: 500,
    sequence_steps: 4,
    daily_send_volume: 0,
    started_at: "",
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      bounced: 0,
      meetings_booked: 0,
    },
    daily_history: [],
  });

  // Campaign 6: Founder Warm Intro (completed)
  const campaign6History = generateCampaignHistory(25, 50, 890);
  const campaign6Stats = campaign6History.reduce(
    (acc, day) => ({
      sent: acc.sent + day.sent,
      delivered: acc.delivered + day.delivered,
      opened: acc.opened + day.opened,
      clicked: acc.clicked + day.clicked,
      replied: acc.replied + day.replied,
      bounced: acc.bounced + day.bounced,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }),
    {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      positive_replies: 0,
      neutral_replies: 0,
      negative_replies: 0,
      meetings_booked: 0,
    }
  );
  campaign6Stats.positive_replies = Math.floor(campaign6Stats.replied * 0.65);
  campaign6Stats.neutral_replies = Math.floor(campaign6Stats.replied * 0.25);
  campaign6Stats.negative_replies = campaign6Stats.replied - campaign6Stats.positive_replies - campaign6Stats.neutral_replies;
  campaign6Stats.meetings_booked = Math.floor(campaign6Stats.positive_replies * 0.14);

  campaigns.push({
    id: "campaign_006",
    name: "Founder Warm Intro",
    status: "completed",
    leads_total: 890,
    leads_contacted: 890,
    leads_remaining: 0,
    sequence_steps: 4,
    daily_send_volume: 0,
    started_at: "2023-12-01",
    stats: campaign6Stats,
    daily_history: campaign6History,
  });

  return campaigns;
}

