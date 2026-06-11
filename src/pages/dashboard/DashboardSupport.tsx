import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, FileQuestion, BookOpen, Bug } from "lucide-react";

const helpCards = [
  { icon: BookOpen, title: "Knowledge Base", desc: "Browse guides and tutorials." },
  { icon: FileQuestion, title: "FAQs", desc: "Common questions answered." },
  { icon: Bug, title: "Report a Bug", desc: "Found an issue? Let us know." },
];

const DashboardSupport = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Help & Support</h1>
        <p className="text-muted-foreground text-sm">Find answers or reach out to our support team.</p>
      </div>

      {/* Help Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {helpCards.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-5 text-center flex flex-col items-center"
            >
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-0.5">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Contact Support Card */}
      <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Info Panel */}
          <div className="bg-gradient-to-br from-primary to-purple-600 p-7 text-white">
            <h2 className="text-lg font-bold mb-3 font-display">Contact Support</h2>
            <p className="text-white/80 text-sm mb-6 max-w-sm leading-relaxed">
              Need direct assistance? Send us a message and our team will get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">Email Us</span>
                <p className="font-semibold text-sm">support@rsverse.in</p>
              </div>
              <div>
                <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">Live Chat</span>
                <p className="font-semibold text-sm">Available 9am – 5pm IST</p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="p-7">
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Issue Type</label>
                <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option>General Inquiry</option>
                  <option>Technical Issue</option>
                  <option>Mentorship Request</option>
                  <option>Account / Billing</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Subject</label>
                <Input placeholder="Briefly describe the issue..." className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Message</label>
                <textarea
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-y"
                  placeholder="Tell us what's going on..."
                />
              </div>
              <Button type="button" className="w-full h-9 rounded-lg text-sm">
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Submit Ticket
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSupport;
