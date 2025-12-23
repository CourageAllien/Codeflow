// Integration factory

import { Integration } from "./base";
import { ApolloIntegration } from "./apollo";
import { MillionVerifierIntegration } from "./millionverifier";
import { InstantlyIntegration } from "./instantly";

export class IntegrationFactory {
  private static integrations: Map<string, new () => Integration> = new Map<string, new () => Integration>([
    ["apollo", ApolloIntegration],
    ["millionverifier", MillionVerifierIntegration],
    ["instantly", InstantlyIntegration],
  ] as Array<[string, new () => Integration]>);

  static getIntegration(provider: string): Integration {
    const IntegrationClass = this.integrations.get(provider.toLowerCase());
    if (!IntegrationClass) {
      throw new Error(`Integration "${provider}" not found`);
    }
    return new IntegrationClass();
  }

  static registerIntegration(provider: string, IntegrationClass: new () => Integration) {
    this.integrations.set(provider.toLowerCase(), IntegrationClass);
  }

  static getAvailableIntegrations(): string[] {
    return Array.from(this.integrations.keys());
  }
}

