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
  { icon: Lightbulb, title: "Innovation", desc: "Pushing boundaries with cutting-edge technology" },
  { icon: Shield, title: "Transparency", desc: "Open communication and honest business practices" },
  { icon: Star, title: "Quality", desc: "Excellence in every line of code we write" },
  { icon: Users, title: "Client-Centric", desc: "Your success is our primary measure of achievement" },
  { icon: Heart, title: "Long-Term Partnerships", desc: "Building relationships that grow with your business" },
];

const About = () => (
  <div>
    {/* Hero */}
    <section className="py-32 bg-gradient-to-br from-primary via-purple-600 to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-purple-200 blur-[80px]" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Who We Are</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            About TechnoML
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

    {/* Who We Are */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground mb-6">
            Who We Are
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground leading-relaxed text-lg mb-4">
            TechnoML is a global technology company specializing in AI automation and custom software solutions. Founded in 2022, we focus on building scalable, secure, and innovative digital systems that help businesses grow faster and operate smarter.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0} className="rounded-xl bg-card p-8 shadow-card">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Target className="text-accent" size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower businesses through intelligent automation and technology-driven innovation.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="rounded-xl bg-card p-8 shadow-card">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Eye className="text-accent" size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become a global leader in AI-powered business solutions.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Core Values */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="font-display text-3xl font-bold text-foreground mb-4">
            Core Values
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 max-w-5xl mx-auto"
        >
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              variants={fadeUp}
              custom={i}
              className="flex flex-col items-center text-center rounded-xl bg-card p-6 shadow-card"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <v.icon className="text-accent" size={24} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  </div>
);

export default About;
