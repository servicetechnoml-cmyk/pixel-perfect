import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

type Application = {
  id: string;
  domain_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  domain?: { title: string; description: string | null; duration_months: number };
};

const DashboardInternship = () => {
  const { user } = useAuth();
  const [app, setApp] = useState<Application | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: apps } = await supabase
      .from("internship_applications")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .limit(1);

    if (apps && apps.length > 0) {
      const a = apps[0];
      const { data: domain } = await supabase
        .from("internship_domains")
        .select("title, description, duration_months")
        .eq("id", a.domain_id)
        .single();

      setApp({ ...a, domain: domain || undefined });

      const { data: tasks } = await supabase.from("internship_tasks").select("id").eq("domain_id", a.domain_id);
      setTaskCount(tasks?.length || 0);

      if (tasks && tasks.length > 0) {
        const { data: subs } = await supabase
          .from("internship_submissions")
          .select("id")
          .eq("application_id", a.id)
          .eq("status", "approved");
        setCompletedCount(subs?.length || 0);
      }
    }
    setLoading(false);
  };

  const progressPct = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-64 bg-card rounded-xl animate-pulse border border-border/50" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">My Internship</h1>
          <p className="text-muted-foreground text-sm">Details, schedule, and mentors for your current program.</p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[1px] rounded-xl border border-border/50">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-foreground mb-2">No Active Internship</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto text-center mb-6">
              You don't have an active internship yet. Apply for one to unlock your curriculum and mentor details.
            </p>
            <Button className="rounded-xl shadow-sm px-8" asChild>
              <Link to="/internships">Apply for Internship</Link>
            </Button>
          </div>
          <div className="opacity-40 pointer-events-none">
            <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-primary via-purple-600 to-primary px-6 py-6 flex items-end">
                <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">Sample Internship Domain</Badge>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-2">Sample Internship Domain</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        In this intensive internship, you will work on real-world projects and build production-ready skills. You will be assigned tasks mimicking a professional development environment.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-muted/50 p-4 rounded-xl border border-border/40 space-y-3">
                      <h3 className="font-semibold text-sm text-foreground">Timeline</h3>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Start</span>
                        <span className="font-medium text-foreground">DD/MM/YYYY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">My Internship</h1>
        <p className="text-muted-foreground text-sm">Details, schedule, and mentors for your current program.</p>
      </div>

      <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="h-28 bg-gradient-to-r from-primary via-purple-600 to-primary px-6 py-6 flex items-end">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">
            {app.domain?.title || "Internship"}
          </Badge>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">{app.domain?.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {app.domain?.description ||
                    `In this ${app.domain?.duration_months || "?"}-month intensive internship, you will work on real-world projects and build production-ready skills. You will be assigned tasks mimicking a professional development environment.`}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Key Objectives
                </h3>
                <ul className="space-y-1.5 text-muted-foreground text-sm ml-6 list-disc">
                  <li>Master core concepts and hands-on tools.</li>
                  <li>Implement real deliverables following industry standards.</li>
                  <li>Integrate APIs and handle professional workflows.</li>
                  <li>Submit final project for review and certification.</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="rounded-lg flex-1 md:flex-none">Submit Project</Button>
                <Button variant="outline" className="rounded-lg flex-1 md:flex-none">View Tasks</Button>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-5">
              <div className="bg-muted/50 p-4 rounded-xl border border-border/40 space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Timeline</h3>
                {app.start_date && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Start
                    </span>
                    <span className="font-medium text-foreground">{new Date(app.start_date).toLocaleDateString()}</span>
                  </div>
                )}
                {app.end_date && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> End
                    </span>
                    <span className="font-medium text-foreground">{new Date(app.end_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">{progressPct}% Completed</span>
                  </div>
                  <Progress value={progressPct} className="h-1.5" />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Your Mentor</h3>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    M
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">Assigned Mentor</h4>
                    <p className="text-xs text-muted-foreground">Domain Expert</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="w-full text-xs">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Message Mentor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardInternship;
