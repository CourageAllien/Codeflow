// AI personalization engine

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface PersonalizationInput {
  leadName: string;
  company: string;
  title?: string;
  linkedinAbout?: string;
  industry?: string;
  technologies?: string[];
}

export interface PersonalizationResult {
  openingLine: string;
  personalizedSection: string;
  confidence: number;
}

export async function generatePersonalization(
  input: PersonalizationInput
): Promise<PersonalizationResult> {
  // If no API key, return mock response
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      openingLine: `Noticed your background at ${input.company} — your expertise is exactly why I wanted to reach out.`,
      personalizedSection: `I saw that ${input.company} is in the ${input.industry || "SaaS"} space, and I thought you might be interested in how we're helping similar companies...`,
      confidence: 0.7,
    };
  }

  try {
    const prompt = `Generate a personalized opening line for a cold email to ${input.leadName}, ${input.title || "professional"} at ${input.company}.

${input.linkedinAbout ? `Their LinkedIn about section: ${input.linkedinAbout}` : ""}
${input.industry ? `Industry: ${input.industry}` : ""}
${input.technologies ? `Technologies they use: ${input.technologies.join(", ")}` : ""}

Generate:
1. A personalized opening line (1-2 sentences) that references something specific about them
2. A personalized section (2-3 sentences) that connects our solution to their situation

Return JSON:
{
  "openingLine": "...",
  "personalizedSection": "...",
  "confidence": 0.0-1.0
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
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

    return JSON.parse(jsonMatch[0]) as PersonalizationResult;
  } catch (error) {
    console.error("Error generating personalization:", error);
    // Fallback
    return {
      openingLine: `Hi ${input.leadName}, I noticed ${input.company} is doing great work in ${input.industry || "your industry"}.`,
      personalizedSection: `I thought you might be interested in how we're helping similar companies...`,
      confidence: 0.5,
    };
  }
}

export async function generateBulkPersonalizations(
  inputs: PersonalizationInput[]
): Promise<PersonalizationResult[]> {
  const results: PersonalizationResult[] = [];
  for (const input of inputs) {
    results.push(await generatePersonalization(input));
    // Rate limiting - wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return results;
}

