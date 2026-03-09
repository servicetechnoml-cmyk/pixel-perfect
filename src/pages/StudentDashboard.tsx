import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Clock, Send, ExternalLink, AlertTriangle, CalendarDays } from "lucide-react";

type Application = {
  id: string;
  domain_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  domain?: { title: string; duration_months: number };
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
  submitted_at: string | null;
};

type Certificate = {
  id: string;
  domain_name: string;
  student_name: string;
  duration_text: string;
  issue_date: string | null;
};

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const getDaysRemaining = (endDate: string | null): number | null => {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const DeadlineTracker = ({ app, tasks, submissions }: { app: Application; tasks: Task[]; submissions: Submission[] }) => {
  const daysLeft = getDaysRemaining(app.end_date);
  const domainTasks = tasks.filter((t) => t.domain_id === app.domain_id);
  const submittedTaskIds = submissions
    .filter((s) => s.application_id === app.id)
    .map((s) => s.task_id);
  const pendingTasks = domainTasks.filter((t) => !submittedTaskIds.includes(t.id));
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  if (daysLeft === null) return null;

  return (
    <div className={`rounded-lg p-3 text-sm ${isOverdue ? "bg-destructive/10 border border-destructive/30" : isUrgent ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-muted border border-border"}`}>
      <div className="flex items-center gap-2 mb-1">
        {isOverdue ? <AlertTriangle size={14} className="text-destructive" /> : <CalendarDays size={14} className="text-muted-foreground" />}
        <span className={`font-medium ${isOverdue ? "text-destructive" : isUrgent ? "text-yellow-600" : "text-foreground"}`}>
          {isOverdue ? `Overdue by ${Math.abs(daysLeft)} day(s)` : `${daysLeft} day(s) remaining`}
        </span>
      </div>
      {pendingTasks.length > 0 && (
        <p className={`text-xs ${isOverdue ? "text-destructive/80" : "text-muted-foreground"}`}>
          {pendingTasks.length} task(s) not yet submitted
        </p>
      )}
    </div>
  );
};

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [submissionUrls, setSubmissionUrls] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;

    const { data: apps } = await supabase
      .from("internship_applications")
      .select("*")
      .eq("user_id", user.id);

    const domainIds = [...new Set((apps || []).map((a) => a.domain_id))];
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

    const enrichedApps = (apps || []).map((a) => ({ ...a, domain: domainMap[a.domain_id] }));
    setApplications(enrichedApps);

    const approvedDomainIds = enrichedApps.filter((a) => a.status === "approved").map((a) => a.domain_id);
    if (approvedDomainIds.length > 0) {
      const { data: tasksData } = await supabase
        .from("internship_tasks")
        .select("*")
        .in("domain_id", approvedDomainIds)
        .order("week_number");
      setTasks(tasksData || []);
    }

    const appIds = (apps || []).map((a) => a.id);
    if (appIds.length > 0) {
      const { data: subs } = await supabase
        .from("internship_submissions")
        .select("*")
        .in("application_id", appIds);
      setSubmissions(subs || []);
    }

    const { data: certs } = await supabase
      .from("internship_certificates")
      .select("*")
      .eq("user_id", user.id);
    setCertificates(certs || []);

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
      fetchAll();
    }
    setSubmitting(null);
  };

  if (authLoading) return (
    <div className="py-24">
      <div className="container mx-auto px-4 space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-10 w-80 bg-muted rounded animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (<div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />))}
        </div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  const approvedApps = applications.filter((a) => a.status === "approved");

  const getProgress = (app: Application) => {
    const domainTasks = tasks.filter((t) => t.domain_id === app.domain_id);
    if (domainTasks.length === 0) return 0;
    const submittedTaskIds = submissions
      .filter((s) => s.application_id === app.id && s.status === "approved")
      .map((s) => s.task_id);
    const completed = domainTasks.filter((t) => submittedTaskIds.includes(t.id)).length;
    return Math.round((completed / domainTasks.length) * 100);
  };

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Internship Dashboard</h1>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (<div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />))}
          </div>
        ) : (
          <Tabs defaultValue="applications">
            <TabsList className="mb-8">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              {applications.length === 0 ? (
                <p className="text-muted-foreground">You haven't applied to any internship yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {applications.map((app) => (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{app.domain?.title || "Unknown Domain"}</CardTitle>
                          <Badge className={statusColor[app.status] || ""}>{app.status}</Badge>
                        </div>
                        <CardDescription>
                          Duration: {app.domain?.duration_months || "?"} month(s)
                          {app.start_date && ` • Started: ${new Date(app.start_date).toLocaleDateString()}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {app.status === "approved" && (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Progress</span>
                                <span>{getProgress(app)}%</span>
                              </div>
                              <Progress value={getProgress(app)} />
                            </div>
                            <DeadlineTracker app={app} tasks={tasks} submissions={submissions} />
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks">
              {approvedApps.length === 0 ? (
                <p className="text-muted-foreground">No approved internships yet. Tasks will appear after approval.</p>
              ) : (
                approvedApps.map((app) => {
                  const domainTasks = tasks.filter((t) => t.domain_id === app.domain_id);
                  return (
                    <div key={app.id} className="mb-10">
                      <h2 className="text-xl font-semibold text-foreground mb-4">{app.domain?.title}</h2>
                      {domainTasks.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No tasks assigned yet for this domain.</p>
                      ) : (
                        <div className="space-y-4">
                          {domainTasks.map((task) => {
                            const sub = submissions.find(
                              (s) => s.task_id === task.id && s.application_id === app.id
                            );
                            return (
                              <Card key={task.id}>
                                <CardHeader className="pb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                      <Clock size={12} className="mr-1" /> Week {task.week_number}
                                    </Badge>
                                    <CardTitle className="text-base">{task.title}</CardTitle>
                                  </div>
                                  {task.description && (
                                    <CardDescription>{task.description}</CardDescription>
                                  )}
                                </CardHeader>
                                <CardContent>
                                  {sub ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Badge className={statusColor[sub.status] || ""}>{sub.status}</Badge>
                                        <a href={sub.submission_url} target="_blank" rel="noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
                                          <ExternalLink size={12} /> View Submission
                                        </a>
                                      </div>
                                      {sub.feedback && (
                                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                          Feedback: {sub.feedback}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Paste your submission URL..."
                                        value={submissionUrls[task.id] || ""}
                                        onChange={(e) =>
                                          setSubmissionUrls((prev) => ({ ...prev, [task.id]: e.target.value }))
                                        }
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() => handleSubmit(task.id, app.id)}
                                        disabled={submitting === task.id}
                                      >
                                        <Send size={14} className="mr-1" />
                                        {submitting === task.id ? "..." : "Submit"}
                                      </Button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="certificates">
              {certificates.length === 0 ? (
                <p className="text-muted-foreground">No certificates earned yet. Complete all tasks to receive yours!</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Award className="text-primary" size={24} />
                          <CardTitle className="text-lg">{cert.domain_name}</CardTitle>
                        </div>
                        <CardDescription>
                          {cert.student_name} • {cert.duration_text}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-2">
                          Certificate ID: <span className="font-mono text-foreground">{cert.id}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "N/A"}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/verify-certificate?id=${cert.id}`, "_blank")}
                          >
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/certificate/${cert.id}`)}
                          >
                            <Award size={14} className="mr-1" /> View & Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
