import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

const Certifications = () => {
  const { data: certs, isLoading } = useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications").select("*").eq("published", true).order("date_issued", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground mb-4">Certifications</motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Our achievements and recognized certifications.</motion.p>
        </motion.div>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-card p-6 shadow-card space-y-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : certs?.length === 0 ? (
          <div className="text-center text-muted-foreground">No certifications posted yet.</div>
        ) : (
          <motion.div initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certs?.map((c, i) => (
              <motion.div key={c.id} variants={fadeUp} custom={i} className="rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-all">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  {c.image_url ? <img src={c.image_url} alt={c.title} className="w-8 h-8 object-contain" /> : <Award className="text-accent" size={24} />}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{c.title}</h3>
                {c.issuer && <p className="text-xs text-accent mb-2">{c.issuer}</p>}
                {c.date_issued && <p className="text-xs text-muted-foreground mb-3">{new Date(c.date_issued).toLocaleDateString()}</p>}
                {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Certifications;
