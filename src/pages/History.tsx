import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

const History = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["company-history"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_history").select("*").eq("published", true).order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" animate="visible" className="text-center mb-16">
          <motion.h1 variants={fadeUp} custom={0} className="font-display text-4xl font-bold text-foreground mb-4">Our Journey</motion.h1>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Key milestones in the TechnoML story.</motion.p>
        </motion.div>
        {isLoading ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-6">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 rounded-xl bg-card p-6 shadow-card space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center text-muted-foreground">Timeline coming soon.</div>
        ) : (
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />
            {events?.map((event, i) => (
              <motion.div key={event.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center z-10">
                  <Clock size={16} className="text-accent-foreground" />
                </div>
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] rounded-xl bg-card p-6 shadow-card ${i % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto"}`}>
                  {event.event_date && <span className="text-xs text-accent font-semibold">{new Date(event.event_date).toLocaleDateString()}</span>}
                  <h3 className="font-display font-semibold text-foreground mt-1">{event.title}</h3>
                  {event.description && <p className="text-sm text-muted-foreground mt-2">{event.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
