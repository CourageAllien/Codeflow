// AI campaign doctor - diagnose and recommend fixes

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  positiveReplies: number;
  negativeReplies: number;
  meetingsBooked: number;
  subjectLines?: string[];
  industry?: string;
  daysRunning?: number;
}

export interface CampaignDiagnosis {
  health: "excellent" | "good" | "warning" | "critical";
  issues: Array<{
    severity: "critical" | "warning" | "info";
    issue: string;
    impact: string;
  }>;
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    action: string;
    reasoning: string;
  }>;
  rootCauses: string[];
  predictedImprovement?: {
    metric: string;
    current: number;
    projected: number;
    confidence: number;
  };
}

export async function diagnoseCampaign(
  campaignName: string,
  metrics: CampaignMetrics
): Promise<CampaignDiagnosis> {
  // Calculate rates
  const deliveryRate = metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0;
  const openRate = metrics.sent > 0 ? (metrics.opened / metrics.sent) * 100 : 0;
  const replyRate = metrics.sent > 0 ? (metrics.replied / metrics.sent) * 100 : 0;
  const bounceRate = metrics.sent > 0 ? (metrics.bounced / metrics.sent) * 100 : 0;
  const clickRate = metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0;

  // If no API key, use rule-based diagnosis
  if (!process.env.ANTHROPIC_API_KEY) {
    return ruleBasedDiagnosis(campaignName, metrics, {
      deliveryRate,
      openRate,
      replyRate,
      bounceRate,
      clickRate,
    });
  }

  try {
    const prompt = `Analyze this cold email campaign and provide a diagnosis:

Campaign: ${campaignName}
Metrics:
- Sent: ${metrics.sent}
- Delivered: ${metrics.delivered} (${deliveryRate.toFixed(1)}%)
- Opened: ${metrics.opened} (${openRate.toFixed(1)}%)
- Clicked: ${metrics.clicked} (${clickRate.toFixed(1)}%)
- Replied: ${metrics.replied} (${replyRate.toFixed(1)}%)
- Bounced: ${metrics.bounced} (${bounceRate.toFixed(1)}%)
- Positive Replies: ${metrics.positiveReplies}
- Negative Replies: ${metrics.negativeReplies}
- Meetings Booked: ${metrics.meetingsBooked}
${metrics.subjectLines ? `- Subject Lines: ${metrics.subjectLines.join(", ")}` : ""}
${metrics.industry ? `- Industry: ${metrics.industry}` : ""}
${metrics.daysRunning ? `- Days Running: ${metrics.daysRunning}` : ""}

Compare to industry benchmarks:
- Average open rate: 45%
- Average reply rate: 2.8%
- Average bounce rate: 3.5%

Provide:
1. Overall health (excellent/good/warning/critical)
2. Issues found (with severity and impact)
3. Root causes
4. Recommendations (with priority and reasoning)
5. Predicted improvement if recommendations are followed

Return JSON:
{
  "health": "excellent|good|warning|critical",
  "issues": [
    {
      "severity": "critical|warning|info",
      "issue": "...",
      "impact": "..."
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "action": "...",
      "reasoning": "..."
    }
  ],
  "rootCauses": ["..."],
  "predictedImprovement": {
    "metric": "...",
    "current": 0.0,
    "projected": 0.0,
    "confidence": 0.0-1.0
  }
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonMatch[0]) as CampaignDiagnosis;
  } catch (error) {
    console.error("Error diagnosing campaign:", error);
    return ruleBasedDiagnosis(campaignName, metrics, {
      deliveryRate,
      openRate,
      replyRate,
      bounceRate,
      clickRate,
    });
  }
}

function ruleBasedDiagnosis(
  campaignName: string,
  metrics: CampaignMetrics,
  rates: {
    deliveryRate: number;
    openRate: number;
    replyRate: number;
    bounceRate: number;
    clickRate: number;
  }
): CampaignDiagnosis {
  const issues: CampaignDiagnosis["issues"] = [];
  const recommendations: CampaignDiagnosis["recommendations"] = [];
  const rootCauses: string[] = [];

  // Determine health
  let health: CampaignDiagnosis["health"] = "excellent";
  if (rates.replyRate < 1 || rates.openRate < 30 || rates.bounceRate > 5) {
    health = "critical";
  } else if (rates.replyRate < 2 || rates.openRate < 40 || rates.bounceRate > 3) {
    health = "warning";
  } else if (rates.replyRate < 3 || rates.openRate < 50) {
    health = "good";
  }

  // Check bounce rate
  if (rates.bounceRate > 5) {
    issues.push({
      severity: "critical",
      issue: "High bounce rate",
      impact: "Damaging sender reputation and deliverability",
    });
    recommendations.push({
      priority: "high",
      action: "Verify email list again and remove invalid emails",
      reasoning: "High bounce rate indicates poor list quality",
    });
    rootCauses.push("Poor email list quality");
  } else if (rates.bounceRate > 3) {
    issues.push({
      severity: "warning",
      issue: "Elevated bounce rate",
      impact: "May impact deliverability if not addressed",
    });
  }

  // Check open rate
  if (rates.openRate < 30) {
    issues.push({
      severity: "critical",
      issue: "Very low open rate",
      impact: "Campaign is not reaching inbox or subject lines are ineffective",
    });
    recommendations.push({
      priority: "high",
      action: "A/B test new subject lines",
      reasoning: "Subject lines are the primary driver of open rates",
    });
    rootCauses.push("Ineffective subject lines");
  } else if (rates.openRate < 40) {
    issues.push({
      severity: "warning",
      issue: "Below-average open rate",
      impact: "Missing potential engagement",
    });
    recommendations.push({
      priority: "medium",
      action: "Improve subject line personalization",
      reasoning: "Personalized subject lines typically perform 20-30% better",
    });
  }

  // Check reply rate
  if (rates.replyRate < 1) {
    issues.push({
      severity: "critical",
      issue: "Very low reply rate",
      impact: "Campaign is not generating interest",
    });
    recommendations.push({
      priority: "high",
      action: "Review and improve email copy, add more personalization",
      reasoning: "Low reply rate suggests messaging isn't resonating",
    });
    rootCauses.push("Messaging not resonating with audience");
  } else if (rates.replyRate < 2) {
    issues.push({
      severity: "warning",
      issue: "Below-average reply rate",
      impact: "Not meeting industry benchmarks",
    });
    recommendations.push({
      priority: "medium",
      action: "Add more value in email body, improve call-to-action",
      reasoning: "Strong value proposition increases reply rates",
    });
  }

  // Check positive vs negative replies
  if (metrics.negativeReplies > metrics.positiveReplies) {
    issues.push({
      severity: "warning",
      issue: "More negative than positive replies",
      impact: "Audience mismatch or messaging too aggressive",
    });
    recommendations.push({
      priority: "medium",
      action: "Review targeting criteria and tone down messaging",
      reasoning: "High negative reply rate suggests audience mismatch",
    });
  }

  return {
    health,
    issues,
    recommendations,
    rootCauses,
    predictedImprovement: {
      metric: "reply_rate",
      current: rates.replyRate,
      projected: rates.replyRate * 1.5,
      confidence: 0.7,
    },
  };
}

