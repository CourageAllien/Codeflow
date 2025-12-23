// Workflow types and definitions

export type TriggerType = "webhook" | "schedule" | "event" | "manual";

export interface WebhookTrigger {
  type: "webhook";
  url: string;
  method: "GET" | "POST";
  secret?: string;
}

export interface ScheduleTrigger {
  type: "schedule";
  cron: string; // e.g., "0 8 * * *" for daily at 8am
  timezone?: string;
}

export interface EventTrigger {
  type: "event";
  event: string; // e.g., "new_lead", "positive_reply", "campaign_completed"
  conditions?: Record<string, any>;
}

export interface ManualTrigger {
  type: "manual";
}

export type Trigger = WebhookTrigger | ScheduleTrigger | EventTrigger | ManualTrigger;

export type StepType = "integration" | "condition" | "delay" | "webhook" | "transform";

export interface IntegrationStep {
  type: "integration";
  provider: string; // apollo, millionverifier, instantly, etc.
  action: string; // search_leads, verify_email, create_campaign, etc.
  parameters: Record<string, any>;
  outputVariable?: string; // Store result in this variable
}

export interface ConditionStep {
  type: "condition";
  condition: string; // JavaScript expression or template
  then: WorkflowStep[];
  else?: WorkflowStep[];
}

export interface DelayStep {
  type: "delay";
  duration: string; // e.g., "5 minutes", "1 hour", "2 days"
}

export interface WebhookStep {
  type: "webhook";
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export interface TransformStep {
  type: "transform";
  operation: "map" | "filter" | "reduce" | "format";
  expression: string;
  outputVariable?: string;
}

export type WorkflowStep =
  | IntegrationStep
  | ConditionStep
  | DelayStep
  | WebhookStep
  | TransformStep;

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: Trigger;
  steps: WorkflowStep[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  inputData?: any;
  outputData?: any;
  errorDetails?: any;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  stepExecutions: StepExecution[];
}

export interface StepExecution {
  stepId: string;
  stepType: StepType;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  inputData?: any;
  outputData?: any;
  errorDetails?: any;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
}

