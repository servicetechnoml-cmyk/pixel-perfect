import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target } from "lucide-react";

type Application = {
  id: string;
  domain_id: string;
  status: string;
  start_date: string | null;
  domain?: { title: string };
};

type Task = { id: string; title: string; domain_id: string; week_number: number };
type Submission = { id: string; task_id: string; application_id: string; status: string; submitted_at: string | null };

const DashboardProgress = () => {
  const { user } = useAuth();
  const [app, setApp] = useState<Application | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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
      const { data: domain } = await supabase.from("internship_domains").select("title").eq("id", a.domain_id).single();
      setApp({ ...a, domain: domain || undefined });

      const { data: t } = await supabase.from("internship_tasks").select("*").eq("domain_id", a.domain_id).order("week_number");
      setTasks(t || []);

      const { data: s } = await supabase.from("internship_submissions").select("*").eq("application_id", a.id);
      setSubmissions(s || []);
    }
    setLoading(false);
  };

  const completedTasks = tasks.filter((t) =>
    submissions.some((s) => s.task_id === t.id && s.status === "approved")
  );
  const progressPct = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-96 bg-card rounded-xl animate-pulse border border-border/50" />
      </div>
    );
  }

  // Build milestones from real task data
  const milestones = tasks.map((task) => {
    const sub = submissions.find((s) => s.task_id === task.id);
    const done = sub?.status === "approved";
    const submitted = !!sub;
    return {
      title: task.title,
      desc: submitted ? (done ? "Completed and approved." : "Submitted — awaiting review.") : "Not yet submitted.",
      date: sub?.submitted_at ? new Date(sub.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `Week ${task.week_number}`,
      done,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Overall Progress</h1>
        <p className="text-muted-foreground text-sm">Track your journey, milestones, and achievements.</p>
      </div>

      {!app ? (
        <div className="rounded-xl bg-card border border-border/50 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Progress to Show</h3>
          <p className="text-sm text-muted-foreground">Complete tasks in your internship to see your progress here.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">{app.domain?.title}</h2>
              <p className="text-sm text-muted-foreground">
                {progressPct >= 100 ? "🎉 All tasks completed!" : progressPct >= 50 ? "You're doing great! Keep up the momentum." : "Keep going — every step counts!"}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center h-20 w-20 rounded-full border-[3px] border-primary bg-primary/5 text-primary shrink-0">
              <span className="text-xl font-bold">{progressPct}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{completedTasks.length} of {tasks.length} tasks completed</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          {/* Timeline */}
          {milestones.length > 0 && (
            <div className="relative pt-4 pb-8">
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

              {milestones.map((milestone, i) => (
                <div key={i} className="relative flex items-start gap-4 mt-6 first:mt-0">
                  <div className={`absolute left-5 md:left-1/2 w-7 h-7 rounded-full border-[3px] flex items-center justify-center -translate-x-1/2 bg-card z-10 shrink-0 ${
                    milestone.done ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground/30"
                  }`}>
                    {milestone.done ? <Trophy className="h-3 w-3" /> : <Target className="h-3 w-3" />}
                  </div>

                  <div className="w-full pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-6">
                    <div className={`${i % 2 === 0 ? "md:text-right md:pr-10" : "md:col-start-2 md:pl-10"}`}>
                      <div className={`rounded-lg p-4 ${milestone.done ? "bg-primary/5 border border-primary/10" : "bg-muted/30 border border-border/40"}`}>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">{milestone.date}</span>
                        <h4 className={`text-sm font-bold mb-0.5 ${milestone.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{milestone.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardProgress;
