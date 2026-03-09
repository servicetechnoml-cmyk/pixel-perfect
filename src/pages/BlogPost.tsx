import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug!).eq("published", true).single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="py-24 text-center text-muted-foreground">Loading...</div>;
  if (!post) return <div className="py-24 text-center text-muted-foreground">Post not found.</div>;

  return (
    <div className="py-24">
      <article className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-accent text-sm mb-8 hover:underline">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        {post.cover_image && <img src={post.cover_image} alt={post.title} className="w-full rounded-xl mb-8 shadow-card" />}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar size={14} /> {new Date(post.created_at!).toLocaleDateString()}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">{post.title}</h1>
        <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">{post.content}</div>
      </article>
    </div>
  );
};

export default BlogPost;
