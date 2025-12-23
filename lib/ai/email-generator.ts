// AI email generator with website context

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface EmailGenerationInput {
  sender: {
    name: string;
    company: string;
    website?: string;
    valueProposition?: string; // What the sender offers
    industry?: string;
  };
  receiver: {
    name: string;
    title: string;
    company: string;
    website?: string;
    industry?: string;
    painPoints?: string[]; // What problems they might have
  };
  emailType?: "initial" | "follow-up" | "value-add" | "break-up";
  tone?: "professional" | "casual" | "friendly" | "direct";
  includePersonalization?: boolean;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  personalization: string; // The personalized opening line
  reasoning?: string; // Why this email should work
}

export async function generateColdEmail(
  input: EmailGenerationInput
): Promise<GeneratedEmail> {
  // If no API key, return mock email
  if (!process.env.ANTHROPIC_API_KEY) {
    return generateMockEmail(input);
  }

  try {
    const prompt = `Generate a cold email for ${input.sender.name} at ${input.sender.company} to reach out to ${input.receiver.name}, ${input.receiver.title} at ${input.receiver.company}.

SENDER CONTEXT:
- Company: ${input.sender.company}
${input.sender.website ? `- Website: ${input.sender.website}` : ""}
${input.sender.valueProposition ? `- What they offer: ${input.sender.valueProposition}` : ""}
${input.sender.industry ? `- Industry: ${input.sender.industry}` : ""}

RECEIVER CONTEXT:
- Name: ${input.receiver.name}
- Title: ${input.receiver.title}
- Company: ${input.receiver.company}
${input.receiver.website ? `- Website: ${input.receiver.website}` : ""}
${input.receiver.industry ? `- Industry: ${input.receiver.industry}` : ""}
${input.receiver.painPoints ? `- Potential pain points: ${input.receiver.painPoints.join(", ")}` : ""}

EMAIL TYPE: ${input.emailType || "initial"}
TONE: ${input.tone || "professional"}

Requirements:
1. Create a compelling subject line (under 50 characters, personalized)
2. Write an email body (3-4 short paragraphs max)
3. Include a personalized opening that connects sender's solution to receiver's potential needs
4. Make it specific - reference what you know about their company/industry
5. Include a clear, low-pressure call-to-action
6. Keep it concise and scannable

Return JSON:
{
  "subject": "...",
  "body": "...",
  "personalization": "The personalized opening line",
  "reasoning": "Why this email should work (1-2 sentences)"
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
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

    return JSON.parse(jsonMatch[0]) as GeneratedEmail;
  } catch (error) {
    console.error("Error generating email:", error);
    return generateMockEmail(input);
  }
}

function generateMockEmail(input: EmailGenerationInput): GeneratedEmail {
  const personalization = input.receiver.website
    ? `I noticed ${input.receiver.company} is doing great work in ${input.receiver.industry || "your industry"}.`
    : `Hi ${input.receiver.name}, I saw your role as ${input.receiver.title} at ${input.receiver.company}.`;

  const subject = input.emailType === "follow-up"
    ? `Re: Quick question about ${input.receiver.company}`
    : input.emailType === "value-add"
    ? `Idea for ${input.receiver.company}`
    : `Quick question about ${input.receiver.company}'s ${input.receiver.industry || "operations"}`;

  const body = `${personalization}

${input.sender.valueProposition || `I'm reaching out because ${input.sender.company} helps companies like yours ${input.receiver.industry ? `in the ${input.receiver.industry} space` : ""} solve common challenges.`}

${input.receiver.painPoints && input.receiver.painPoints.length > 0
  ? `Specifically, I noticed ${input.receiver.company} might be dealing with ${input.receiver.painPoints[0]}. We've helped similar companies address this.`
  : `We've helped similar companies achieve significant results.`}

Would you be open to a quick 15-minute call to see if there's a fit? No pressure at all.

Best,
${input.sender.name}
${input.sender.company}`;

  return {
    subject,
    body,
    personalization,
    reasoning: "Personalized opening with clear value proposition and low-pressure CTA.",
  };
}

