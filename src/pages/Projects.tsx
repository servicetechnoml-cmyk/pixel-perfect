import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

const ProjectsPage = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground mb-4">Our Projects</motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Showcasing our best work across AI, web, and mobile.</motion.p>
        </motion.div>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : projects?.length === 0 ? (
          <div className="text-center text-muted-foreground">No projects to show yet.</div>
        ) : (
          <motion.div initial="hidden" animate="visible" className="grid gap-8 md:grid-cols-2">
            {projects?.map((p, i) => (
              <motion.div key={p.id} variants={fadeUp} custom={i} className="rounded-xl bg-card shadow-card hover:shadow-elevated transition-all overflow-hidden">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-56 object-cover" />}
                <div className="p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">{p.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  {p.tech_stack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tech_stack.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                    </div>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent text-sm font-semibold hover:underline">
                      Live Demo <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
