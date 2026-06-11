import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, Code, Globe, Smartphone, Cloud, Headphones,
  Cpu, Building2, ShoppingCart, GraduationCap, Heart, Factory, Rocket,
  ArrowRight, Zap, Shield, Users, CheckCircle2, LayoutTemplate, PenTool, Megaphone, MonitorPlay, Briefcase, BookOpen, Award
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

const features = [
  { icon: Bot, title: "Fully Automated Flow", desc: "No manual intervention. System assigns, evaluates, and certificates.", color: "from-primary to-primary" },
  { icon: BookOpen, title: "Self-Learning Docs", desc: "Comprehensive documentation to learn and build independently.", color: "from-accent to-accent" },
  { icon: MonitorPlay, title: "Video Resources", desc: "In-depth video tutorials for complex concepts and tools.", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: Briefcase, title: "Real-World Projects", desc: "Work on industry-standard tasks instead of generic assignments.", color: "from-orange-500/20 to-amber-500/20" },
  { icon: Cloud, title: "Cloud Portal", desc: "Access your dashboard, tasks, and progress 24/7 from anywhere.", color: "from-primary to-primary" },
  { icon: Award, title: "Verified Certificates", desc: "Automated verifiable credential generation upon completion.", color: "from-accent to-accent" },
];

const whyUs = [
  { icon: Cpu, title: "AI-Powered Evaluation", desc: "Smart systems track your progress and evaluate submissions instantly." },
  { icon: Shield, title: "Remote Flexibility", desc: "Learn and work completely remotely on your own schedule." },
  { icon: Zap, title: "Fast-Track Career", desc: "Gain practical experience that directly translates to job readiness." },
  { icon: Users, title: "Community Driven", desc: "Join thousands of other learners scaling up their skills." },
];

const stats = [
  { value: "50,000+", label: "Active Interns" },
  { value: "100%", label: "Automated Process" },
  { value: "50+", label: "Tech Domains" },
  { value: "4.9/5", label: "Student Rating" },
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
              <span className="text-white text-xs font-semibold tracking-wide uppercase">Fully Automated Virtual Internships</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Start Your Virtual Internship
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Gain real-world experience through fully automated, self-paced projects with expert documentation and video resources.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 justify-center">
              <Link to="/internships" className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary transition-all hover:shadow-2xl hover:scale-105">
                Browse Internships <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/resources" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50">
                View Resources
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
                <p className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why RSverse */}
      <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RSverse</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We combine deep AI expertise with world-class software engineering to deliver solutions that matter.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} variants={scaleIn} className="group rounded-2xl bg-card p-8 shadow-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 border border-transparent hover:border-primary/20">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Everything You Need</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A comprehensive virtual platform designed for self-paced learning and practical experience.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((s, i) => (
              <motion.div key={s.title} variants={scaleIn} className="group relative rounded-2xl bg-gradient-to-br from-card to-primary/5 p-8 shadow-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-primary/10 hover:border-primary/30">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <s.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link to="/internships" className="group inline-flex items-center gap-2 text-primary font-bold text-lg hover:underline">
              Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
              <motion.span key={tech} variants={scaleIn} className="rounded-full border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent px-6 py-2.5 text-sm font-semibold text-foreground shadow-card hover:border-primary/50 hover:shadow-primary/10 hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-default">
                {tech}
              </motion.span>
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
                { quote: "The self-paced learning and video resources were incredible. I learned more in 2 months than I did in an entire semester.", author: "Frontend Intern", stars: 5 },
                { quote: "Fully automated task assignment and evaluation. I didn't have to wait for anyone to check my work. Highly recommended!", author: "Data Science Intern", stars: 5 },
                { quote: "The real-world projects helped me build a portfolio that actually got me hired. The verified certificate was a big plus.", author: "Full Stack Intern", stars: 5 },
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

      {/* ═══ INTERNSHIP PLATFORM SECTIONS ═══ */}

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Simple Process</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-lg">Your path to a successful career in 4 simple steps</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", desc: "Create your student profile and choose your path" },
              { step: "02", title: "Choose", desc: "Select an internship domain that matches your passion" },
              { step: "03", title: "Complete", desc: "Finish real-world tasks & skill assessments" },
              { step: "04", title: "Certify", desc: "Get your official verified certificate" },
            ].map((item, i) => (
              <motion.div key={i} variants={scaleIn} className="flex flex-col items-center text-center group">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-2xl font-bold text-primary mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Internship Categories */}
      <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Internship <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Categories</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-lg">Explore domains that match your passion</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Code, name: "Web Dev", color: "from-primary to-primary" },
              { icon: MonitorPlay, name: "AI Automation", color: "from-accent to-accent" },
              { icon: Briefcase, name: "Mobile Apps", color: "from-emerald-500/20 to-teal-500/20" },
              { icon: Megaphone, name: "Digital Marketing", color: "from-orange-500/20 to-amber-500/20" },
              { icon: LayoutTemplate, name: "UI/UX Design", color: "from-accent to-accent" },
              { icon: PenTool, name: "DevOps", color: "from-primary to-primary" },
            ].map((cat, i) => (
              <motion.div key={i} variants={scaleIn} className="group flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3 border border-primary/10 hover:border-primary/30 cursor-pointer">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground text-center">{cat.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Internships</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">Kickstart your career with our top programs</motion.p>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/internships" className="group inline-flex items-center gap-2 text-primary font-bold hover:underline">
                View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Frontend Web Developer", domain: "Web Development", duration: "4 Weeks", color: "from-primary to-primary" },
              { title: "UX/UI Designer", domain: "Design", duration: "6 Weeks", color: "from-accent to-accent" },
              { title: "Machine Learning Trainee", domain: "AI Automation", duration: "8 Weeks", color: "from-accent to-accent" },
            ].map((intern, i) => (
              <motion.div key={i} variants={scaleIn} className="group rounded-2xl bg-card overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-3">
                <div className={`h-40 bg-gradient-to-br ${intern.color} flex items-center justify-center`}>
                  <div className="w-20 h-20 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <GraduationCap className="text-primary" size={36} />
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary uppercase tracking-wide mb-3">Remote</span>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{intern.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{intern.domain}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <span className="text-sm font-medium text-foreground">{intern.duration}</span>
                    <Link to="/register" className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                      Apply Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose RSverse - Benefits */}
      <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-white blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent blur-[80px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-5xl font-bold mb-8">Why Choose RSverse?</motion.h2>
              <motion.ul variants={staggerContainer} className="space-y-4">
                {[
                  "Work on Real-world Projects",
                  "Earn a Verified Certificate",
                  "Get a Letter of Recommendation (LOR)",
                  "100% Remote & Flexible",
                  "Practical Skill Development",
                ].map((benefit, i) => (
                  <motion.li key={i} variants={fadeUp} custom={i} className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <motion.div variants={fadeUp} custom={3} className="relative h-[360px] rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-5">🏆</div>
                <h3 className="text-2xl font-bold mb-3 font-display">Build Your Career</h3>
                <p className="text-white/80 max-w-xs mx-auto">Join thousands of students who have kickstarted their journey with us.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Internship CTA */}
      <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ready to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Start</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto mb-10 text-xl">
              Apply for an internship today and take the first step towards your dream career.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/register" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-10 py-5 text-xl font-bold text-white transition-all hover:shadow-2xl hover:shadow-primary/30 hover:scale-105">
                Apply for Internship Today <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent blur-[100px]" />
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
