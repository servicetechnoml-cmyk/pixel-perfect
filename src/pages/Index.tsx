import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, Code, Globe, Smartphone, Cloud, Headphones,
  Cpu, Building2, ShoppingCart, GraduationCap, Heart, Factory, Rocket,
  ArrowRight, Zap, Shield, Users, CheckCircle, TrendingUp
} from "lucide-react";
import HeroScene from "@/components/HeroScene";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const services = [
  { icon: Bot, title: "AI Workflow Automation", desc: "Reduce manual work with intelligent automation systems", color: "from-blue-500/20 to-cyan-500/20" },
  { icon: Code, title: "Custom Software", desc: "Scalable, secure software tailored to your needs", color: "from-violet-500/20 to-purple-500/20" },
  { icon: Globe, title: "Web App Development", desc: "Modern, responsive, SEO-optimized web applications", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: Smartphone, title: "Mobile App Development", desc: "Cross-platform mobile apps with React Native & Flutter", color: "from-orange-500/20 to-amber-500/20" },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Scalable cloud infrastructure and deployment pipelines", color: "from-sky-500/20 to-blue-500/20" },
  { icon: Headphones, title: "Technical Support", desc: "Monitoring, bug fixing, and performance optimization", color: "from-rose-500/20 to-pink-500/20" },
];

const whyUs = [
  { icon: Cpu, title: "AI-Powered Experts", desc: "Deep expertise in AI and machine learning automation" },
  { icon: Shield, title: "End-to-End Development", desc: "From concept to deployment and maintenance" },
  { icon: Zap, title: "Scalable Solutions", desc: "Built to grow with your business needs" },
  { icon: Users, title: "Client-Centric", desc: "Long-term partnerships focused on your success" },
];

const stats = [
  { value: "100+", label: "Clients Served" },
  { value: "₹500Cr+", label: "Transactions Processed" },
  { value: "50+", label: "Team Members" },
  { value: "99.9%", label: "Uptime SLA" },
];

const industries = [
  { icon: Building2, name: "FinTech" },
  { icon: ShoppingCart, name: "E-commerce" },
  { icon: GraduationCap, name: "EdTech" },
  { icon: Heart, name: "Healthcare" },
  { icon: Factory, name: "Manufacturing" },
  { icon: Rocket, name: "Startups & SaaS" },
];

const techStack = ["React", "Next.js", "Node.js", "Python", "TensorFlow", "AWS", "PostgreSQL", "Docker", "Kubernetes", "Flutter", "FastAPI", "Redis"];

const Index = () => {
  return (
    <div>
      {/* Hero with 3D */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-hero">
        <HeroScene />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-accent text-xs font-semibold tracking-wide uppercase">AI Automation & Software Engineering</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
              Transforming Businesses with{" "}
              <span className="text-gradient">AI Automation</span> & Scalable Solutions
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mb-8 leading-relaxed">
              TechnoML helps startups and enterprises automate workflows, build intelligent systems, and develop powerful web & mobile applications that drive growth.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/25 hover:scale-105">
                Request a Quote <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 backdrop-blur-sm px-7 py-3.5 font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10 hover:border-primary-foreground/40">
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-card p-6 md:p-8 shadow-elevated"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={scaleIn} className="text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-accent">{s.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why TechnoML */}
      <section className="py-24 bg-glow">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why <span className="text-gradient">TechnoML</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              We combine deep AI expertise with world-class software engineering to deliver solutions that matter.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <motion.div key={item.title} variants={scaleIn} className="group rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="text-accent" size={24} />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">What We Do</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end technology solutions from AI automation to cloud deployment.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <motion.div key={s.title} variants={scaleIn} className="group relative rounded-xl bg-card p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 group-hover:rotate-6 transition-all duration-300">
                    <s.icon className="text-accent" size={28} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link to="/services" className="group inline-flex items-center gap-2 text-accent font-semibold hover:underline">
              View All Services <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Our Tech Stack</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <motion.span key={tech} variants={scaleIn} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-card hover:shadow-elevated hover:border-accent/50 hover:scale-105 transition-all duration-200 cursor-default">
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Industries We Serve</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((ind) => (
              <motion.div key={ind.name} variants={scaleIn} className="group flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <ind.icon className="text-accent" size={28} />
                </div>
                <span className="font-display font-medium text-sm text-foreground">{ind.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by Industry Leaders</h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="grid gap-6 md:grid-cols-3">
              {[
                { quote: "TechnoML transformed our manual processes into fully automated workflows. We saved 200+ hours per month.", author: "CEO, FinTech Startup" },
                { quote: "Their AI-powered fraud detection system reduced our false positives by 85%. Incredible engineering team.", author: "CTO, Digital Bank" },
                { quote: "From concept to production in 8 weeks. TechnoML delivered our mobile app ahead of schedule with exceptional quality.", author: "Founder, EdTech Platform" },
              ].map((t, i) => (
                <motion.div key={i} variants={scaleIn} className="rounded-xl bg-card p-6 shadow-card">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <span key={j} className="text-accent">★</span>)}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <p className="text-xs font-semibold text-foreground">— {t.author}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent/70 blur-[80px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-5xl font-bold mb-4">
              Ready to Automate and Scale?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 max-w-xl mx-auto mb-8 text-lg">
              Let's build something powerful together. Get a custom proposal tailored to your business needs.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/25 hover:scale-105">
                Request a Quote Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
