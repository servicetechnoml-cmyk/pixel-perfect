import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle2, Clock, Trophy, ArrowRight } from "lucide-react";

type Application = {
  id: string;
  domain_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  domain?: { title: string; duration_months: number };
};

type Task = { id: string; domain_id: string };
type Submission = { id: string; task_id: string; application_id: string; status: string };

const DashboardOverview = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: rawApps } = await supabase
      .from("internship_applications")
      .select("*")
      .eq("user_id", user.id);

    const domainIds = [...new Set((rawApps || []).map((a) => a.domain_id))];
    let domainMap: Record<string, { title: string; duration_months: number }> = {};
    if (domainIds.length > 0) {
      const { data: domains } = await supabase
        .from("internship_domains")
        .select("id, title, duration_months")
        .in("id", domainIds);
      (domains || []).forEach((d) => {
        domainMap[d.id] = { title: d.title, duration_months: d.duration_months };
      });
    }

    const enriched = (rawApps || []).map((a) => ({ ...a, domain: domainMap[a.domain_id] }));
    setApps(enriched);

    const approvedDomainIds = enriched.filter((a) => a.status === "approved").map((a) => a.domain_id);
    if (approvedDomainIds.length > 0) {
      const { data: t } = await supabase.from("internship_tasks").select("id, domain_id").in("domain_id", approvedDomainIds);
      setTasks(t || []);
    }

    const appIds = (rawApps || []).map((a) => a.id);
    if (appIds.length > 0) {
      const { data: s } = await supabase.from("internship_submissions").select("id, task_id, application_id, status").in("application_id", appIds);
      setSubmissions(s || []);
    }

    setLoading(false);
  };

  const activeApp = apps.find((a) => a.status === "approved");
  const totalTasks = activeApp ? tasks.filter((t) => t.domain_id === activeApp.domain_id).length : 0;
  const completedTasks = activeApp
    ? submissions.filter((s) => s.application_id === activeApp.id && s.status === "approved").length
    : 0;
  const pendingTasks = totalTasks - completedTasks;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  const stats = [
    {
      title: "Internship Status",
      value: activeApp ? "Active" : apps.length > 0 ? "Pending" : "None",
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary",
      trend: activeApp ? activeApp.domain?.title || "" : "Apply now",
    },
    {
      title: "Tasks Completed",
      value: totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "—",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      trend: totalTasks > 0 ? `${progressPct}% done` : "No tasks yet",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks > 0 ? String(pendingTasks) : "0",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      trend: pendingTasks > 0 ? "Keep going!" : "All caught up",
    },
    {
      title: "Overall Progress",
      value: `${progressPct}%`,
      icon: Trophy,
      color: "text-accent",
      bg: "bg-accent",
      trend: progressPct >= 80 ? "Almost there!" : progressPct > 0 ? "Keep it up!" : "Get started",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card rounded-xl animate-pulse border border-border/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {displayName}! Here's your internship progress.</p>
        </div>
        <Button className="rounded-xl shadow-sm" asChild>
          <Link to="/dashboard/tasks">
            View Active Tasks <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl bg-card border border-border/50 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Active Tasks + Current Internship */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3 border-b border-border/40">
            <div>
              <h2 className="text-base font-bold text-foreground">Active Tasks</h2>
              <p className="text-xs text-muted-foreground">Your current ongoing internship tasks</p>
            </div>
            <Link to="/dashboard/tasks" className="text-xs text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {totalTasks === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[1px] rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-3 px-4 text-center">Start your journey to unlock tasks</p>
                  <Button size="sm" className="rounded-lg shadow-sm" asChild>
                    <Link to="/internships">Apply for Internship</Link>
                  </Button>
                </div>
                <div className="opacity-40 pointer-events-none space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                        <span className="text-sm font-medium text-foreground">Sample Task {i}</span>
                      </div>
                      <Badge variant="secondary" className="text-[11px]">Pending</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              tasks.slice(0, 3).map((task, i) => {
                const sub = submissions.find((s) => s.task_id === task.id);
                const status = sub ? (sub.status === "approved" ? "Done" : "Submitted") : "Pending";
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${status === "Done" ? "bg-emerald-500" : status === "Submitted" ? "bg-primary animate-pulse" : "bg-orange-400"}`} />
                      <span className="text-sm font-medium text-foreground">Task {i + 1}</span>
                    </div>
                    <Badge variant="secondary" className="text-[11px]">{status}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Current Internship Card */}
        <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent border border-primary/10 shadow-sm">
          <div className="p-5 pb-3 border-b border-primary/10">
            <h2 className="text-base font-bold text-foreground">Current Internship</h2>
            <p className="text-xs text-muted-foreground">{activeApp?.domain?.title || "No active internship"}</p>
          </div>
          <div className="p-5 space-y-5">
            {activeApp ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Completion</span>
                    <span className="text-xs font-bold text-primary">{progressPct}%</span>
                  </div>
                  <Progress value={progressPct} className="h-1.5" />
                </div>
                <div className="space-y-2.5 pt-3 border-t border-primary/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{activeApp.domain?.duration_months || "?"} month(s)</span>
                  </div>
                  {activeApp.start_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-medium text-foreground">{new Date(activeApp.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {activeApp.end_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Date</span>
                      <span className="font-medium text-foreground">{new Date(activeApp.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full rounded-lg" asChild>
                  <Link to="/dashboard/internship">Go to Internship</Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-sm text-muted-foreground mb-4">No active internship yet</p>
                <Button variant="outline" className="rounded-lg" asChild>
                  <Link to="/internships">Browse Internships</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
