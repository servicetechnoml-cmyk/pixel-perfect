import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Phone, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-32 bg-gradient-to-br from-primary via-accent to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent blur-[80px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Start Your Journey</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            Launch Your Career with RSverse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="text-white/80 max-w-2xl mx-auto text-xl leading-relaxed"
          >
            Apply for our internship program or submit your queries. We foster a space for passionate learners, developers, and creators to grow.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-2xl font-bold text-gray-900">
                Internship Program
              </motion.h2>
              {[
                { icon: Mail, label: "Careers Email", value: "careers@rsverse.in", href: "mailto:careers@rsverse.in" },
                { icon: Phone, label: "Contact Phone", value: "+91 78690 21171", href: "tel:+917869021171" },
                { icon: MapPin, label: "Work Mode", value: "Remote / Hybrid (India)" },
                { icon: Clock, label: "Review Time", value: "Within 2-3 business days" },
              ].map((c, i) => (
                <motion.div key={c.label} variants={fadeUp} custom={i + 1} className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-card border border-primary/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <c.icon className="text-primary" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm text-gray-500 hover:text-primary transition-colors">{c.value}</a>
                    ) : (
                      <p className="text-sm text-gray-500">{c.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-card p-12 shadow-card text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="text-accent" size={28} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground">Thank you for your interest in RSverse. We have received your query/application and will reach out to you within 2-3 business days.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-xl bg-gray-50 p-8 shadow-sm border border-gray-100 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={fadeUp} custom={0}>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Full Name</label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </motion.div>
                    <motion.div variants={fadeUp} custom={1}>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="john.doe@example.com"
                      />
                    </motion.div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={fadeUp} custom={2}>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Phone Number</label>
                      <input
                        required
                        type="tel"
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </motion.div>
                    <motion.div variants={fadeUp} custom={3}>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">College / University / Company</label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="University Name"
                      />
                    </motion.div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={fadeUp} custom={4}>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Preferred Internship Track</label>
                      <select required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Select a track</option>
                        <option value="software-engineering">Software Engineering (Frontend/Backend/Fullstack)</option>
                        <option value="ai-ml">AI/ML & Automation Engineering</option>
                        <option value="ui-ux">UI/UX Design</option>
                        <option value="tech-support">Technical Support & QA</option>
                        <option value="other">Other</option>
                      </select>
                    </motion.div>
                    <motion.div variants={fadeUp} custom={5}>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Internship Duration</label>
                      <select required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Select duration</option>
                        <option value="2-months">2 Months</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="other">Other / Flexible</option>
                      </select>
                    </motion.div>
                  </div>
                  <motion.div variants={fadeUp} custom={6}>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Resume / Portfolio Link</label>
                    <input
                      required
                      type="url"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Link to your Resume (Google Drive, Dropbox, LinkedIn, etc.)"
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} custom={7}>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Cover Letter / Internship Query</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Tell us about your background, programming languages known, projects, and what you hope to achieve..."
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} custom={8}>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary text-white px-6 py-3.5 font-bold hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Submit Internship Query <Send size={18} />
                    </button>
                  </motion.div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
