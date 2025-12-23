// AI reply classifier

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export type ReplyClassification = "positive" | "negative" | "neutral" | "ooo" | "bounce";

export interface ReplyClassificationResult {
  classification: ReplyClassification;
  sentiment: "positive" | "negative" | "neutral";
  intent?: string;
  suggestedAction?: string;
  confidence: number;
}

export async function classifyReply(
  replyContent: string
): Promise<ReplyClassificationResult> {
  // If no API key, use simple keyword matching
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackClassify(replyContent);
  }

  try {
    const prompt = `Classify this cold email reply into one of these categories:
- positive: Interested, wants to learn more, wants to schedule a call, asking for more info
- negative: Not interested, unsubscribe, stop emailing, we handle this internally
- neutral: Not the right time, reach out later, send more details (but not clearly interested)
- ooo: Out of office, away, limited email access
- bounce: Email bounced, user not found, mailbox full, domain not found

Reply content: "${replyContent}"

Return JSON:
{
  "classification": "positive|negative|neutral|ooo|bounce",
  "sentiment": "positive|negative|neutral",
  "intent": "brief description of what they want",
  "suggestedAction": "what action to take",
  "confidence": 0.0-1.0
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
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

    return JSON.parse(jsonMatch[0]) as ReplyClassificationResult;
  } catch (error) {
    console.error("Error classifying reply:", error);
    return fallbackClassify(replyContent);
  }
}

function fallbackClassify(replyContent: string): ReplyClassificationResult {
  const lower = replyContent.toLowerCase();

  // Bounce indicators
  if (
    lower.includes("user not found") ||
    lower.includes("mailbox full") ||
    lower.includes("domain not found") ||
    lower.includes("delivery failed")
  ) {
    return {
      classification: "bounce",
      sentiment: "neutral",
      intent: "Email delivery failed",
      suggestedAction: "Remove from list",
      confidence: 0.9,
    };
  }

  // OOO indicators
  if (
    lower.includes("out of office") ||
    lower.includes("away from") ||
    lower.includes("limited email access") ||
    lower.includes("back on")
  ) {
    return {
      classification: "ooo",
      sentiment: "neutral",
      intent: "Temporarily unavailable",
      suggestedAction: "Snooze until return date",
      confidence: 0.85,
    };
  }

  // Negative indicators
  if (
    lower.includes("not interested") ||
    lower.includes("remove me") ||
    lower.includes("unsubscribe") ||
    lower.includes("stop emailing") ||
    lower.includes("don't contact")
  ) {
    return {
      classification: "negative",
      sentiment: "negative",
      intent: "Not interested, wants to be removed",
      suggestedAction: "Unsubscribe immediately",
      confidence: 0.9,
    };
  }

  // Positive indicators
  if (
    lower.includes("interested") ||
    lower.includes("let's schedule") ||
    lower.includes("send more") ||
    lower.includes("tell me more") ||
    lower.includes("case study") ||
    lower.includes("pricing") ||
    lower.includes("demo") ||
    lower.includes("call")
  ) {
    return {
      classification: "positive",
      sentiment: "positive",
      intent: "Interested in learning more",
      suggestedAction: "Respond promptly, schedule meeting",
      confidence: 0.8,
    };
  }

  // Default to neutral
  return {
    classification: "neutral",
    sentiment: "neutral",
    intent: "Unclear intent",
    suggestedAction: "Review and respond manually",
    confidence: 0.6,
  };
}

