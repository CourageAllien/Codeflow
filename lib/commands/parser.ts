// Natural language command parser using Claude API

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface ParsedCommand {
  action: string;
  parameters: Record<string, any>;
  source?: string;
  intent: "search" | "enrich" | "verify" | "campaign" | "analytics" | "deliverability" | "reply" | "workflow" | "export" | "other";
  confidence: number;
}

const SYSTEM_PROMPT = `You are an intelligent command parser for ColdFlow, a cold email command center. Your job is to understand ANY natural language input and convert it into actionable commands.

The user can type anything in plain English - be very flexible and interpret their intent. Examples:
- "I need 200 marketing people at SaaS companies" → find leads
- "Check if these emails are valid" → verify emails
- "Show me my campaigns" → show campaigns
- "What's the status of my domain?" → check deliverability
- "I want to send emails to these leads" → create/load campaign
- "How are my campaigns performing?" → show analytics

Available capabilities (interpret user intent to these):
- find/search/get/need/want: Find leads (extract: count, job titles, industry, location, company size, etc.)
- enrich/add data/get more info: Enrich leads with additional data
- verify/check/validate: Verify email addresses
- create/make/start/new: Create a new campaign
- load/add/send/put: Load leads into campaign
- pause/stop/halt: Pause campaign
- resume/continue/start: Resume campaign
- show/display/list/view/see: Display information (campaigns, replies, stats, etc.)
- check/analyze/review: Check deliverability, domain health, campaign performance
- generate/write/create/draft/compose: Generate cold emails (extract: sender info, receiver info, websites)
- actl tracker/booked meeting tracker: Generate ACTL & Booked Meeting Tracker dashboard (extract: month, date, year)
- simulate/test/run: Simulate time progression
- export/download/save: Export data
- help/guide/commands: Show help

Be VERY flexible with natural language. Extract any numbers, names, industries, locations, etc. from the user's input.

Return JSON in this format:
{
  "action": "action_name",
  "parameters": { ... },
  "source": "inferred_source_if_applicable",
  "intent": "search|enrich|verify|campaign|analytics|deliverability|reply|workflow|export|other",
  "confidence": 0.0-1.0
}

Interpret creatively - if the user says something unclear, make your best guess and set confidence accordingly.

Special format for ACTL Tracker:
- "Give me ACTL & Booked Meeting Tracker for December 5 2024" → action: "actl_tracker", parameters: { month: "December", date: 5, year: 2024 }
- "Show ACTL tracker for January 15 2025" → action: "actl_tracker", parameters: { month: "January", date: 15, year: 2025 }
- Extract month (full name or abbreviation), date (1-31), and year (4 digits)`;

export async function parseCommand(commandText: string): Promise<ParsedCommand> {
  // If no API key, use fallback parsing (for demo/sandbox mode)
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackParse(commandText);
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Parse this command: "${commandText}"`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedCommand;
    
    // Validate and set defaults
    if (!parsed.intent) {
      parsed.intent = inferIntent(parsed.action);
    }
    if (parsed.confidence === undefined) {
      parsed.confidence = 0.8;
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing command:", error);
    // Fallback to simple parsing
    return fallbackParse(commandText);
  }
}

function inferIntent(action: string): ParsedCommand["intent"] {
  const actionLower = action.toLowerCase();
  if (actionLower.includes("find") || actionLower.includes("search")) return "search";
  if (actionLower.includes("enrich")) return "enrich";
  if (actionLower.includes("verify")) return "verify";
  if (actionLower.includes("campaign")) return "campaign";
  if (actionLower.includes("show") || actionLower.includes("compare") || actionLower.includes("stats")) return "analytics";
  if (actionLower.includes("domain") || actionLower.includes("deliverability") || actionLower.includes("health")) return "deliverability";
  if (actionLower.includes("reply") || actionLower.includes("replies")) return "reply";
  if (actionLower.includes("workflow") || actionLower.includes("automate")) return "workflow";
  if (actionLower.includes("export")) return "export";
  return "other";
}

function fallbackParse(commandText: string): ParsedCommand {
  const lower = commandText.toLowerCase().trim();
  
  // ACTL & Booked Meeting Tracker - Check FIRST before anything else
  const hasACTL = lower.includes("actl");
  const hasTracker = lower.includes("tracker") && lower.includes("booked") && lower.includes("meeting");
  
  if (hasACTL || hasTracker) {
    // More flexible date parsing
    let month: string | undefined;
    let date: number | undefined;
    let year: number | undefined;
    
    // Try to match full month names first
    const fullMonthMatch = lower.match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i);
    if (fullMonthMatch) {
      month = fullMonthMatch[1];
    } else {
      // Try abbreviated months
      const abbrevMonthMatch = lower.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i);
      if (abbrevMonthMatch) {
        const abbrev = abbrevMonthMatch[1].toLowerCase();
        const monthMap: Record<string, string> = {
          jan: "January", feb: "February", mar: "March", apr: "April",
          may: "May", jun: "June", jul: "July", aug: "August",
          sep: "September", oct: "October", nov: "November", dec: "December"
        };
        month = monthMap[abbrev];
      }
    }
    
    // Extract date (1-31)
    const dateMatch = lower.match(/\b([1-9]|[12]\d|3[01])\b/);
    if (dateMatch) {
      date = parseInt(dateMatch[1]);
    }
    
    // Extract year (4 digits, preferably 20xx)
    const yearMatch = lower.match(/\b(20\d{2}|\d{4})\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1]);
      // If year is 2 digits, assume 20xx
      if (year < 100) {
        year = 2000 + year;
      }
    } else {
      // Default to current year if not specified
      year = new Date().getFullYear();
    }
    
    return {
      action: "actl_tracker",
      parameters: {
        month,
        date,
        year,
      },
      intent: "analytics",
      confidence: 0.95, // High confidence for ACTL tracker
    };
  }
  
  // Very flexible natural language parsing
  // Check for lead search intent (find, search, get, need, want, looking for, etc.)
  const searchKeywords = ["find", "search", "get", "need", "want", "looking for", "show me", "give me", "i need", "i want"];
  const searchContext = lower.includes("lead") || lower.includes("contact") || lower.includes("person") || 
     lower.includes("director") || lower.includes("manager") || lower.includes("vp") || 
     lower.includes("ceo") || lower.includes("cto") || lower.includes("marketing") || 
     lower.includes("sales") || lower.includes("startup") || lower.includes("company") ||
     lower.match(/\d+\s+(people|contacts|leads)/) ||
     (lower.includes("at") && (lower.includes("company") || lower.includes("startup")));
  
  const isSearchIntent = searchKeywords.some(keyword => lower.includes(keyword)) && searchContext;
  
  if (isSearchIntent) {
    const countMatch = lower.match(/(\d+)/);
    const count = countMatch ? parseInt(countMatch[1]) : 100;
    
    // Extract titles - more comprehensive
    const titlePatterns = [
      /(marketing\s+director|marketing\s+manager|marketing\s+head)/i,
      /(sales\s+director|sales\s+manager|sales\s+head|vp\s+of\s+sales)/i,
      /(cto|chief\s+technology\s+officer)/i,
      /(ceo|chief\s+executive\s+officer)/i,
      /(vp\s+of\s+marketing|vp\s+of\s+sales)/i,
      /(director|manager|head)/i,
    ];
    
    let titles: string[] | undefined;
    for (const pattern of titlePatterns) {
      const match = lower.match(pattern);
      if (match) {
        titles = [match[1]];
        break;
      }
    }
    
    // Extract industry - more comprehensive
    const industryPatterns = [
      /(saas|software\s+as\s+a\s+service)/i,
      /(fintech|financial\s+technology)/i,
      /(e-commerce|ecommerce)/i,
      /(healthcare|health\s+care)/i,
      /(agency|marketing\s+agency)/i,
      /(startup|start-ups)/i,
    ];
    
    let industry: string | undefined;
    for (const pattern of industryPatterns) {
      const match = lower.match(pattern);
      if (match) {
        industry = match[1].toLowerCase();
        break;
      }
    }
    
    // Extract location - more comprehensive
    const locationPatterns = [
      /(california|ca)/i,
      /(texas|tx)/i,
      /(new\s+york|ny)/i,
      /(florida|fl)/i,
      /(usa|united\s+states|us)/i,
      /(uk|united\s+kingdom)/i,
      /(canada)/i,
    ];
    
    let location: { country?: string; state?: string } | undefined;
    for (const pattern of locationPatterns) {
      const match = lower.match(pattern);
      if (match) {
        const loc = match[1].toLowerCase();
        if (loc === "ca" || loc === "california") location = { state: "California", country: "USA" };
        else if (loc === "tx" || loc === "texas") location = { state: "Texas", country: "USA" };
        else if (loc === "ny" || loc === "new york") location = { state: "New York", country: "USA" };
        else if (loc === "fl" || loc === "florida") location = { state: "Florida", country: "USA" };
        else location = { country: match[1] };
        break;
      }
    }
    
    // Extract employee range
    const employeeMatch = lower.match(/(\d+)\s*-\s*(\d+)\s*(employees?|people)/i);
    let employee_range: { min?: number; max?: number } | undefined;
    if (employeeMatch) {
      employee_range = {
        min: parseInt(employeeMatch[1]),
        max: parseInt(employeeMatch[2]),
      };
    }
    
    return {
      action: "find",
      parameters: { count, titles, industry, location, employee_range },
      intent: "search",
      confidence: 0.8,
    };
  }
  
  // Verify intent (verify, check, validate emails) - check before other "check" commands
  const verifyKeywords = ["verify", "validate", "are these valid", "email status"];
  if (verifyKeywords.some(keyword => lower.includes(keyword)) && 
      (lower.includes("email") || lower.includes("lead") || lower.includes("contact") || 
       lower.includes("these") || lower.includes("are these"))) {
    return {
      action: "verify",
      parameters: { target: "current_leads" },
      intent: "verify",
      confidence: 0.8,
    };
  }
  
  // "Check if these are valid" - specific pattern
  if (lower.includes("check") && lower.includes("valid") && 
      (lower.includes("these") || lower.includes("email") || lower.includes("lead"))) {
    return {
      action: "verify",
      parameters: { target: "current_leads" },
      intent: "verify",
      confidence: 0.8,
    };
  }
  
  // Enrich intent
  if (lower.includes("enrich") || lower.includes("add data") || lower.includes("get more info")) {
    return {
      action: "enrich",
      parameters: { source: "apollo" },
      intent: "enrich",
      confidence: 0.7,
    };
  }
  
  // Campaign load intent (load, add, send, put into campaign)
  const loadKeywords = ["load", "add", "send", "put", "move"];
  if (loadKeywords.some(keyword => lower.includes(keyword)) && 
      (lower.includes("campaign") || lower.includes("into"))) {
    const campaignMatch = lower.match(/campaign\s+["']?([^"']+)["']?/i) || 
                          lower.match(/into\s+["']?([^"']+)["']?/i) ||
                          lower.match(/["']([^"']+)["']/i);
    const campaignName = campaignMatch ? campaignMatch[1] : "New Campaign";
    return {
      action: "load_into_campaign",
      parameters: { campaign_name: campaignName },
      intent: "campaign",
      confidence: 0.7,
    };
  }
  
  // Create campaign intent
  const createKeywords = ["create", "make", "start", "new campaign", "set up"];
  if (createKeywords.some(keyword => lower.includes(keyword)) && lower.includes("campaign")) {
    // Try multiple patterns for campaign name
    let campaignName = "New Campaign";
    
    // Pattern 1: "called Q1 Outreach" or "named Q1 Outreach"
    const calledMatch = lower.match(/(?:called|named)\s+["']?([^"']+)["']?/i);
    if (calledMatch) {
      campaignName = calledMatch[1].trim();
    } else {
      // Pattern 2: "campaign Q1 Outreach" or "campaign 'Q1 Outreach'"
      const campaignMatch = lower.match(/campaign\s+["']?([^"']+)["']?/i);
      if (campaignMatch) {
        campaignName = campaignMatch[1].trim();
      } else {
        // Pattern 3: Quoted name
        const quotedMatch = lower.match(/["']([^"']+)["']/i);
        if (quotedMatch) {
          campaignName = quotedMatch[1].trim();
        }
      }
    }
    
    return {
      action: "create_campaign",
      parameters: { name: campaignName },
      intent: "campaign",
      confidence: 0.8,
    };
  }
  
  // Simulate intent - handle "what would happen" questions
  if (lower.includes("simulate") || lower.includes("test") || lower.includes("run") || 
      (lower.includes("fast forward") || lower.includes("time")) ||
      (lower.includes("what would happen") && (lower.includes("run") || lower.includes("campaign")))) {
    let days = 7;
    const daysMatch = lower.match(/(\d+)\s*(days?|weeks?|months?)/i);
    if (daysMatch) {
      days = parseInt(daysMatch[1]);
      // Convert weeks/months to days
      if (lower.includes("week")) days = days * 7;
      if (lower.includes("month")) days = days * 30;
    }
    return {
      action: "simulate",
      parameters: { days },
      intent: "analytics",
      confidence: 0.8,
    };
  }
  
  // Pause/Resume campaign intent - check before show campaigns
  if ((lower.includes("pause") || lower.includes("stop") || lower.includes("halt")) && lower.includes("campaign")) {
    const campaignMatch = lower.match(/campaign\s+["']?([^"']+)["']?/i) ||
                          lower.match(/["']([^"']+)["']/i);
    const campaignName = campaignMatch ? campaignMatch[1].trim() : undefined;
    return {
      action: "pause_campaign",
      parameters: { campaign_name: campaignName },
      intent: "campaign",
      confidence: 0.8,
    };
  }
  
  if ((lower.includes("resume") || lower.includes("continue") || lower.includes("start")) && lower.includes("campaign")) {
    const campaignMatch = lower.match(/campaign\s+["']?([^"']+)["']?/i) ||
                          lower.match(/["']([^"']+)["']/i);
    const campaignName = campaignMatch ? campaignMatch[1].trim() : undefined;
    return {
      action: "resume_campaign",
      parameters: { campaign_name: campaignName },
      intent: "campaign",
      confidence: 0.8,
    };
  }
  
  // Compare campaigns intent
  if (lower.includes("compare") && lower.includes("campaign")) {
    return {
      action: "campaign_performance",
      parameters: { compare: true },
      intent: "analytics",
      confidence: 0.9,
    };
  }
  
  // Analytics queries - check before show campaigns
  if ((lower.includes("how") || lower.includes("what")) && 
      (lower.includes("open rate") || lower.includes("reply rate") || lower.includes("performance") || 
       lower.includes("doing") || lower.includes("stats"))) {
    return {
      action: "campaign_performance",
      parameters: {},
      intent: "analytics",
      confidence: 0.8,
    };
  }
  
  // "Show me last week's stats" or similar time-based queries
  if ((lower.includes("show") || lower.includes("last") || lower.includes("week")) && 
      lower.includes("stats")) {
    return {
      action: "campaign_performance",
      parameters: { period: "week" },
      intent: "analytics",
      confidence: 0.8,
    };
  }
  
  // Show campaigns intent - check for campaign status, performance, etc.
  if ((lower.includes("show") || lower.includes("display") || lower.includes("list") || 
       lower.includes("view") || lower.includes("see") || lower.includes("what")) && 
      (lower.includes("campaign") || lower.includes("all my"))) {
    // Check if asking about performance/stats
    if (lower.includes("performance") || lower.includes("stats") || lower.includes("status") || 
        lower.includes("doing") || lower.includes("open rate") || lower.includes("reply rate")) {
      return {
        action: "campaign_performance",
        parameters: {},
        intent: "analytics",
        confidence: 0.8,
      };
    }
    return {
      action: "show_campaigns",
      parameters: {},
      intent: "campaign",
      confidence: 0.7,
    };
  }
  
  // Show replies intent - handle variations
  if ((lower.includes("show") || lower.includes("display") || lower.includes("see") || 
       lower.includes("what") || lower.includes("any")) && 
      (lower.includes("repl") || lower.includes("response"))) {
    // Check for specific types
    if (lower.includes("unread") || lower.includes("new")) {
      return {
        action: "show_replies",
        parameters: { filter: "unread" },
        intent: "reply",
        confidence: 0.8,
      };
    }
    if (lower.includes("positive") || lower.includes("good")) {
      return {
        action: "show_replies",
        parameters: { filter: "positive" },
        intent: "reply",
        confidence: 0.8,
      };
    }
    if (lower.includes("today")) {
      return {
        action: "show_replies",
        parameters: { filter: "today" },
        intent: "reply",
        confidence: 0.8,
      };
    }
    return {
      action: "show_replies",
      parameters: {},
      intent: "reply",
      confidence: 0.7,
    };
  }
  
  // Deliverability check intent
  const deliverabilityKeywords = ["domain", "deliverability", "health", "reputation", "inbox", "placement", "warmup"];
  if (deliverabilityKeywords.some(keyword => lower.includes(keyword)) || 
      (lower.includes("check") && (lower.includes("status") || lower.includes("how"))) ||
      (lower.includes("what") && lower.includes("health"))) {
    return {
      action: "check_deliverability",
      parameters: {},
      intent: "deliverability",
      confidence: 0.8,
    };
  }
  
  // Email generation intent - very flexible matching
  const emailGenKeywords = ["generate", "write", "create", "draft", "compose", "make", "build"];
  const emailKeywords = ["email", "message", "cold email", "outreach", "email to"];
  
  if (emailGenKeywords.some(keyword => lower.includes(keyword)) && 
      emailKeywords.some(keyword => lower.includes(keyword))) {
    // Try to extract sender/receiver info from various patterns
    let sender: string | undefined;
    let receiver: string | undefined;
    let senderWebsite: string | undefined;
    let receiverWebsite: string | undefined;
    
    // Pattern: "from X to Y" or "X to Y"
    const fromToMatch = lower.match(/(?:from|sender|i am|we are)\s+([^,]+?)\s+(?:to|for)\s+([^,]+)/i) ||
                        lower.match(/([^,]+?)\s+(?:to|for)\s+([^,]+)/i);
    if (fromToMatch) {
      sender = fromToMatch[1].trim();
      receiver = fromToMatch[2].trim();
    }
    
    // Pattern: "email to X"
    const emailToMatch = lower.match(/email\s+(?:to|for)\s+([^,]+)/i);
    if (emailToMatch && !receiver) {
      receiver = emailToMatch[1].trim();
    }
    
    // Extract website URLs if mentioned
    const websiteMatch = lower.match(/(?:website|site|url):\s*([^\s,]+)/gi);
    if (websiteMatch) {
      const websites = websiteMatch.map(m => m.split(":")[1]?.trim()).filter(Boolean);
      if (websites.length > 0) senderWebsite = websites[0];
      if (websites.length > 1) receiverWebsite = websites[1];
    }
    
    return {
      action: "generate_email",
      parameters: {
        sender,
        receiver,
        senderWebsite,
        receiverWebsite,
      },
      intent: "other",
      confidence: 0.8,
    };
  }
  
  
  // Meetings booked intent - check this AFTER ACTL tracker to avoid conflicts
  const meetingsKeywords = ["meeting", "meetings"];
  if (meetingsKeywords.some(keyword => lower.includes(keyword))) {
    // Extract client name - try multiple patterns (improved)
    let clientName: string | undefined;
    
    // Pattern 1: "Meeting details for Privy" or "Meetings for Privy"
    const pattern1 = /meeting\w*\s+(?:details?|info|data|booked)?\s+(?:for|from)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;
    const match1 = lower.match(pattern1);
    if (match1 && match1[1]) {
      clientName = match1[1].trim();
    }
    
    // Pattern 2: "for Privy" or "for [Client]"
    if (!clientName) {
      const pattern2 = /(?:for|client|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;
      const match2 = lower.match(pattern2);
      if (match2 && match2[1]) {
        const potential = match2[1].trim();
        // Filter out common words
        if (!["details", "info", "data", "booked", "campaign", "meeting", "meetings"].includes(potential.toLowerCase())) {
          clientName = potential;
        }
      }
    }
    
    // Pattern 3: Simple "for [word]" pattern when meeting details is mentioned
    if (!clientName && lower.includes("detail")) {
      const forMatch = lower.match(/(?:for|from)\s+(\w+)/i);
      if (forMatch && forMatch[1]) {
        const potential = forMatch[1].trim();
        // Filter out common words
        if (!["details", "info", "data", "booked", "campaign", "meeting", "meetings", "the", "all", "this"].includes(potential.toLowerCase())) {
          clientName = potential.charAt(0).toUpperCase() + potential.slice(1).toLowerCase();
        }
      }
    }
    
    // Pattern 4: Extract any capitalized word that looks like a company name
    if (!clientName) {
      const capitalizedWords = lower.match(/\b([A-Z][a-z]+)\b/g);
      if (capitalizedWords) {
        // Filter out common words and find potential client names
        const commonWords = ["Meeting", "Meetings", "Details", "For", "From", "Client", "Campaign", "Show", "List", "Who", "How", "Many", "Total", "Count", "The", "All", "This"];
        const potential = capitalizedWords.find(word => !commonWords.includes(word));
        if (potential) {
          clientName = potential;
        }
      }
    }
    
    // Extract campaign name
    const campaignMatch = lower.match(/(?:campaign|in)\s+["']?([^"',]+)["']?/i);
    const campaignName = campaignMatch ? campaignMatch[1].trim() : undefined;
    
    // Check if asking for details (who, details, list, show, data, information)
    const wantsDetails = lower.includes("who") || lower.includes("detail") || 
                         lower.includes("list") || lower.includes("show") ||
                         lower.includes("data") || lower.includes("information") ||
                         lower.includes("attend") || lower.includes("status") ||
                         lower.includes("meeting detail"); // "meeting details" phrase
    
    // Check if asking for count
    const wantsCount = lower.includes("how many") || lower.includes("count") || 
                       lower.includes("number") || lower.includes("total");
    
    if (wantsDetails || (!wantsCount && lower.includes("detail"))) {
      return {
        action: "meetings_details",
        parameters: { clientName, campaignName },
        intent: "analytics",
        confidence: 0.9,
      };
    } else if (wantsCount || !wantsDetails) {
      return {
        action: "meetings_count",
        parameters: { clientName, campaignName },
        intent: "analytics",
        confidence: 0.9,
      };
    } else {
      // Default to details if "meeting" and "detail" are both present
      return {
        action: "meetings_details",
        parameters: { clientName, campaignName },
        intent: "analytics",
        confidence: 0.8,
      };
    }
  }
  
  // Overall campaign stats intent
  const statsKeywords = ["overall", "total", "all time", "since start", "contract"];
  const statsContext = ["email sent", "emails sent", "sent", "stats", "statistics", "metrics", "performance", "campaign stats"];
  
  // More flexible matching - either has stats keywords OR stats context
  if ((statsKeywords.some(keyword => lower.includes(keyword)) || 
       statsContext.some(context => lower.includes(context))) &&
      (lower.includes("campaign") || lower.includes("stats") || lower.includes("performance") || 
       lower.includes("email") || lower.includes("sent"))) {
    // Extract client name if mentioned
    const clientMatch = lower.match(/(?:for|client|from)\s+([^,]+?)(?:\s|$|,)/i);
    const clientName = clientMatch ? clientMatch[1].trim() : undefined;
    
    return {
      action: "overall_campaign_stats",
      parameters: { clientName },
      intent: "analytics",
      confidence: 0.85,
    };
  }
  
  
  // Help intent
  if (lower === "help" || lower.startsWith("help") || lower.includes("commands") || 
      lower.includes("guide") || lower.includes("what can i do")) {
    return {
      action: "help",
      parameters: {},
      intent: "other",
      confidence: 1.0,
    };
  }
  
  // If we can't parse it, try to be helpful
  return {
    action: "unknown",
    parameters: { originalCommand: commandText },
    intent: "other",
    confidence: 0.3,
  };
}

