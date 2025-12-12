import Link from "next/link";
import { Post } from "../../lib/api";

interface PostCardProps {
  post: Post;
  detailed?: boolean;
}

export default function PostCard({ post, detailed = false }: PostCardProps) {
  const content = (
    <div className={`space-y-3 rounded-xl border border-border bg-card p-6 ${
      detailed ? "shadow-none border-b-0 rounded-b-none" : "shadow-card transition-all hover:border-primary/50 hover:shadow-warm"
    }`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="font-bold text-foreground">u/{post.username}</span>
        <span>•</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <h2 className={`font-display font-bold text-crust ${detailed ? "text-3xl" : "text-xl group-hover:text-primary"}`}>
        {post.title}
      </h2>

      <div className={`text-foreground/90 whitespace-pre-wrap ${detailed ? "" : "line-clamp-3 text-sm"}`}>
        {post.content}
      </div>
    </div>
  );

  if (detailed) return content;

  return (
    <Link href={`/post/${post.id}`} className="group block">
      {content}
    </Link>
  );
}