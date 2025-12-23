import Link from "next/link";
import { Terminal } from "@/components/terminal/terminal";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            THE COMMAND CENTER FOR COLD EMAIL
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop switching between 8 tabs. Run your entire cold email operation from one command line.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/sandbox">Try Sandbox</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/commands-guide">Command Guide</Link>
            </Button>
          </div>
        </div>

        {/* Interactive Terminal Demo */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-muted-foreground">coldflow v1.0.0</span>
            </div>
            <Terminal demoMode={true} />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">One Command, Many Tools</h3>
            <p className="text-muted-foreground">
              Orchestrate Apollo, Instantly, MillionVerifier, and more with natural language commands.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Sandbox Mode</h3>
            <p className="text-muted-foreground">
              Learn without risk. Test everything with dummy data before going live.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-muted-foreground">
              Personalization, reply classification, and campaign insights powered by AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

