import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CheckSquare, Clock, Send, ExternalLink } from "lucide-react";

type Application = {
  id: string;
  domain_id: string;
  status: string;
  domain?: { title: string };
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  week_number: number;
  domain_id: string;
};

type Submission = {
  id: string;
  task_id: string;
  application_id: string;
  submission_url: string;
  status: string;
  feedback: string | null;
};

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const DashboardTasks = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionUrls, setSubmissionUrls] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const { data: rawApps } = await supabase
      .from("internship_applications")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "approved");

    const domainIds = [...new Set((rawApps || []).map((a) => a.domain_id))];
    let domainMap: Record<string, { title: string }> = {};
    if (domainIds.length > 0) {
      const { data: domains } = await supabase
        .from("internship_domains")
        .select("id, title")
        .in("id", domainIds);
      (domains || []).forEach((d) => {
        domainMap[d.id] = { title: d.title };
      });

      const { data: t } = await supabase
        .from("internship_tasks")
        .select("*")
        .in("domain_id", domainIds)
        .order("week_number");
      setTasks(t || []);
    }

    const enriched = (rawApps || []).map((a) => ({ ...a, domain: domainMap[a.domain_id] }));
    setApps(enriched);

    const appIds = (rawApps || []).map((a) => a.id);
    if (appIds.length > 0) {
      const { data: subs } = await supabase
        .from("internship_submissions")
        .select("*")
        .in("application_id", appIds);
      setSubmissions(subs || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (taskId: string, applicationId: string) => {
    const url = submissionUrls[taskId];
    if (!url) {
      toast({ title: "Enter a submission URL", variant: "destructive" });
      return;
    }
    setSubmitting(taskId);
    const { error } = await supabase.from("internship_submissions").insert({
      task_id: taskId,
      application_id: applicationId,
      submission_url: url,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Submitted!", description: "Your task submission is under review." });
      setSubmissionUrls((prev) => ({ ...prev, [taskId]: "" }));
      fetchData();
    }
    setSubmitting(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Tasks</h1>
        <p className="text-muted-foreground text-sm">Manage your assigned work and project deliverables.</p>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Tasks Yet</h3>
          <p className="text-sm text-muted-foreground">Tasks will appear once your internship application is approved.</p>
        </div>
      ) : (
        apps.map((app) => {
          const domainTasks = tasks.filter((t) => t.domain_id === app.domain_id);
          return (
            <div key={app.id}>
              <h2 className="text-base font-semibold text-foreground mb-3">{app.domain?.title}</h2>
              {domainTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks assigned yet for this domain.</p>
              ) : (
                <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden divide-y divide-border/40">
                  {domainTasks.map((task) => {
                    const sub = submissions.find((s) => s.task_id === task.id && s.application_id === app.id);
                    const isDone = sub?.status === "approved";
                    return (
                      <div key={task.id} className="p-5 hover:bg-muted/20 transition-colors">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                          <div className="flex gap-3 items-start">
                            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center border-2 shrink-0 ${
                              isDone
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : sub
                                ? "border-primary text-primary"
                                : "border-muted-foreground/30"
                            }`}>
                              {isDone && <CheckSquare className="h-2.5 w-2.5" />}
                              {sub && !isDone && <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />}
                            </div>
                            <div>
                              <h3 className={`text-sm font-bold mb-0.5 ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-xs text-muted-foreground max-w-lg">{task.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-8 md:ml-0">
                            <Badge variant="outline" className="text-[10px]">
                              <Clock className="h-2.5 w-2.5 mr-1" /> Week {task.week_number}
                            </Badge>
                            {sub ? (
                              <div className="flex items-center gap-2">
                                <Badge className={statusBadge[sub.status] || ""} >{sub.status}</Badge>
                                <a href={sub.submission_url} target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                                  <ExternalLink className="h-3 w-3" /> View
                                </a>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Submission URL..."
                                  value={submissionUrls[task.id] || ""}
                                  onChange={(e) => setSubmissionUrls((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                  className="h-8 text-xs w-48"
                                />
                                <Button
                                  size="sm"
                                  className="h-8 text-xs rounded-lg"
                                  onClick={() => handleSubmit(task.id, app.id)}
                                  disabled={submitting === task.id}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  {submitting === task.id ? "..." : "Submit"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        {sub?.feedback && (
                          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg mt-3 ml-8">
                            Feedback: {sub.feedback}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DashboardTasks;
