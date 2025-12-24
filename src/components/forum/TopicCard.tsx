import Link from "next/link";
import { Topic } from "../../lib/api";

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topic/${topic.id}`} 
      className="group flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 transition-all hover:border-primary/50 hover:bg-accent/50"
    >
      <div className="flex flex-col text-left">
        <span className="font-bold text-crust decoration-primary/50 underline-offset-2 group-hover:underline">
          {topic.name}
        </span>
        {topic.description && (
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {topic.description}
          </span>
        )}
      </div>
      
      <div className="rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground group-hover:bg-secondary/80">
        View
      </div>
    </Link>
  );
}