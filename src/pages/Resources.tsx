import { motion } from "framer-motion";
import { BookOpen, Video, FileText, PlayCircle } from "lucide-react";

const Resources = () => {
  const categories = [
    {
      title: "Documentation",
      icon: BookOpen,
      desc: "Step-by-step written guides for all tech stacks.",
      items: ["React & Next.js Guide", "Node.js API Basics", "Database Schema Design"]
    },
    {
      title: "Video Tutorials",
      icon: Video,
      desc: "In-depth video walkthroughs and lectures.",
      items: ["Building a Fullstack App", "State Management Deep Dive", "Deploying to AWS"]
    },
    {
      title: "Project Briefs",
      icon: FileText,
      desc: "Detailed requirements for internship projects.",
      items: ["E-Commerce Dashboard", "Chat Application", "Portfolio Generator"]
    },
    {
      title: "Recorded Sessions",
      icon: PlayCircle,
      desc: "Past Q&A and masterclass recordings.",
      items: ["Resume Building", "Interview Prep", "System Architecture"]
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Learning <span className="text-primary">Resources</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Access our comprehensive library of documentation, video tutorials, and project guides to help you succeed in your internship.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <cat.icon size={24} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">{cat.title}</h2>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </div>
              </div>
              <ul className="space-y-3 mt-6">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm hover:text-primary cursor-pointer transition-colors">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-6 text-sm font-semibold text-primary hover:underline">
                View All →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
