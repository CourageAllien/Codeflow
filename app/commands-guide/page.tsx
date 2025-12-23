import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Terminal, BookOpen } from "lucide-react";

export default function CommandsGuidePage() {
  const commandCategories = [
    {
      title: "Finding Leads",
      description: "Search for leads using natural language",
      examples: [
        "I need 200 marketing directors at SaaS companies",
        "Find me 500 CTOs in California",
        "Show me VP of Sales at fintech startups",
        "Get 100 marketing managers with 50-200 employees",
        "I want leads in the healthcare industry",
      ],
      tips: "Mention the number, job title, industry, location, or company size. ColdFlow will extract all the details.",
    },
    {
      title: "Email Verification",
      description: "Check if email addresses are valid",
      examples: [
        "Verify these emails",
        "Check if these are valid",
        "Validate the email addresses",
        "Are these emails good?",
      ],
      tips: "Make sure you have leads loaded first. You can search for leads, then verify them.",
    },
    {
      title: "Campaigns",
      description: "Create and manage email campaigns",
      examples: [
        "Create a new campaign called Q1 Outreach",
        "Load these leads into my campaign",
        "Show me all my campaigns",
        "Pause the Healthcare campaign",
        "What's the status of my campaigns?",
      ],
      tips: "You can create campaigns, load leads into them, pause/resume, and view campaign statistics.",
    },
    {
      title: "Analytics & Reports",
      description: "View performance metrics and statistics",
      examples: [
        "Show me campaign performance",
        "How are my campaigns doing?",
        "What's my open rate?",
        "Compare my campaigns",
        "Show me last week's stats",
      ],
      tips: "Ask about any metric - open rates, reply rates, meetings booked, etc.",
    },
    {
      title: "Deliverability",
      description: "Check domain and inbox health",
      examples: [
        "Check my domain health",
        "What's my deliverability status?",
        "Show me inbox placement rates",
        "Is my domain reputation good?",
        "How's my domain doing?",
        "Check deliverability",
      ],
      tips: "Monitor your sending infrastructure to ensure emails reach the inbox. Works in sandbox with simulated data.",
    },
    {
      title: "Email Generation",
      description: "Generate personalized cold emails with AI",
      examples: [
        "Generate an email to Sarah Chen at CloudStack",
        "Write a cold email for marketing directors",
        "Create an email from TechFlow to SaaS companies",
        "Generate email to john@example.com",
        "Write me an email",
      ],
      tips: "Provide sender and receiver website URLs for best results. Uses Claude API when configured, otherwise uses smart templates.",
    },
    {
      title: "ACTL & Booked Meeting Tracker",
      description: "Generate comprehensive client performance dashboard",
      examples: [
        "Give me ACTL & Booked Meeting Tracker for December 5 2024",
        "Show ACTL tracker for January 15 2025",
        "ACTL & Booked Meeting Tracker for November 2024",
        "Give me the tracker for today",
      ],
      tips: "Shows completion rates, reply metrics, meetings booked, and health scores for all clients. Format: 'Give me ACTL & Booked Meeting Tracker for [month] [date] [year]'",
    },
    {
      title: "Overall Campaign Stats",
      description: "View total email sent and performance metrics since contract start",
      examples: [
        "Overall campaign stats for Adaline",
        "Total emails sent for RocketReach since contract start",
        "Show me all time stats for Privy",
        "What's the total email sent for this client?",
        "Give me overall performance metrics",
        "Campaign stats since contract began",
      ],
      tips: "Shows cumulative statistics including total emails sent, delivered, opened, replied, and meetings booked since the contract started.",
    },
    {
      title: "Meetings Booked",
      description: "Query meeting bookings and view detailed meeting information",
      examples: [
        "How many meetings booked for Privy?",
        "Meetings booked in Q4 SaaS Outreach campaign",
        "Count meetings for RocketReach",
        "Who booked meetings for Adaline?",
        "Show meeting details for all clients",
        "List meetings booked in Fintech campaign",
        "Meeting details for Privy",
        "Who showed up for meetings?",
      ],
      tips: "First ask for count, then ask 'who' or 'show details' to see prospect names, emails, and attendance status (attended, no-show, cancelled, rescheduled).",
    },
    {
      title: "Replies",
      description: "View and manage email replies",
      examples: [
        "Show me unread replies",
        "What replies did I get today?",
        "Show positive replies",
        "Any new responses?",
      ],
      tips: "ColdFlow automatically classifies replies as positive, negative, or neutral.",
    },
    {
      title: "Simulation",
      description: "Test campaigns with time progression",
      examples: [
        "Simulate 7 days",
        "Fast forward 2 weeks",
        "What would happen if I run this for a month?",
        "Test this campaign",
      ],
      tips: "See projected results before going live. Great for testing strategies.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Command Guide</h1>
              <p className="text-sm text-muted-foreground">
                Examples and tips for using ColdFlow's natural language commands
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/sandbox">
              <Terminal className="w-4 h-4 mr-2" />
              Try Sandbox
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="flex items-start gap-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Natural Language Commands</h2>
                <p className="text-muted-foreground mb-4">
                  ColdFlow understands natural language - no need to memorize specific commands or formats. 
                  Just describe what you want to do in plain English, and ColdFlow will figure it out.
                </p>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">💡 Key Principle:</p>
                  <p className="text-sm text-muted-foreground">
                    There's no "right" way to phrase a command. Say it however feels natural to you. 
                    If you're unsure, just ask - ColdFlow will help guide you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {commandCategories.map((category, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Examples:</h4>
                  <div className="space-y-2">
                    {category.examples.map((example, i) => (
                      <div
                        key={i}
                        className="bg-background border border-border rounded-md p-3 font-mono text-sm"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-sm">
                    <span className="font-semibold">Tip:</span> {category.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Start with Sandbox</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Try commands risk-free in sandbox mode. No setup required.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/sandbox">Open Sandbox</Link>
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Just Type Naturally</h4>
                <p className="text-sm text-muted-foreground">
                  Don't worry about exact syntax. Describe what you want, and ColdFlow will understand.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Ask for Help</h4>
                <p className="text-sm text-muted-foreground">
                  Type "help" or "what can I do" in the terminal for contextual assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

