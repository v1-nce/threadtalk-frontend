import Link from "next/link";
import { Topic } from "../../lib/api";

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link 
      href={`/topic/${topic.id}`}
      className="group block space-y-3 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/50 hover:shadow-warm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-crust group-hover:text-primary transition-colors">
          {topic.name}
        </h3>
        <svg 
          className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {topic.description}
      </p>
    </Link>
  );
}