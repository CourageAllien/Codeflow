// Base integration interface and abstract class

export interface IntegrationCredentials {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
}

export interface LeadSearchParams {
  count: number;
  titles?: string[];
  industry?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  employee_range?: {
    min?: number;
    max?: number;
  };
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  company?: string;
  [key: string]: any;
}

export interface VerificationResult {
  email: string;
  status: "valid" | "risky" | "invalid" | "catchall";
  confidence?: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  [key: string]: any;
}

export interface AuthResult {
  success: boolean;
  credentials?: IntegrationCredentials;
  error?: string;
}

export abstract class Integration {
  abstract name: string;
  abstract provider: string;

  abstract authenticate(credentials: IntegrationCredentials): Promise<AuthResult>;
  abstract searchLeads(params: LeadSearchParams): Promise<Lead[]>;
  abstract verifyEmail(email: string): Promise<VerificationResult>;
  abstract createCampaign(name: string, settings?: any): Promise<Campaign>;
  abstract addLeadsToCampaign(campaignId: string, leads: Lead[]): Promise<void>;

  protected async handleRateLimit(
    fn: () => Promise<any>,
    retries: number = 3
  ): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        if (error.status === 429 && i < retries - 1) {
          const retryAfter = error.headers?.["retry-after"] || Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        throw error;
      }
    }
    throw new Error("Max retries exceeded");
  }
}

