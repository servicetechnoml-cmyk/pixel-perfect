import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground mb-4">Blog</motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Insights on AI, software engineering, and digital transformation.</motion.p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-card shadow-card overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <div className="text-center text-muted-foreground">No blog posts yet. Check back soon!</div>
        ) : (
          <motion.div initial="hidden" animate="visible" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post, i) => (
              <motion.article key={post.id} variants={fadeUp} custom={i} className="rounded-xl bg-card shadow-card hover:shadow-elevated transition-all overflow-hidden group">
                {post.cover_image && (
                  <img src={post.cover_image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar size={14} />
                    {new Date(post.created_at!).toLocaleDateString()}
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground mb-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="inline-block mt-4 text-accent text-sm font-semibold hover:underline">Read More →</Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;
