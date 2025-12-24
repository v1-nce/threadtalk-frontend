import Link from "next/link";
import { Post } from "../../lib/api";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="group flex flex-col gap-1 rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-bold text-foreground">{post.username}</span>
        <span>•</span>
        <span>{formatDate(post.created_at)}</span>
      </div>

      <h3 className="text-lg font-bold leading-tight text-crust group-hover:text-primary">
        {post.title}
      </h3>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {post.content}
      </p>

      <div className="mt-2 flex items-center gap-4 text-xs font-bold text-muted-foreground">
        <div className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-secondary/50">
          <span>💬 Comments</span>
        </div>
        <div className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-secondary/50">
          <span>↗ Share</span>
        </div>
      </div>
    </Link>
  );
}