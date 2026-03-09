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
      <section className="py-32 bg-gradient-to-br from-primary via-purple-600 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-purple-200 blur-[80px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Get In Touch</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            Let's Build Something Powerful
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="text-white/80 max-w-2xl mx-auto text-xl leading-relaxed"
          >
            Get a custom proposal tailored to your business needs — we respond within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.h2 variants={fadeUp} custom={0} className="font-display text-2xl font-bold text-foreground">
                Contact Information
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Mail className="text-accent" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Email</p>
                  <a href="mailto:service@technoml.in" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    service@technoml.in
                  </a>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} custom={2} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-accent" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Location</p>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>
              </motion.div>
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
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-xl bg-card p-8 shadow-card space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={fadeUp} custom={0}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your name"
                      />
                    </motion.div>
                    <motion.div variants={fadeUp} custom={1}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input
                        required
                        type="email"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="you@company.com"
                      />
                    </motion.div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={fadeUp} custom={2}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                      <input
                        type="tel"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your phone number"
                      />
                    </motion.div>
                    <motion.div variants={fadeUp} custom={3}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Company</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your company"
                      />
                    </motion.div>
                  </div>
                  <motion.div variants={fadeUp} custom={4}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Project Type</label>
                    <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select a project type</option>
                      <option>AI Automation</option>
                      <option>Custom Software</option>
                      <option>Web Application</option>
                      <option>Mobile Application</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={5}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Budget Range</label>
                    <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select budget range</option>
                      <option>$1,000 - $5,000</option>
                      <option>$5,000 - $15,000</option>
                      <option>$15,000 - $50,000</option>
                      <option>$50,000+</option>
                    </select>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={6}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} custom={7}>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      Send Message <Send size={18} />
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
