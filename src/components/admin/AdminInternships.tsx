import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Check, X, Award, Search, Clock, BookOpen,
  Users, FileText, GraduationCap, ExternalLink, ChevronDown,
  ToggleLeft, ToggleRight, Loader2, Filter, Pencil
} from "lucide-react";
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
  appProfile?: { full_name: string | null; email: string | null };
};
type Certificate = {
  id: string; student_name: string; domain_name: string;
  duration_text: string; issue_date: string | null;
};
type Assessment = {
  id: string; domain_id: string; title: string; type: string;
  duration_minutes: number; questions_count: number; is_active: boolean;
};
type Question = {
  id: string; assessment_id: string; question_text: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  correct_option: string; order_number: number;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

const AdminInternships = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newDomain, setNewDomain] = useState({ title: "", description: "", duration_months: 1 });
  const [newTask, setNewTask] = useState({ title: "", description: "", week_number: 1, domain_id: "" });
  const [newAssessment, setNewAssessment] = useState({ title: "", type: "Multiple Choice", duration_minutes: 60, questions_count: 10, domain_id: "" });
  const [newQuestion, setNewQuestion] = useState({ assessment_id: "", question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "a" });
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [questionsDialogOpen, setQuestionsDialogOpen] = useState<string | null>(null);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [dataLoading, setDataLoading] = useState(true);

  // Edit task
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTaskForm, setEditTaskForm] = useState({ title: "", description: "", week_number: 1, domain_id: "" });
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);

  // Application filters
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [appSort, setAppSort] = useState("date_desc");

  // Submission filter
  const [subStatusFilter, setSubStatusFilter] = useState("all");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setDataLoading(true);
    const [{ data: d }, { data: t }, { data: a }, { data: s }, { data: c }, { data: ass }, { data: qs }] = await Promise.all([
      supabase.from("internship_domains").select("*").order("created_at", { ascending: false }),
      supabase.from("internship_tasks").select("*").order("week_number"),
      supabase.from("internship_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("internship_submissions").select("*"),
      supabase.from("internship_certificates").select("*").order("issue_date", { ascending: false }),
      supabase.from("internship_assessments").select("*").order("created_at", { ascending: false }),
      supabase.from("assessment_questions").select("*").order("order_number"),
    ]);
    setDomains(d || []);
    setTasks(t || []);
    setCertificates(c || []);
    setAssessments(ass || []);
    setQuestions(qs || []);

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

    const enrichedApps = apps.map((x) => ({ ...x, profile: profileMap[x.user_id], domain: domainMap[x.domain_id] }));
    setApplications(enrichedApps);

    // Build app->profile map for submissions
    const appProfileMap: Record<string, { full_name: string | null; email: string | null }> = {};
    enrichedApps.forEach((ea) => { appProfileMap[ea.id] = ea.profile || { full_name: null, email: null }; });

    const taskMap: Record<string, { title: string; week_number: number }> = {};
    (t || []).forEach((tk) => { taskMap[tk.id] = { title: tk.title, week_number: tk.week_number }; });
    setSubmissions((s || []).map((sub) => ({ ...sub, task: taskMap[sub.task_id], appProfile: appProfileMap[sub.application_id] })));
    setDataLoading(false);
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

  const toggleDomainActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("internship_domains").update({ is_active: active }).eq("id", id);
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

  const createAssessment = async () => {
    if (!newAssessment.title || !newAssessment.domain_id) return;
    const { error } = await supabase.from("internship_assessments").insert({
      title: newAssessment.title,
      type: newAssessment.type,
      duration_minutes: newAssessment.duration_minutes,
      questions_count: newAssessment.questions_count,
      domain_id: newAssessment.domain_id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Assessment created" }); setNewAssessment({ title: "", type: "Multiple Choice", duration_minutes: 60, questions_count: 10, domain_id: "" }); setAssessmentDialogOpen(false); fetchAll(); }
  };

  const deleteAssessment = async (id: string) => {
    const { error } = await supabase.from("internship_assessments").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const toggleAssessmentActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("internship_assessments").update({ is_active: active }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const createQuestion = async () => {
    if (!newQuestion.assessment_id || !newQuestion.question_text || !newQuestion.option_a || !newQuestion.option_b || !newQuestion.option_c || !newQuestion.option_d) return;
    const assessmentQs = questions.filter(q => q.assessment_id === newQuestion.assessment_id);
    const { error } = await supabase.from("assessment_questions").insert({
      assessment_id: newQuestion.assessment_id,
      question_text: newQuestion.question_text,
      option_a: newQuestion.option_a,
      option_b: newQuestion.option_b,
      option_c: newQuestion.option_c,
      option_d: newQuestion.option_d,
      correct_option: newQuestion.correct_option,
      order_number: assessmentQs.length + 1,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Question added" });
      setNewQuestion({ assessment_id: newQuestion.assessment_id, question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "a" });
      setAddQuestionOpen(false);
      fetchAll();
    }
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from("assessment_questions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const openEditTask = (t: Task) => {
    setEditTask(t);
    setEditTaskForm({ title: t.title, description: t.description || "", week_number: t.week_number, domain_id: t.domain_id });
    setEditTaskDialogOpen(true);
  };

  const updateTask = async () => {
    if (!editTask || !editTaskForm.title || !editTaskForm.domain_id) return;
    const { error } = await supabase.from("internship_tasks").update({
      title: editTaskForm.title,
      description: editTaskForm.description || null,
      week_number: editTaskForm.week_number,
      domain_id: editTaskForm.domain_id,
    }).eq("id", editTask.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Task updated" });
      setEditTaskDialogOpen(false);
      setEditTask(null);
      fetchAll();
    }
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

  const filteredApps = applications
    .filter((a) => {
      const q = appSearch.toLowerCase();
      const matchSearch =
        !q ||
        (a.profile?.full_name || "").toLowerCase().includes(q) ||
        (a.profile?.email || "").toLowerCase().includes(q);
      const matchStatus = appStatusFilter === "all" || a.status === appStatusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (appSort === "date_desc") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      if (appSort === "date_asc") return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      const nameA = a.profile?.full_name || a.profile?.email || "";
      const nameB = b.profile?.full_name || b.profile?.email || "";
      if (appSort === "name_asc") return nameA.localeCompare(nameB);
      if (appSort === "name_desc") return nameB.localeCompare(nameA);
      const roleA = a.domain?.title || "";
      const roleB = b.domain?.title || "";
      if (appSort === "role_asc") return roleA.localeCompare(roleB);
      if (appSort === "role_desc") return roleB.localeCompare(roleA);
      return 0;
    });

  const filteredSubs = submissions.filter(
    (s) => subStatusFilter === "all" || s.status === subStatusFilter
  );

  // Stats
  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const approvedApps = applications.filter((a) => a.status === "approved").length;
  const completedApps = applications.filter((a) => a.status === "completed").length;
  const pendingSubs = submissions.filter((s) => s.status === "pending").length;

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading internship data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Internship Management</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage domains, tasks, student applications, submissions, and certificates.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Domains", value: domains.length, icon: BookOpen, bg: "bg-muted/40 text-foreground" },
          { label: "Pending Apps", value: pendingApps, icon: Clock, bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
          { label: "Active Interns", value: approvedApps, icon: Users, bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
          { label: "Pending Reviews", value: pendingSubs, icon: FileText, bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" },
          { label: "Certificates", value: certificates.length, icon: GraduationCap, bg: "bg-primary/10 text-primary border border-primary/20" },
        ].map((c, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-sm ${c.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <c.icon size={14} className="opacity-70" />
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{c.label}</p>
            </div>
            <p className="text-2xl font-extrabold font-display">{c.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="domains">
        <TabsList className="mb-6 flex-wrap bg-muted/40 p-1 rounded-xl">
          <TabsTrigger value="domains" className="gap-1.5 text-xs"><BookOpen size={13} /> Domains</TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5 text-xs"><FileText size={13} /> Tasks</TabsTrigger>
          <TabsTrigger value="assessments" className="gap-1.5 text-xs"><FileText size={13} /> Assessments</TabsTrigger>
          <TabsTrigger value="applications" className="gap-1.5 text-xs">
            <Users size={13} /> Applications
            {pendingApps > 0 && <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingApps}</span>}
          </TabsTrigger>
          <TabsTrigger value="submissions" className="gap-1.5 text-xs">
            <FileText size={13} /> Submissions
            {pendingSubs > 0 && <span className="ml-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingSubs}</span>}
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-1.5 text-xs"><GraduationCap size={13} /> Certificates</TabsTrigger>
        </TabsList>

        {/* ─── DOMAINS ─── */}
        <TabsContent value="domains">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Internship Domains</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{domains.length} domain(s) configured</p>
            </div>
            <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus size={14} /> Add Domain</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create New Domain</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Title *</Label><Input value={newDomain.title} onChange={(e) => setNewDomain({ ...newDomain, title: e.target.value })} placeholder="e.g. Web Development" /></div>
                  <div><Label>Description</Label><Textarea value={newDomain.description} onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })} placeholder="Brief description of the internship..." rows={3} /></div>
                  <div><Label>Duration (months)</Label><Input type="number" min={1} value={newDomain.duration_months} onChange={(e) => setNewDomain({ ...newDomain, duration_months: parseInt(e.target.value) || 1 })} /></div>
                  <Button onClick={createDomain} className="w-full">Create Domain</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                    <th className="text-left py-3 px-4">Domain</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Description</th>
                    <th className="text-center py-3 px-4">Duration</th>
                    <th className="text-center py-3 px-4">Tasks</th>
                    <th className="text-center py-3 px-4">Students</th>
                    <th className="text-center py-3 px-4">Active</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {domains.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-muted-foreground italic text-sm">No domains created yet. Click "Add Domain" to get started.</td></tr>
                  ) : domains.map((d) => {
                    const taskCount = tasks.filter((t) => t.domain_id === d.id).length;
                    const studentCount = applications.filter((a) => a.domain_id === d.id).length;
                    return (
                      <tr key={d.id} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                              <BookOpen size={14} className="text-primary" />
                            </div>
                            <span className="font-semibold text-foreground text-xs">{d.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <p className="text-xs text-muted-foreground line-clamp-2 max-w-[250px]">{d.description || "—"}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="text-[10px] gap-1"><Clock size={10} /> {d.duration_months}mo</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-xs font-bold text-foreground">{taskCount}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-xs font-bold text-foreground">{studentCount}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => toggleDomainActive(d.id, !d.is_active)} className="transition-colors">
                            {d.is_active ? (
                              <ToggleRight size={22} className="text-emerald-500" />
                            ) : (
                              <ToggleLeft size={22} className="text-muted-foreground" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteDomain(d.id)} className="h-7 w-7">
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ─── TASKS ─── */}
        <TabsContent value="tasks">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Weekly Tasks</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{tasks.length} task(s) across {domains.length} domain(s)</p>
            </div>
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus size={14} /> Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Weekly Task</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Domain *</Label>
                    <Select value={newTask.domain_id} onValueChange={(v) => setNewTask({ ...newTask, domain_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                      <SelectContent>{domains.map((d) => (<SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Task Title *</Label><Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Build a landing page" /></div>
                  <div><Label>Description</Label><Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Detailed instructions..." rows={3} /></div>
                  <div><Label>Week Number</Label><Input type="number" min={1} value={newTask.week_number} onChange={(e) => setNewTask({ ...newTask, week_number: parseInt(e.target.value) || 1 })} /></div>
                  <Button onClick={createTask} className="w-full">Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {domains.map((d) => {
              const domainTasks = tasks.filter((t) => t.domain_id === d.id);
              return (
                <div key={d.id} className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center gap-2">
                    <BookOpen size={14} className="text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">{d.title}</h3>
                    <Badge variant="outline" className="ml-auto text-[10px]">{domainTasks.length} task(s)</Badge>
                  </div>
                  {domainTasks.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-sm italic">No tasks assigned yet.</div>
                  ) : (
                    <div className="divide-y divide-border/30">
                      {domainTasks.map((t) => (
                        <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-primary">W{t.week_number}</span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{t.title}</p>
                              {t.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 max-w-[350px]">{t.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => openEditTask(t)} className="h-7 w-7" title="Edit task">
                              <Pencil size={13} className="text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteTask(t.id)} className="h-7 w-7" title="Delete task">
                              <Trash2 size={13} className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Edit Task Dialog */}
          <Dialog open={editTaskDialogOpen} onOpenChange={(open) => { setEditTaskDialogOpen(open); if (!open) setEditTask(null); }}>
            <DialogContent>
              <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Domain *</Label>
                  <Select value={editTaskForm.domain_id} onValueChange={(v) => setEditTaskForm({ ...editTaskForm, domain_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                    <SelectContent>{domains.map((d) => (<SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div><Label>Task Title *</Label><Input value={editTaskForm.title} onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={editTaskForm.description} onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })} rows={3} /></div>
                <div><Label>Week Number</Label><Input type="number" min={1} value={editTaskForm.week_number} onChange={(e) => setEditTaskForm({ ...editTaskForm, week_number: parseInt(e.target.value) || 1 })} /></div>
                <Button onClick={updateTask} className="w-full">Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ─── ASSESSMENTS ─── */}
        <TabsContent value="assessments">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Assessments</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{assessments.length} assessment(s) configured</p>
            </div>
            <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5"><Plus size={14} /> Add Assessment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Assessment</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Domain *</Label>
                    <Select value={newAssessment.domain_id} onValueChange={(v) => setNewAssessment({ ...newAssessment, domain_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select domain" /></SelectTrigger>
                      <SelectContent>{domains.map((d) => (<SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Assessment Title *</Label><Input value={newAssessment.title} onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })} placeholder="e.g. Core Fundamentals MCQ" /></div>
                  <div>
                    <Label>Type *</Label>
                    <Select value={newAssessment.type} onValueChange={(v) => setNewAssessment({ ...newAssessment, type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                        <SelectItem value="Coding Task">Coding Task</SelectItem>
                        <SelectItem value="Project Review">Project Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1"><Label>Duration (mins)</Label><Input type="number" min={5} value={newAssessment.duration_minutes} onChange={(e) => setNewAssessment({ ...newAssessment, duration_minutes: parseInt(e.target.value) || 60 })} /></div>
                    <div className="flex-1"><Label>Questions</Label><Input type="number" min={1} value={newAssessment.questions_count} onChange={(e) => setNewAssessment({ ...newAssessment, questions_count: parseInt(e.target.value) || 10 })} /></div>
                  </div>
                  <Button onClick={createAssessment} className="w-full">Create Assessment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {domains.map((d) => {
              const domainAssessments = assessments.filter((a) => a.domain_id === d.id);
              if (domainAssessments.length === 0) return null;
              return (
                <div key={d.id} className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-muted/20 border-b border-border/40 flex items-center gap-2">
                    <BookOpen size={14} className="text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">{d.title}</h3>
                    <Badge variant="outline" className="ml-auto text-[10px]">{domainAssessments.length} assessment(s)</Badge>
                  </div>
                  <div className="divide-y divide-border/30">
                    {domainAssessments.map((a) => {
                      const aQuestions = questions.filter(q => q.assessment_id === a.id);
                      const isExpanded = questionsDialogOpen === a.id;
                      return (
                      <div key={a.id} className="border-b border-border/20 last:border-b-0">
                        <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{a.title}</p>
                              <div className="flex gap-3 text-[10px] text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><FileText size={10}/> {a.type}</span>
                                <span className="flex items-center gap-1"><Clock size={10}/> {a.duration_minutes} mins</span>
                                <span>{aQuestions.length} Qs added</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => { setQuestionsDialogOpen(isExpanded ? null : a.id); setNewQuestion({ ...newQuestion, assessment_id: a.id }); setAddQuestionOpen(false); }}>
                              <FileText size={12} /> {isExpanded ? "Hide" : "Questions"}
                            </Button>
                            <button onClick={() => toggleAssessmentActive(a.id, !a.is_active)} className="transition-colors">
                              {a.is_active ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} className="text-muted-foreground" />}
                            </button>
                            <Button variant="ghost" size="icon" onClick={() => deleteAssessment(a.id)} className="h-7 w-7">
                              <Trash2 size={13} className="text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Questions Panel */}
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-muted/5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">MCQ Questions ({aQuestions.length})</h4>
                              <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => setAddQuestionOpen(!addQuestionOpen)}>
                                <Plus size={12} /> Add Question
                              </Button>
                            </div>

                            {/* Add Question Form */}
                            {addQuestionOpen && (
                              <div className="rounded-lg border border-primary/20 bg-card p-4 mb-4 space-y-3">
                                <div><Label className="text-xs">Question *</Label><Textarea value={newQuestion.question_text} onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} placeholder="Enter the question..." className="text-sm mt-1" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div><Label className="text-xs">Option A *</Label><Input value={newQuestion.option_a} onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })} className="text-sm mt-1" /></div>
                                  <div><Label className="text-xs">Option B *</Label><Input value={newQuestion.option_b} onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })} className="text-sm mt-1" /></div>
                                  <div><Label className="text-xs">Option C *</Label><Input value={newQuestion.option_c} onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })} className="text-sm mt-1" /></div>
                                  <div><Label className="text-xs">Option D *</Label><Input value={newQuestion.option_d} onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })} className="text-sm mt-1" /></div>
                                </div>
                                <div>
                                  <Label className="text-xs">Correct Answer *</Label>
                                  <Select value={newQuestion.correct_option} onValueChange={(v) => setNewQuestion({ ...newQuestion, correct_option: v })}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="a">A</SelectItem>
                                      <SelectItem value="b">B</SelectItem>
                                      <SelectItem value="c">C</SelectItem>
                                      <SelectItem value="d">D</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={createQuestion} className="text-xs">Save Question</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setAddQuestionOpen(false)} className="text-xs">Cancel</Button>
                                </div>
                              </div>
                            )}

                            {/* Questions List */}
                            {aQuestions.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic">No questions added yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {aQuestions.map((q, qi) => (
                                  <div key={q.id} className="rounded-lg border border-border/40 bg-card p-3">
                                    <div className="flex justify-between items-start">
                                      <p className="text-sm font-medium text-foreground"><span className="text-primary font-bold mr-1.5">Q{qi + 1}.</span>{q.question_text}</p>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => deleteQuestion(q.id)}><Trash2 size={12} className="text-destructive" /></Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                                      {["a", "b", "c", "d"].map((opt) => (
                                        <div key={opt} className={`text-xs px-2 py-1.5 rounded-md border ${q.correct_option === opt ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 font-semibold" : "bg-muted/30 border-border/30 text-muted-foreground"}`}>
                                          <span className="font-bold mr-1">{opt.toUpperCase()}.</span>
                                          {opt === "a" ? q.option_a : opt === "b" ? q.option_b : opt === "c" ? q.option_c : q.option_d}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {assessments.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground text-sm">No assessments created yet. Add your first assessment above.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─── APPLICATIONS ─── */}
        <TabsContent value="applications">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Student Applications</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredApps.length} of {applications.length} application(s)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search name or email..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="pl-8 w-[180px] h-9 text-xs"
                />
              </div>
              <Select value={appStatusFilter} onValueChange={setAppStatusFilter}>
                <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={appSort} onValueChange={setAppSort}>
                <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="date_asc">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="role_asc">Role (A-Z)</SelectItem>
                  <SelectItem value="role_desc">Role (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Domain</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Applied</th>
                    <th className="text-left py-3 px-4 hidden lg:table-cell">Duration</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredApps.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-muted-foreground italic text-sm">No applications matching your filters.</td></tr>
                  ) : filteredApps.map((app) => {
                    const initials = app.profile?.full_name
                      ? app.profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : "ST";
                    return (
                      <tr key={app.id} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-accent border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-xs">{app.profile?.full_name || "Unknown"}</p>
                              <p className="text-[10px] text-muted-foreground">{app.profile?.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-foreground">{app.domain?.title || "—"}</span>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">{app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}</span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <Badge variant="outline" className="text-[10px] gap-1"><Clock size={10} /> {app.domain?.duration_months || "?"}mo</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`text-[10px] border ${statusStyles[app.status] || ""}`}>{app.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {app.status === "pending" && (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => updateAppStatus(app.id, "approved")} className="h-7 w-7" title="Approve">
                                  <Check size={14} className="text-emerald-600" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => updateAppStatus(app.id, "rejected")} className="h-7 w-7" title="Reject">
                                  <X size={14} className="text-red-500" />
                                </Button>
                              </>
                            )}
                            {app.status === "approved" && (
                              <Button size="sm" variant="outline" onClick={() => generateCertificate(app)} className="gap-1 h-7 text-[10px]">
                                <Award size={12} /> Certificate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ─── SUBMISSIONS ─── */}
        <TabsContent value="submissions">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Task Submissions</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredSubs.length} of {submissions.length} submission(s)</p>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-muted/40 p-1 rounded-xl">
              {["all", "pending", "approved", "rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSubStatusFilter(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all capitalize ${
                    subStatusFilter === s
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Task</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Link</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredSubs.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-muted-foreground italic text-sm">No submissions to review.</td></tr>
                  ) : filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-xs font-semibold text-foreground">{sub.appProfile?.full_name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">{sub.appProfile?.email || ""}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] shrink-0">W{sub.task?.week_number}</Badge>
                          <span className="text-xs font-medium text-foreground">{sub.task?.title || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <a href={sub.submission_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate">
                          <ExternalLink size={11} /> {sub.submission_url}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={`text-[10px] border ${statusStyles[sub.status] || ""}`}>{sub.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {sub.status === "pending" ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <Input
                              placeholder="Feedback..."
                              value={feedbackMap[sub.id] || ""}
                              onChange={(e) => setFeedbackMap((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                              className="w-[120px] h-7 text-[10px]"
                            />
                            <Button size="icon" variant="ghost" onClick={() => updateSubmission(sub.id, "approved")} className="h-7 w-7" title="Approve">
                              <Check size={13} className="text-emerald-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => updateSubmission(sub.id, "rejected")} className="h-7 w-7" title="Reject">
                              <X size={13} className="text-red-500" />
                            </Button>
                          </div>
                        ) : sub.feedback ? (
                          <span className="text-[10px] text-muted-foreground italic max-w-[180px] truncate block text-right">{sub.feedback}</span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ─── CERTIFICATES ─── */}
        <TabsContent value="certificates">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Issued Certificates</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{certificates.length} certificate(s) generated</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Domain</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Duration</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Issued</th>
                    <th className="text-left py-3 px-4 hidden lg:table-cell">Certificate ID</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {certificates.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-muted-foreground italic text-sm">No certificates issued yet.</td></tr>
                  ) : certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                            <GraduationCap size={14} className="text-primary" />
                          </div>
                          <span className="font-semibold text-foreground text-xs">{cert.student_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-foreground">{cert.domain_name}</span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <Badge variant="outline" className="text-[10px]">{cert.duration_text}</Badge>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "N/A"}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-[10px] font-mono text-muted-foreground">{cert.id.slice(0, 8)}...</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => window.open(`/certificate/${cert.id}`, "_blank")} className="gap-1 h-7 text-[10px]">
                          <Award size={12} /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminInternships;
