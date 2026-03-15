import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, Code, Globe, Smartphone, Cloud, Headphones,
  Cpu, Building2, ShoppingCart, GraduationCap, Heart, Factory, Rocket,
  ArrowRight, Zap, Shield, Users
} from "lucide-react";
import HeroScene from "@/components/HeroScene";
import WaveBottom from "@/components/WaveBottom";

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
          <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-white text-xs font-semibold tracking-wide uppercase">AI Automation & Software Engineering</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Build Your IT Here
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              You Have A Vision. We Have A Team To Get You There
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary transition-all hover:shadow-2xl hover:scale-105">
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50">
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <WaveBottom className="z-20" />
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-10 shadow-elevated border border-primary/20"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={scaleIn} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why TechnoML */}
      <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">RSverse</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We combine deep AI expertise with world-class software engineering to deliver solutions that matter.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} variants={scaleIn} className="group rounded-2xl bg-card p-8 shadow-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 border border-transparent hover:border-primary/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">What We Do</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              End-to-end technology solutions from AI automation to cloud deployment.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div key={s.title} variants={scaleIn} className="group relative rounded-2xl bg-gradient-to-br from-card to-primary/5 p-8 shadow-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-primary/10 hover:border-primary/30">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <s.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link to="/services" className="group inline-flex items-center gap-2 text-primary font-bold text-lg hover:underline">
              View All Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Our Tech Stack</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">Industry-leading tools and frameworks we master</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {techStack.map((tech) => (
              <motion.span key={tech} variants={scaleIn} className="rounded-full border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-600/5 px-6 py-2.5 text-sm font-semibold text-foreground shadow-card hover:border-primary/50 hover:shadow-primary/10 hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-default">
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Industries We Serve</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">Trusted across diverse sectors globally</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((ind) => (
              <motion.div key={ind.name} variants={scaleIn} className="group flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-card to-primary/5 p-6 shadow-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 border border-primary/10 hover:border-primary/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                  <ind.icon className="text-primary" size={30} />
                </div>
                <span className="font-display font-bold text-sm text-foreground text-center">{ind.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Testimonials</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Trusted by Industry Leaders</h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="grid gap-6 md:grid-cols-3">
              {[
                { quote: "TechnoML transformed our manual processes into fully automated workflows. We saved 200+ hours per month.", author: "CEO, FinTech Startup", stars: 5 },
                { quote: "Their AI-powered fraud detection system reduced our false positives by 85%. Incredible engineering team.", author: "CTO, Digital Bank", stars: 5 },
                { quote: "From concept to production in 8 weeks. TechnoML delivered our mobile app ahead of schedule with exceptional quality.", author: "Founder, EdTech Platform", stars: 5 },
              ].map((t, i) => (
                <motion.div key={i} variants={scaleIn} className="rounded-2xl bg-card p-8 shadow-card border border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_, j) => <span key={j} className="text-yellow-400 text-lg">★</span>)}</div>
                  <p className="text-muted-foreground leading-relaxed mb-6 italic text-sm">"{t.quote}"</p>
                  <p className="text-xs font-bold text-foreground">— {t.author}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-purple-600 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-300 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-6xl font-bold mb-6">
              Ready to Automate and Scale?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-white/90 max-w-2xl mx-auto mb-10 text-xl">
              Let's build something powerful together. Get a custom proposal tailored to your business needs.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-xl font-bold text-primary transition-all hover:shadow-2xl hover:scale-105">
                Request a Quote Now <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
