import { Terminal } from "@/components/terminal/terminal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Sandbox Mode</h1>
              <p className="text-sm text-muted-foreground">
                Test and learn without risk - all commands are simulated
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/commands-guide">
              <BookOpen className="w-4 h-4 mr-2" />
              Command Guide
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧪</span>
              <div>
                <h2 className="font-semibold mb-1">Sandbox Mode Active</h2>
                <p className="text-sm text-muted-foreground">
                  You're in a safe testing environment. Type anything in natural language and see how ColdFlow responds. 
                  No API keys or real data required. Try commands like "find 200 marketing directors" or "show me my campaigns".
                </p>
              </div>
            </div>
          </div>

          <div className="h-[600px]">
            <Terminal demoMode={false} />
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Try These</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "I need 200 marketing directors"</li>
                <li>• "Check if these emails are valid"</li>
                <li>• "Show me my campaigns"</li>
                <li>• "What's my domain health?"</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎯 Natural Language</h3>
              <p className="text-sm text-muted-foreground">
                No specific format needed! Just describe what you want in plain English. 
                ColdFlow will understand your intent.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">📚 Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Check out the command guide for examples and tips.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/commands-guide">View Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

