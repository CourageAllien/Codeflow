// AI email writer

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface EmailWriterInput {
  type: "subject" | "body" | "both";
  targetAudience: string; // e.g., "marketing directors at SaaS companies"
  valueProposition?: string;
  callToAction?: string;
  tone?: "professional" | "casual" | "friendly";
  variants?: number;
}

export interface EmailVariant {
  subject?: string;
  body?: string;
  predictedOpenRate?: number;
  reasoning?: string;
}

export async function generateEmailVariants(
  input: EmailWriterInput
): Promise<EmailVariant[]> {
  const variants = input.variants || 3;

  // If no API key, return mock variants
  if (!process.env.ANTHROPIC_API_KEY) {
    return generateMockVariants(input, variants);
  }

  try {
    const prompt = `Generate ${variants} cold email ${input.type === "subject" ? "subject line" : input.type === "body" ? "body" : "subject line and body"} variants for ${input.targetAudience}.

${input.valueProposition ? `Value proposition: ${input.valueProposition}` : ""}
${input.callToAction ? `Call to action: ${input.callToAction}` : ""}
${input.tone ? `Tone: ${input.tone}` : ""}

For each variant, provide:
- The ${input.type === "subject" ? "subject line" : input.type === "body" ? "body text" : "subject line and body"}
- Predicted open rate (if subject) or engagement rate (if body)
- Brief reasoning for why this variant might work

Return JSON array:
[
  {
    ${input.type !== "body" ? '"subject": "...",' : ""}
    ${input.type !== "subject" ? '"body": "...",' : ""}
    "predictedOpenRate": 0.0-1.0,
    "reasoning": "..."
  },
  ...
]`;

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

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    return JSON.parse(jsonMatch[0]) as EmailVariant[];
  } catch (error) {
    console.error("Error generating email variants:", error);
    return generateMockVariants(input, variants);
  }
}

function generateMockVariants(
  input: EmailWriterInput,
  count: number
): EmailVariant[] {
  const variants: EmailVariant[] = [];

  for (let i = 0; i < count; i++) {
    if (input.type === "subject" || input.type === "both") {
      const subjects = [
        `Quick question about ${input.targetAudience.split(" at ")[1] || "your company"}'s demand gen`,
        `Idea for ${input.targetAudience.split(" at ")[1] || "your company"}`,
        `${input.targetAudience.split(" at ")[0] || "You"}, saw your recent campaign`,
      ];
      variants.push({
        subject: subjects[i % subjects.length],
        predictedOpenRate: 0.45 + Math.random() * 0.15,
        reasoning: "Direct, personalized, creates curiosity",
      });
    }

    if (input.type === "body" || input.type === "both") {
      variants[variants.length - 1] = {
        ...variants[variants.length - 1],
        body: `Hi there,\n\nI noticed ${input.targetAudience} and thought you might be interested in how we're helping similar companies...\n\n${input.valueProposition || "Our solution helps..."}\n\n${input.callToAction || "Would you be open to a quick call?"}\n\nBest,\n[Your name]`,
      };
    }
  }

  return variants;
}

