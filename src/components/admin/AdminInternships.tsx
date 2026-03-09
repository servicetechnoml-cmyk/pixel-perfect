import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Check, X, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Domain = {
  id: string; title: string; description: string | null;
  duration_months: number; is_active: boolean | null;
};
type Task = {
  id: string; title: string; description: string | null;
  week_number: number; domain_id: string;
};
type Application = {
  id: string; user_id: string; domain_id: string; status: string;
  start_date: string | null; end_date: string | null; created_at: string | null;
  profile?: { full_name: string | null; email: string | null };
  domain?: { title: string; duration_months: number };
};
type Submission = {
  id: string; task_id: string; application_id: string;
  submission_url: string; status: string; feedback: string | null;
  task?: { title: string; week_number: number };
};

const AdminInternships = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [newDomain, setNewDomain] = useState({ title: "", description: "", duration_months: 1 });
  const [newTask, setNewTask] = useState({ title: "", description: "", week_number: 1, domain_id: "" });
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [{ data: d }, { data: t }, { data: a }, { data: s }] = await Promise.all([
      supabase.from("internship_domains").select("*").order("created_at", { ascending: false }),
      supabase.from("internship_tasks").select("*").order("week_number"),
      supabase.from("internship_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("internship_submissions").select("*"),
    ]);
    setDomains(d || []);
    setTasks(t || []);

    // Enrich applications with profile + domain
    const apps = a || [];
    const userIds = [...new Set(apps.map((x) => x.user_id))];
    const domainIds = [...new Set(apps.map((x) => x.domain_id))];

    let profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      (profiles || []).forEach((p) => { profileMap[p.user_id] = { full_name: p.full_name, email: p.email }; });
    }
    let domainMap: Record<string, { title: string; duration_months: number }> = {};
    if (domainIds.length > 0) {
      const domainData = (d || []).filter((x) => domainIds.includes(x.id));
      domainData.forEach((x) => { domainMap[x.id] = { title: x.title, duration_months: x.duration_months }; });
    }

    setApplications(apps.map((x) => ({ ...x, profile: profileMap[x.user_id], domain: domainMap[x.domain_id] })));

    // Enrich submissions with task info
    const taskMap: Record<string, { title: string; week_number: number }> = {};
    (t || []).forEach((tk) => { taskMap[tk.id] = { title: tk.title, week_number: tk.week_number }; });
    setSubmissions((s || []).map((sub) => ({ ...sub, task: taskMap[sub.task_id] })));
  };

  const createDomain = async () => {
    if (!newDomain.title) return;
    const { error } = await supabase.from("internship_domains").insert({
      title: newDomain.title,
      description: newDomain.description || null,
      duration_months: newDomain.duration_months,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Domain created" }); setNewDomain({ title: "", description: "", duration_months: 1 }); setDomainDialogOpen(false); fetchAll(); }
  };

  const deleteDomain = async (id: string) => {
    const { error } = await supabase.from("internship_domains").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.domain_id) return;
    const { error } = await supabase.from("internship_tasks").insert({
      title: newTask.title,
      description: newTask.description || null,
      week_number: newTask.week_number,
      domain_id: newTask.domain_id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Task created" }); setNewTask({ title: "", description: "", week_number: 1, domain_id: "" }); setTaskDialogOpen(false); fetchAll(); }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("internship_tasks").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const updateAppStatus = async (id: string, status: string) => {
    const app = applications.find((a) => a.id === id);
    const updates: Record<string, unknown> = { status };
    if (status === "approved" && app) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (app.domain?.duration_months || 1));
      updates.start_date = startDate.toISOString().split("T")[0];
      updates.end_date = endDate.toISOString().split("T")[0];
    }
    const { error } = await supabase.from("internship_applications").update(updates).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Application ${status}` }); fetchAll(); }
  };

  const updateSubmission = async (id: string, status: string) => {
    const feedback = feedbackMap[id] || null;
    const { error } = await supabase.from("internship_submissions").update({ status, feedback }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Submission ${status}` }); fetchAll(); }
  };

  const generateCertificate = async (app: Application) => {
    const profile = app.profile;
    const domain = app.domain;
    if (!profile || !domain) return;
    const { error } = await supabase.from("internship_certificates").insert({
      application_id: app.id,
      user_id: app.user_id,
      student_name: profile.full_name || profile.email || "Student",
      domain_name: domain.title,
      duration_text: `${domain.duration_months} month(s)`,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      await supabase.from("internship_applications").update({ status: "completed" }).eq("id", app.id);
      toast({ title: "Certificate generated!" });
      fetchAll();
    }
  };

  return (
    <Tabs defaultValue="domains">
      <TabsList className="mb-6">
        <TabsTrigger value="domains">Domains</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="submissions">Submissions</TabsTrigger>
      </TabsList>

      {/* DOMAINS */}
      <TabsContent value="domains">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Internship Domains</h2>
          <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus size={14} className="mr-1" /> Add Domain</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Domain</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={newDomain.title} onChange={(e) => setNewDomain({ ...newDomain, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={newDomain.description} onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })} /></div>
                <div><Label>Duration (months)</Label><Input type="number" min={1} value={newDomain.duration_months} onChange={(e) => setNewDomain({ ...newDomain, duration_months: parseInt(e.target.value) || 1 })} /></div>
                <Button onClick={createDomain} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {domains.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-foreground">{d.title}</p>
                  <p className="text-sm text-muted-foreground">{d.duration_months} month(s) • {d.description || "No description"}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteDomain(d.id)}><Trash2 size={16} className="text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
          {domains.length === 0 && <p className="text-muted-foreground text-sm">No domains created yet.</p>}
        </div>
      </TabsContent>

      {/* TASKS */}
      <TabsContent value="tasks">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Weekly Tasks</h2>
          <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus size={14} className="mr-1" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Domain</Label>
                  <Select value={newTask.domain_id} onValueChange={(v) => setNewTask({ ...newTask, domain_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>{domains.map((d) => (<SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div><Label>Title</Label><Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} /></div>
                <div><Label>Week Number</Label><Input type="number" min={1} value={newTask.week_number} onChange={(e) => setNewTask({ ...newTask, week_number: parseInt(e.target.value) || 1 })} /></div>
                <Button onClick={createTask} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {domains.map((d) => {
            const domainTasks = tasks.filter((t) => t.domain_id === d.id);
            if (domainTasks.length === 0) return null;
            return (
              <div key={d.id}>
                <h3 className="font-medium text-foreground mb-2">{d.title}</h3>
                {domainTasks.map((t) => (
                  <Card key={t.id} className="mb-2">
                    <CardContent className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Week {t.week_number}: {t.title}</p>
                        {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(t.id)}><Trash2 size={14} className="text-destructive" /></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      </TabsContent>

      {/* APPLICATIONS */}
      <TabsContent value="applications">
        <h2 className="text-lg font-semibold text-foreground mb-4">Student Applications</h2>
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-foreground">{app.profile?.full_name || app.profile?.email || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">{app.domain?.title || "Unknown domain"} • Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>
                    {app.status}
                  </Badge>
                  {app.status === "pending" && (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => updateAppStatus(app.id, "approved")}><Check size={16} className="text-green-600" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => updateAppStatus(app.id, "rejected")}><X size={16} className="text-red-600" /></Button>
                    </>
                  )}
                  {app.status === "approved" && (
                    <Button size="sm" variant="outline" onClick={() => generateCertificate(app)} className="gap-1">
                      <Award size={14} /> Certificate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {applications.length === 0 && <p className="text-muted-foreground text-sm">No applications yet.</p>}
        </div>
      </TabsContent>

      {/* SUBMISSIONS */}
      <TabsContent value="submissions">
        <h2 className="text-lg font-semibold text-foreground mb-4">Task Submissions</h2>
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{sub.task?.title || "Unknown task"} (Week {sub.task?.week_number})</p>
                    <a href={sub.submission_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">{sub.submission_url}</a>
                  </div>
                  <Badge variant={sub.status === "approved" ? "default" : sub.status === "rejected" ? "destructive" : "secondary"}>
                    {sub.status}
                  </Badge>
                </div>
                {sub.status === "pending" && (
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Feedback (optional)"
                      value={feedbackMap[sub.id] || ""}
                      onChange={(e) => setFeedbackMap((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                      className="flex-1"
                    />
                    <Button size="sm" variant="default" onClick={() => updateSubmission(sub.id, "approved")}><Check size={14} /></Button>
                    <Button size="sm" variant="destructive" onClick={() => updateSubmission(sub.id, "rejected")}><X size={14} /></Button>
                  </div>
                )}
                {sub.feedback && <p className="text-sm text-muted-foreground bg-muted p-2 rounded">Feedback: {sub.feedback}</p>}
              </CardContent>
            </Card>
          ))}
          {submissions.length === 0 && <p className="text-muted-foreground text-sm">No submissions yet.</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminInternships;
