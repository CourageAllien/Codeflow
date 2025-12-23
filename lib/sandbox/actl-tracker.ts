// ACTL & Booked Meeting Tracker data generator

export interface ACTLClientData {
  clientName: string;
  completionRate: number;
  positiveReplies: number;
  totalReplies: number;
  totalEmailSent: number;
  meetingsBooked: number | string;
  replyRate: number;
  positiveReplyRate: number;
  positiveReplyToMeeting: number | string;
  healthScore: string;
  notes: string;
}

export interface ACTLTrackerData {
  date: string;
  clients: ACTLClientData[];
  totals: {
    completionRate: number;
    positiveReplies: number;
    totalReplies: number;
    totalEmailSent: number;
    meetingsBooked: number;
    replyRate: number;
    positiveReplyRate: number;
    positiveReplyToMeeting: number;
  };
}

export function generateACTLTracker(
  month?: string,
  date?: number,
  year?: number
): ACTLTrackerData {
  const now = new Date();
  
  // Handle month - convert abbreviations to full names if needed
  let reportMonth: string;
  if (month) {
    const monthLower = month.toLowerCase();
    const monthMap: Record<string, string> = {
      jan: "January", january: "January",
      feb: "February", february: "February",
      mar: "March", march: "March",
      apr: "April", april: "April",
      may: "May",
      jun: "June", june: "June",
      jul: "July", july: "July",
      aug: "August", august: "August",
      sep: "September", september: "September",
      oct: "October", october: "October",
      nov: "November", november: "November",
      dec: "December", december: "December"
    };
    reportMonth = monthMap[monthLower] || month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  } else {
    reportMonth = now.toLocaleString('default', { month: 'long' });
  }
  
  const reportDate = date || now.getDate();
  const reportYear = year || now.getFullYear();
  
  const dateString = `${reportMonth} ${reportDate}, ${reportYear}`;
  
  // Generate realistic client data based on the spreadsheet pattern
  const clients: ACTLClientData[] = [
    {
      clientName: "Adaline",
      completionRate: 100.00,
      positiveReplies: 1,
      totalReplies: 62,
      totalEmailSent: 28480,
      meetingsBooked: "-",
      replyRate: 0.22,
      positiveReplyRate: 1.61,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "3 - low RR + low PR + needs leads",
      notes: "",
    },
    {
      clientName: "RocketReach",
      completionRate: 99.99,
      positiveReplies: 9,
      totalReplies: 92,
      totalEmailSent: 53147,
      meetingsBooked: 1,
      replyRate: 0.17,
      positiveReplyRate: 9.78,
      positiveReplyToMeeting: 11.11,
      healthScore: "2 - low RR + needs leads",
      notes: "",
    },
    {
      clientName: "Vibes",
      completionRate: 99.88,
      positiveReplies: 9,
      totalReplies: 84,
      totalEmailSent: 29777,
      meetingsBooked: 1,
      replyRate: 0.28,
      positiveReplyRate: 10.71,
      positiveReplyToMeeting: 11.11,
      healthScore: "2 - low RR + needs leads",
      notes: "",
    },
    {
      clientName: "Evil Genius",
      completionRate: 100.00,
      positiveReplies: 4,
      totalReplies: 73,
      totalEmailSent: 16158,
      meetingsBooked: "-",
      replyRate: 0.45,
      positiveReplyRate: 5.48,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "2 - low PR + needs leads",
      notes: "",
    },
    {
      clientName: "Humanly",
      completionRate: 99.92,
      positiveReplies: 3,
      totalReplies: 186,
      totalEmailSent: 48022,
      meetingsBooked: "-",
      replyRate: 0.39,
      positiveReplyRate: 1.61,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "2 - low PR + needs leads",
      notes: "",
    },
    {
      clientName: "Consumer Optix",
      completionRate: 100.00,
      positiveReplies: 3,
      totalReplies: 157,
      totalEmailSent: 21079,
      meetingsBooked: "-",
      replyRate: 0.74,
      positiveReplyRate: 1.91,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "2 - low PR + needs leads",
      notes: "",
    },
    {
      clientName: "Superstaff",
      completionRate: 74.18,
      positiveReplies: 4,
      totalReplies: 256,
      totalEmailSent: 91060,
      meetingsBooked: "-",
      replyRate: 0.28,
      positiveReplyRate: 1.56,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "2 - low RR + low PR",
      notes: "",
    },
    {
      clientName: "Cold Email Hackers/CEH/StoryGen",
      completionRate: 100.00,
      positiveReplies: 4,
      totalReplies: 66,
      totalEmailSent: 17376,
      meetingsBooked: 1,
      replyRate: 0.38,
      positiveReplyRate: 6.06,
      positiveReplyToMeeting: 25.00,
      healthScore: "1 - needs leads",
      notes: "",
    },
    {
      clientName: "Privy",
      completionRate: 98.22,
      positiveReplies: 8,
      totalReplies: 127,
      totalEmailSent: 18192,
      meetingsBooked: 2,
      replyRate: 0.70,
      positiveReplyRate: 6.30,
      positiveReplyToMeeting: 25.00,
      healthScore: "1 - needs leads",
      notes: "",
    },
    {
      clientName: "1bios",
      completionRate: 90.72,
      positiveReplies: 4,
      totalReplies: 49,
      totalEmailSent: 8122,
      meetingsBooked: "-",
      replyRate: 0.60,
      positiveReplyRate: 8.16,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "1 - needs leads",
      notes: "",
    },
    {
      clientName: "Allin Advisors",
      completionRate: 85.53,
      positiveReplies: 9,
      totalReplies: 112,
      totalEmailSent: 17067,
      meetingsBooked: "-",
      replyRate: 0.66,
      positiveReplyRate: 8.04,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "1 - needs leads",
      notes: "",
    },
    {
      clientName: "Interdependence",
      completionRate: 72.72,
      positiveReplies: 10,
      totalReplies: 95,
      totalEmailSent: 39196,
      meetingsBooked: "-",
      replyRate: 0.24,
      positiveReplyRate: 10.53,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "1 - low RR",
      notes: "",
    },
    {
      clientName: "PokerPower",
      completionRate: 61.64,
      positiveReplies: 3,
      totalReplies: 107,
      totalEmailSent: 11916,
      meetingsBooked: 1,
      replyRate: 0.90,
      positiveReplyRate: 2.80,
      positiveReplyToMeeting: 33.33,
      healthScore: "1 - low PR",
      notes: "",
    },
    {
      clientName: "iDecide",
      completionRate: 43.07,
      positiveReplies: 5,
      totalReplies: 91,
      totalEmailSent: 17928,
      meetingsBooked: "-",
      replyRate: 0.51,
      positiveReplyRate: 5.49,
      positiveReplyToMeeting: "#VALUE!",
      healthScore: "1 - low PR",
      notes: "",
    },
    {
      clientName: "Uplead",
      completionRate: 78.51,
      positiveReplies: 11,
      totalReplies: 41,
      totalEmailSent: 5000,
      meetingsBooked: 1,
      replyRate: 0.82,
      positiveReplyRate: 26.83,
      positiveReplyToMeeting: 9.09,
      healthScore: "✔ Good",
      notes: "",
    },
  ];
  
  // Calculate totals
  const totals = clients.reduce(
    (acc, client) => {
      acc.positiveReplies += client.positiveReplies;
      acc.totalReplies += client.totalReplies;
      acc.totalEmailSent += client.totalEmailSent;
      acc.meetingsBooked += typeof client.meetingsBooked === "number" ? client.meetingsBooked : 0;
      return acc;
    },
    {
      completionRate: 0,
      positiveReplies: 0,
      totalReplies: 0,
      totalEmailSent: 0,
      meetingsBooked: 0,
      replyRate: 0,
      positiveReplyRate: 0,
      positiveReplyToMeeting: 0,
    }
  );
  
  totals.completionRate = (clients.reduce((sum, c) => sum + c.completionRate, 0) / clients.length);
  totals.replyRate = totals.totalEmailSent > 0 ? (totals.totalReplies / totals.totalEmailSent) * 100 : 0;
  totals.positiveReplyRate = totals.totalReplies > 0 ? (totals.positiveReplies / totals.totalReplies) * 100 : 0;
  totals.positiveReplyToMeeting = totals.positiveReplies > 0 ? (totals.meetingsBooked / totals.positiveReplies) * 100 : 0;
  
  return {
    date: dateString,
    clients,
    totals,
  };
}

