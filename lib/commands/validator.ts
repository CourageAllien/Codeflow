// Command validation layer

import { ParsedCommand } from "./parser";
import { z } from "zod";

const commandSchemas = {
  find: z.object({
    count: z.number().int().positive().max(10000).optional(),
    titles: z.array(z.string()).optional(),
    industry: z.string().optional(),
    location: z.object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    employee_range: z.object({
      min: z.number().int().positive().optional(),
      max: z.number().int().positive().optional(),
    }).optional(),
  }),
  
  verify: z.object({
    target: z.enum(["current_leads", "all_leads", "campaign"]).optional(),
    campaign_name: z.string().optional(),
  }),
  
  enrich: z.object({
    source: z.enum(["apollo", "clay", "clearbit"]).optional(),
    fields: z.array(z.string()).optional(),
  }),
  
  create_campaign: z.object({
    name: z.string().min(1),
    platform: z.enum(["instantly", "smartlead", "lemlist"]).optional(),
  }),
  
  load_into_campaign: z.object({
    campaign_name: z.string().min(1),
    leads: z.array(z.any()).optional(),
  }),
  
  pause_campaign: z.object({
    campaign_name: z.string().min(1),
  }),
  
  resume_campaign: z.object({
    campaign_name: z.string().min(1),
  }),
  
  simulate: z.object({
    days: z.number().int().positive().max(365),
    campaign_name: z.string().optional(),
  }),
  
  export: z.object({
    format: z.enum(["csv", "json", "xlsx"]).optional(),
    destination: z.string().optional(),
  }),
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCommand(
  command: ParsedCommand,
  context?: {
    hasCurrentLeads?: boolean;
    availableCampaigns?: string[];
    integrations?: string[];
  }
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if schema exists for this action
  const schema = commandSchemas[command.action as keyof typeof commandSchemas];
  if (!schema) {
    if (command.action !== "show_campaigns" && command.action !== "help" && command.action !== "unknown") {
      warnings.push(`Unknown action: ${command.action}. Proceeding with basic validation.`);
    }
  } else {
    // Validate parameters against schema
    try {
      schema.parse(command.parameters);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => `${e.path.join(".")}: ${e.message}`));
      }
    }
  }

  // Context-specific validation
  if (context) {
    // Check if campaign exists
    if (command.action.includes("campaign") && command.parameters.campaign_name) {
      if (context.availableCampaigns && !context.availableCampaigns.includes(command.parameters.campaign_name)) {
        warnings.push(`Campaign "${command.parameters.campaign_name}" not found. Will create new campaign.`);
      }
    }

    // Check if integration is available
    if (command.source && context.integrations) {
      if (!context.integrations.includes(command.source)) {
        warnings.push(`Integration "${command.source}" not connected. Will use sandbox mode.`);
      }
    }

    // Check if leads are available
    if (command.action === "verify" && command.parameters.target === "current_leads") {
      if (!context.hasCurrentLeads) {
        errors.push("No leads available. Search for leads first.");
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

