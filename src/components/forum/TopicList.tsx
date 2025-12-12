import { Topic } from "../../lib/api";
import TopicCard from "./TopicCard";

interface TopicListProps {
  topics: Topic[];
  loading: boolean;
}

export default function TopicList({ topics, loading }: TopicListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary/30" />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center text-muted-foreground">
        <p>No communities found.</p>
        <p className="text-sm">Be the first to start one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}