import { Sidebar } from "@/components/layout/sidebar";
import { QuickStats } from "@/components/layout/quick-stats";
import { ReplyInbox } from "@/components/replies/inbox";

export default function RepliesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Replies</h1>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80">
                Mark All Read
              </button>
            </div>
            <ReplyInbox />
          </div>
        </main>
        <QuickStats />
      </div>
    </div>
  );
}

