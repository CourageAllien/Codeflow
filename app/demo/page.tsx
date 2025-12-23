import { Terminal } from "@/components/terminal/terminal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function DemoPage() {
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
              <h1 className="text-xl font-bold">Interactive Demo</h1>
              <p className="text-sm text-muted-foreground">
                See ColdFlow in action with pre-loaded examples
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/sandbox">
                Full Sandbox
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/commands-guide">
                <BookOpen className="w-4 h-4 mr-2" />
                Guide
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This is a demo with pre-loaded examples. For the full sandbox experience where you can type anything, 
              visit the <Link href="/sandbox" className="text-primary hover:underline">Sandbox page</Link>.
            </p>
          </div>
          <div className="h-[600px]">
            <Terminal demoMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

