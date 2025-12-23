"use client";

export function QuickStats() {
  return (
    <div className="border-t border-border bg-card px-6 py-3">
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Sent today:</span>
          <span className="font-semibold">45</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Replies:</span>
          <span className="font-semibold">12</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Meetings:</span>
          <span className="font-semibold">2</span>
        </div>
      </div>
    </div>
  );
}

