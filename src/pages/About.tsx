import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Shield, Star, Users, Heart, Award, Globe, Code2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "Pushing boundaries with cutting-edge AI & tech" },
  { icon: Shield, title: "Transparency", desc: "Open communication and honest business practices" },
  { icon: Star, title: "Quality", desc: "Excellence in every line of code we write" },
  { icon: Users, title: "Client-Centric", desc: "Your success is our primary measure of achievement" },
  { icon: Heart, title: "Long-Term Partnerships", desc: "Building relationships that grow with your business" },
];

const achievements = [
  { icon: Award, value: "100+", label: "Projects Delivered" },
  { icon: Globe, value: "15+", label: "Countries Served" },
  { icon: Users, value: "50+", label: "Expert Team Members" },
  { icon: Code2, value: "₹500Cr+", label: "Transactions Processed" },
];

const About = () => (
  <div>
    {/* Hero */}
    <section className="py-32 bg-gradient-to-br from-primary via-accent to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent blur-[80px]" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Who We Are</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            About RSverse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="text-white/80 max-w-2xl mx-auto text-xl leading-relaxed"
          >
            A global technology company specializing in AI automation and custom software solutions, empowering businesses since 2022.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Achievements */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((a, i) => (
            <motion.div key={a.label} variants={fadeUp} custom={i} className="group rounded-2xl bg-card p-8 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
                <a.icon className="text-primary" size={22} />
              </div>
              <p className="font-display text-2xl font-bold text-primary">{a.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{a.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Who We Are */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid gap-16 lg:grid-cols-2 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Our Story</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl font-bold text-gray-900 mb-6">
              Built for the Future of Business
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 leading-relaxed text-lg mb-4">
              RSverse was founded in 2022 with a singular vision: to make AI and intelligent automation accessible to every business, regardless of size. We believed that the future belongs to companies that can move faster, think smarter, and operate leaner.
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="text-gray-500 leading-relaxed text-lg">
              Today, we serve 100+ clients across 15+ countries, helping startups scale from zero to millions and enterprises automate complex workflows that save thousands of man-hours every year.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
            {[
              { label: "Founded", value: "2022" },
              { label: "Clients", value: "100+" },
              { label: "Countries", value: "15+" },
              { label: "Uptime SLA", value: "99.9%" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-accent/10 p-6 text-center border border-accent/20">
                <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="group rounded-2xl bg-gradient-to-br from-primary to-accent p-8 text-white shadow-sm border border-transparent hover:shadow-xl hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-2 hover:border-white/30">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-5">
              <Target className="text-white" size={28} />
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-white/85 leading-relaxed text-lg">
              To empower every business through intelligent automation, custom software, and technology-driven innovation — making the future accessible today.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="group rounded-2xl bg-card p-8 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
              <Eye className="text-primary" size={28} />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To become the world's most trusted AI & software engineering company — where innovation meets impact, and every client becomes a success story.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Core Values */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">What Drives Us</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl font-bold text-gray-900 mb-4">
            Core Values
          </motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <motion.div key={v.title} variants={fadeUp} custom={i} className="group flex flex-col items-center text-center rounded-2xl bg-card p-8 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30">
              <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <v.icon className="text-primary" size={26} />
              </div>
              <h3 className="font-display font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  </div>
);

export default About;
