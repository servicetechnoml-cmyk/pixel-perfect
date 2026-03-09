import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bot, Code, Globe, Smartphone, Headphones, Server,
  Mail, Users, MessageSquare, Workflow, Brain, Database, Target,
  ArrowRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const sections = [
  {
    icon: Bot,
    title: "AI Automation",
    desc: "We design and implement intelligent automation systems to reduce manual work and increase operational efficiency.",
    items: [
      { icon: Mail, text: "Email Automation" },
      { icon: Users, text: "CRM Automation" },
      { icon: MessageSquare, text: "WhatsApp Automation" },
      { icon: Workflow, text: "Workflow Automation (n8n / Zapier / Make)" },
      { icon: Brain, text: "AI Chatbots" },
      { icon: Database, text: "AI Data Processing Systems" },
      { icon: Target, text: "Lead Automation Systems" },
    ],
  },
  {
    icon: Code,
    title: "Custom Software Development",
    desc: "We build scalable, secure, and performance-driven software tailored to your business needs.",
    items: [
      { text: "React.js & Next.js" },
      { text: "Node.js & Python" },
      { text: "Django & PostgreSQL" },
      { text: "AWS & Cloud Infrastructure" },
    ],
  },
  {
    icon: Globe,
    title: "Web Application Development",
    desc: "Modern, responsive, SEO-optimized web applications built with cutting-edge technologies.",
    items: [
      { text: "SaaS Platforms" },
      { text: "Admin Panels & Dashboards" },
      { text: "Marketplaces" },
      { text: "CRM Systems" },
      { text: "Affiliate Systems" },
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Cross-platform mobile applications for iOS and Android.",
    items: [
      { text: "React Native & Flutter" },
      { text: "FinTech & E-commerce Apps" },
      { text: "Booking & Business Apps" },
    ],
  },
  {
    icon: Headphones,
    title: "Technical Support & Maintenance",
    desc: "Ongoing support to keep your systems running smoothly.",
    items: [
      { text: "Server Monitoring" },
      { text: "Bug Fixing & Performance Optimization" },
      { text: "Security Updates" },
      { text: "DevOps Support" },
    ],
  },
];

const Services = () => (
  <div>
    {/* Hero */}
    <section className="py-32 bg-gradient-to-br from-primary via-purple-600 to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-purple-200 blur-[80px]" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">What We Offer</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl md:text-6xl font-bold mb-6"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="text-white/80 max-w-2xl mx-auto text-xl leading-relaxed"
        >
          End-to-end technology solutions — from AI automation to cloud deployment — built for scale.
        </motion.p>
      </div>
    </section>

    {/* Services */}
    <section className="py-24">
      <div className="container mx-auto px-4 space-y-20">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`grid gap-12 lg:grid-cols-2 items-center ${si % 2 === 1 ? "lg:direction-rtl" : ""}`}
          >
            <motion.div variants={fadeUp} custom={0} className={si % 2 === 1 ? "lg:order-2" : ""}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center mb-5">
                <section.icon className="text-primary" size={32} />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">{section.desc}</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 font-semibold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-200"
              >
                Get Started <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className={si % 2 === 1 ? "lg:order-1" : ""}>
              <div className="grid gap-3">
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.text}
                    variants={fadeUp}
                    custom={i + 2}
                    className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-card border border-primary/10 hover:border-primary/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon ? <item.icon className="text-primary" size={18} /> : <Code className="text-primary" size={18} />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground mb-4">Need a Custom Solution?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Tell us about your project and we'll provide a tailored proposal.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-accent-foreground hover:opacity-90 transition-all"
        >
          Request a Quote <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  </div>
);

export default Services;
