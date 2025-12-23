"use client";

interface Integration {
  name: string;
  category: string;
  connected: boolean;
  status?: string;
  metadata?: {
    leads?: number;
    balance?: string;
    campaigns?: number;
    contacts?: number;
  };
}

const integrations: Integration[] = [
  {
    name: "Apollo",
    category: "Lead Sourcing",
    connected: true,
    status: "Connected",
    metadata: { leads: 4231 },
  },
  {
    name: "Ocean.io",
    category: "Lead Sourcing",
    connected: false,
  },
  {
    name: "LinkedIn",
    category: "Lead Sourcing",
    connected: false,
  },
  {
    name: "MillionVerifier",
    category: "Email Verification",
    connected: true,
    status: "Connected",
    metadata: { balance: "$12.40" },
  },
  {
    name: "ZeroBounce",
    category: "Email Verification",
    connected: false,
  },
  {
    name: "NeverBounce",
    category: "Email Verification",
    connected: false,
  },
  {
    name: "Instantly",
    category: "Sending",
    connected: true,
    status: "Connected",
    metadata: { campaigns: 5 },
  },
  {
    name: "Smartlead",
    category: "Sending",
    connected: false,
  },
  {
    name: "Lemlist",
    category: "Sending",
    connected: false,
  },
  {
    name: "HubSpot",
    category: "CRM",
    connected: true,
    status: "Connected",
    metadata: { contacts: 892 },
  },
  {
    name: "Pipedrive",
    category: "CRM",
    connected: false,
  },
  {
    name: "Salesforce",
    category: "CRM",
    connected: false,
  },
];

export function IntegrationsHub() {
  const categories = Array.from(new Set(integrations.map(i => i.category)));

  return (
    <div className="space-y-8">
      {categories.map(category => {
        const categoryIntegrations = integrations.filter(i => i.category === category);
        return (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryIntegrations.map(integration => (
                <div
                  key={integration.name}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={integration.connected ? "text-green-500" : "text-gray-500"}>
                          {integration.connected ? "🟢" : "⚪"}
                        </span>
                        <h3 className="font-semibold">{integration.name}</h3>
                      </div>
                      {integration.status && (
                        <p className="text-sm text-muted-foreground">{integration.status}</p>
                      )}
                    </div>
                  </div>
                  {integration.metadata && (
                    <div className="text-sm text-muted-foreground mb-3">
                      {integration.metadata.leads && (
                        <div>{integration.metadata.leads.toLocaleString()} leads</div>
                      )}
                      {integration.metadata.balance && (
                        <div>{integration.metadata.balance} balance</div>
                      )}
                      {integration.metadata.campaigns && (
                        <div>{integration.metadata.campaigns} campaigns</div>
                      )}
                      {integration.metadata.contacts && (
                        <div>{integration.metadata.contacts} contacts</div>
                      )}
                    </div>
                  )}
                  <button
                    className={`w-full px-3 py-2 rounded-md text-sm ${
                      integration.connected
                        ? "bg-muted text-muted-foreground hover:bg-muted/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {integration.connected ? "Manage" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

