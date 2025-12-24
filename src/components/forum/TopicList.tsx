import { Topic } from "../../lib/api";
import TopicCard from "./TopicCard";

interface TopicListProps {
  topics: Topic[];
  loading: boolean;
}

export default function TopicList({ topics, loading }: TopicListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="h-16 w-full animate-pulse rounded-md border border-border/50 bg-secondary/20" 
          />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center text-muted-foreground">
        <p className="font-medium text-crust">No communities found</p>
        <p className="text-sm">Be the first to start one!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}