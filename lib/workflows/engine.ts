// Workflow execution engine

import { Workflow, WorkflowExecution, StepExecution, WorkflowStep } from "./types";
import { IntegrationFactory } from "../integrations/factory";

export class WorkflowEngine {
  async execute(
    workflow: Workflow,
    inputData?: any
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId: workflow.id,
      status: "running",
      inputData,
      startedAt: new Date(),
      stepExecutions: [],
    };

    try {
      const context: Record<string, any> = {
        input: inputData,
        workflow: workflow.id,
      };

      const output = await this.executeSteps(workflow.steps, context, execution);
      
      execution.status = "completed";
      execution.outputData = output;
      execution.completedAt = new Date();
      execution.durationMs = execution.completedAt.getTime() - execution.startedAt.getTime();

      return execution;
    } catch (error) {
      execution.status = "failed";
      execution.errorDetails = {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      };
      execution.completedAt = new Date();
      execution.durationMs = execution.completedAt.getTime() - execution.startedAt.getTime();
      return execution;
    }
  }

  private async executeSteps(
    steps: WorkflowStep[],
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    let lastOutput: any = null;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepExecution: StepExecution = {
        stepId: `step_${i}`,
        stepType: step.type,
        status: "running",
        inputData: context,
        startedAt: new Date(),
      };

      execution.stepExecutions.push(stepExecution);

      try {
        let output: any;

        switch (step.type) {
          case "integration":
            output = await this.executeIntegrationStep(step, context);
            break;
          case "condition":
            output = await this.executeConditionStep(step, context, execution);
            break;
          case "delay":
            await this.executeDelayStep(step);
            output = context;
            break;
          case "webhook":
            output = await this.executeWebhookStep(step, context);
            break;
          case "transform":
            output = await this.executeTransformStep(step, context);
            break;
          default:
            throw new Error(`Unknown step type: ${(step as any).type}`);
        }

        stepExecution.status = "completed";
        stepExecution.outputData = output;
        stepExecution.completedAt = new Date();
        stepExecution.durationMs =
          stepExecution.completedAt.getTime() - stepExecution.startedAt.getTime();

        // Store output in context if variable name specified
        if (step.type === "integration" && step.outputVariable) {
          context[step.outputVariable] = output;
        }

        lastOutput = output;
      } catch (error) {
        stepExecution.status = "failed";
        stepExecution.errorDetails = {
          message: error instanceof Error ? error.message : "Unknown error",
        };
        stepExecution.completedAt = new Date();
        stepExecution.durationMs =
          stepExecution.completedAt.getTime() - stepExecution.startedAt.getTime();
        throw error;
      }
    }

    return lastOutput;
  }

  private async executeIntegrationStep(
    step: Extract<WorkflowStep, { type: "integration" }>,
    context: Record<string, any>
  ): Promise<any> {
    const integration = IntegrationFactory.getIntegration(step.provider);

    switch (step.action) {
      case "search_leads":
        return await integration.searchLeads(step.parameters as any);
      case "verify_email":
        if (step.parameters.email) {
          return await integration.verifyEmail(step.parameters.email);
        }
        throw new Error("Email parameter required for verify_email action");
      case "create_campaign":
        return await integration.createCampaign(
          step.parameters.name,
          step.parameters.settings
        );
      case "add_leads_to_campaign":
        return await integration.addLeadsToCampaign(
          step.parameters.campaignId,
          step.parameters.leads
        );
      default:
        throw new Error(`Unknown integration action: ${step.action}`);
    }
  }

  private async executeConditionStep(
    step: Extract<WorkflowStep, { type: "condition" }>,
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    // Simple condition evaluation (in production, use a safe evaluator)
    const conditionResult = this.evaluateCondition(step.condition, context);

    if (conditionResult) {
      return await this.executeSteps(step.then, context, execution);
    } else if (step.else) {
      return await this.executeSteps(step.else, context, execution);
    }

    return context;
  }

  private evaluateCondition(condition: string, context: Record<string, any>): boolean {
    // Simple template evaluation
    // In production, use a proper template engine or safe evaluator
    try {
      // Replace variables in condition
      let evaluated = condition;
      for (const [key, value] of Object.entries(context)) {
        evaluated = evaluated.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), JSON.stringify(value));
      }

      // Simple boolean evaluation (very basic, not production-ready)
      // In production, use a proper expression evaluator
      if (evaluated.includes("==")) {
        const [left, right] = evaluated.split("==").map(s => s.trim());
        return left === right;
      }
      if (evaluated.includes("!=")) {
        const [left, right] = evaluated.split("!=").map(s => s.trim());
        return left !== right;
      }
      if (evaluated.includes(">")) {
        const [left, right] = evaluated.split(">").map(s => parseFloat(s.trim()));
        return left > right;
      }
      if (evaluated.includes("<")) {
        const [left, right] = evaluated.split("<").map(s => parseFloat(s.trim()));
        return left < right;
      }

      return Boolean(evaluated);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      return false;
    }
  }

  private async executeDelayStep(step: Extract<WorkflowStep, { type: "delay" }>): Promise<void> {
    const duration = this.parseDuration(step.duration);
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  private parseDuration(duration: string): number {
    // Parse duration strings like "5 minutes", "1 hour", "2 days"
    const match = duration.match(/(\d+)\s*(second|minute|hour|day|week)s?/i);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers: Record<string, number> = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || 1000);
  }

  private async executeWebhookStep(
    step: Extract<WorkflowStep, { type: "webhook" }>,
    context: Record<string, any>
  ): Promise<any> {
    // In production, make actual HTTP request
    // For now, simulate
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true, url: step.url };
  }

  private async executeTransformStep(
    step: Extract<WorkflowStep, { type: "transform" }>,
    context: Record<string, any>
  ): Promise<any> {
    // Simple transform operations
    // In production, use a proper transformation engine
    switch (step.operation) {
      case "map":
        // Apply expression to each item
        return context.input?.map?.((item: any) => {
          // Simple template replacement
          let result = step.expression;
          for (const [key, value] of Object.entries(item)) {
            result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
          }
          return result;
        });
      case "filter":
        // Filter items based on expression
        return context.input?.filter?.((item: any) => {
          // Simple evaluation
          return this.evaluateCondition(step.expression, { ...context, item });
        });
      default:
        return context;
    }
  }
}

