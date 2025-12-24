"use client";

import Link from "next/link";
import { Topic } from "../../lib/api";

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topic/${topic.id}`} 
      className="group flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 transition-all hover:border-primary/50 hover:bg-accent/50"
    >
      <div className="flex flex-col text-left min-w-0 flex-1 pr-4">
        <span className="font-bold text-crust decoration-primary/50 underline-offset-2 group-hover:underline truncate block">
          {topic.name}
        </span>
        {topic.description && (
          <span className="truncate text-xs text-muted-foreground block">
            {topic.description}
          </span>
        )}
      </div>
      
      <div className="shrink-0 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground group-hover:bg-secondary/80">
        View
      </div>
    </Link>
  );
}