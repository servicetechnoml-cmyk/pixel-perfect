import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, Code, Globe, Smartphone, Cloud, Headphones,
  Cpu, Building2, ShoppingCart, GraduationCap, Heart, Factory, Rocket,
  ArrowRight, Zap, Shield, Users
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const services = [
  { icon: Bot, title: "AI Workflow Automation", desc: "Reduce manual work with intelligent automation systems" },
  { icon: Code, title: "Custom Software", desc: "Scalable, secure software tailored to your needs" },
  { icon: Globe, title: "Web App Development", desc: "Modern, responsive, SEO-optimized web applications" },
  { icon: Smartphone, title: "Mobile App Development", desc: "Cross-platform mobile apps with React Native & Flutter" },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Scalable cloud infrastructure and deployment pipelines" },
  { icon: Headphones, title: "Technical Support", desc: "Monitoring, bug fixing, and performance optimization" },
];

const whyUs = [
  { icon: Cpu, title: "AI-Powered Experts", desc: "Deep expertise in AI and machine learning automation" },
  { icon: Shield, title: "End-to-End Development", desc: "From concept to deployment and maintenance" },
  { icon: Zap, title: "Scalable Solutions", desc: "Built to grow with your business needs" },
  { icon: Users, title: "Client-Centric", desc: "Long-term partnerships focused on your success" },
];

const industries = [
  { icon: Building2, name: "FinTech" },
  { icon: ShoppingCart, name: "E-commerce" },
  { icon: GraduationCap, name: "EdTech" },
  { icon: Heart, name: "Healthcare" },
  { icon: Factory, name: "Manufacturing" },
  { icon: Rocket, name: "Startups & SaaS" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              AI Automation & Software Engineering
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Transforming Businesses with{" "}
              <span className="text-gradient">AI Automation</span> & Scalable Solutions
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/80 max-w-2xl mb-8 leading-relaxed">
              TechnoML helps startups and enterprises automate workflows, build intelligent systems, and develop powerful web & mobile applications that drive growth.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:opacity-90"
              >
                Request a Quote <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                Explore Services
              </Link>
            </motion.div>
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                className="rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
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
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Do
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end technology solutions from AI automation to cloud deployment.
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                custom={i}
                className="group rounded-xl bg-card p-8 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <s.icon className="text-accent" size={28} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
            >
              View All Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Industries We Serve
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-card hover:shadow-elevated transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <ind.icon className="text-accent" size={28} />
                </div>
                <span className="font-display font-medium text-sm text-foreground">{ind.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Automate and Scale Your Business?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Let's build something powerful together. Get a custom proposal tailored to your business needs.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground transition-all hover:opacity-90"
              >
                Request a Quote Now <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
