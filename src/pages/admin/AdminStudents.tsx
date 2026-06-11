import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Calendar,
  X,
  Loader2,
  Trash2,
  Edit2,
  ShieldCheck,
  ShieldAlert,
  Briefcase
} from "lucide-react";

type ProfileWithApp = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  is_blocked: boolean | null;
  created_at: string | null;
  application: {
    id: string;
    domain_id: string;
    start_date: string | null;
    end_date: string | null;
    status: string;
    domain: {
      id: string;
      title: string;
    } | null;
  } | null;
};

const AdminStudents = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "blocked" | "unassigned">("all");
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<ProfileWithApp | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    domainId: "",
    startDate: "",
    endDate: "",
    status: "approved", // approved = active
  });

  const [saving, setSaving] = useState(false);

  // Query 1: Fetch domains for dropdown
  const { data: domains = [] } = useQuery({
    queryKey: ["admin-domains-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("internship_domains")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data || [];
    }
  });

  // Query 2: Fetch profiles with their applications
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin-students-list"],
    queryFn: async () => {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const { data: appsData, error: appsError } = await supabase
        .from("internship_applications")
        .select("*, domain:internship_domains(id, title)");
      if (appsError) throw appsError;

      const appsByUser = new Map();
      appsData?.forEach((app) => {
        appsByUser.set(app.user_id, app);
      });

      return profilesData.map((profile) => ({
        ...profile,
        application: appsByUser.get(profile.user_id) || null,
      })) as ProfileWithApp[];
    },
  });

  // Toggle block/unblock mutation
  const toggleBlock = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_blocked: blocked })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-students-list"] });
      toast.success("Student status updated successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Delete student profile (and cascade applications)
  const deleteStudentMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-students-list"] });
      toast.success("Student deleted successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleOpenAdd = () => {
    setEditStudent(null);
    setForm({
      name: "",
      email: "",
      password: "Student@123", // default password
      phone: "",
      company: "",
      domainId: "",
      startDate: "",
      endDate: "",
      status: "approved"
    });
    setShowModal(true);
  };

  const handleOpenEdit = (student: ProfileWithApp) => {
    setEditStudent(student);
    setForm({
      name: student.full_name || "",
      email: student.email || "",
      password: "", // password not editable
      phone: student.phone || "",
      company: student.company || "",
      domainId: student.application?.domain_id || "",
      startDate: student.application?.start_date || "",
      endDate: student.application?.end_date || "",
      status: student.application?.status || "approved",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editStudent) {
        // UPDATE EXISTING STUDENT
        // 1. Update Profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: form.name,
            phone: form.phone,
            company: form.company
          })
          .eq("user_id", editStudent.user_id);
        if (profileError) throw profileError;

        // 2. Manage Application
        if (form.domainId) {
          if (editStudent.application) {
            // Update application
            const { error: appError } = await supabase
              .from("internship_applications")
              .update({
                domain_id: form.domainId,
                start_date: form.startDate || null,
                end_date: form.endDate || null,
                status: form.status
              })
              .eq("id", editStudent.application.id);
            if (appError) throw appError;
          } else {
            // Create application
            const { error: appError } = await supabase
              .from("internship_applications")
              .insert({
                user_id: editStudent.user_id,
                domain_id: form.domainId,
                start_date: form.startDate || null,
                end_date: form.endDate || null,
                status: form.status
              });
            if (appError) throw appError;
          }
        } else if (editStudent.application) {
          // If admin cleared domain selection, delete the application
          const { error: appDelError } = await supabase
            .from("internship_applications")
            .delete()
            .eq("id", editStudent.application.id);
          if (appDelError) throw appDelError;
        }

        toast.success("Student details updated successfully");
      } else {
        // ADD NEW STUDENT
        if (!form.email || !form.password) {
          toast.error("Email and Password are required");
          return;
        }

        // Initialize temporary Supabase client to avoid logging out the admin
        const tempClient = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false
            }
          }
        );

        const { data: signUpData, error: signUpError } = await tempClient.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name }
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Wait a brief moment to let trigger complete
          await new Promise(resolve => setTimeout(resolve, 500));

          // 1. Update phone/company fields in profiles table
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              phone: form.phone,
              company: form.company
            })
            .eq("user_id", signUpData.user.id);
          if (profileError) throw profileError;

          // 2. Insert application details if domain was chosen
          if (form.domainId) {
            const { error: appError } = await supabase
              .from("internship_applications")
              .insert({
                user_id: signUpData.user.id,
                domain_id: form.domainId,
                start_date: form.startDate || null,
                end_date: form.endDate || null,
                status: "approved"
              });
            if (appError) throw appError;
          }
        }

        toast.success("New student added successfully");
      }

      setShowModal(false);
      qc.invalidateQueries({ queryKey: ["admin-students-list"] });
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (s.full_name || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q) ||
      (s.company || "").toLowerCase().includes(q) ||
      (s.phone || "").toLowerCase().includes(q);

    if (filter === "all") return matchSearch;
    if (filter === "blocked") return matchSearch && s.is_blocked;
    if (filter === "active") return matchSearch && !s.is_blocked && s.application?.status === "approved";
    if (filter === "unassigned") return matchSearch && !s.application;
    return matchSearch;
  });

  const totalCount = students.length;
  const activeCount = students.filter((s) => !s.is_blocked && s.application?.status === "approved").length;
  const blockedCount = students.filter((s) => s.is_blocked).length;
  const unassignedCount = students.filter((s) => !s.application).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading student database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Add student */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Student Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Onboard new interns, manage active placements, and approve or restrict portal access.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="sm:self-start flex items-center gap-2">
          <UserPlus size={16} /> Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalCount, bg: "bg-muted/40 text-foreground" },
          { label: "Active Placements", value: activeCount, bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
          { label: "Unassigned Students", value: unassignedCount, bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
          { label: "Blocked access", value: blockedCount, bg: "bg-destructive/10 text-destructive border border-destructive/20" }
        ].map((c, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-sm ${c.bg}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{c.label}</p>
            <p className="text-2xl font-extrabold font-display mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 bg-muted/40 p-1 rounded-xl self-start">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "unassigned", label: "Unassigned" },
            { id: "blocked", label: "Blocked" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                filter === f.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table view */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="text-left py-3.5 px-4">Student</th>
                <th className="text-left py-3.5 px-4">Internship Domain</th>
                <th className="text-left py-3.5 px-4 hidden md:table-cell">Duration</th>
                <th className="text-left py-3.5 px-4 hidden lg:table-cell">Contact</th>
                <th className="text-left py-3.5 px-4">Access Status</th>
                <th className="text-right py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground italic text-sm">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const initials = student.full_name
                    ? student.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "ST";
                  return (
                    <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                      {/* Name / Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 overflow-hidden">
                            {student.avatar_url ? (
                              <img src={student.avatar_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-xs">{student.full_name || "New Student"}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="py-3.5 px-4">
                        {student.application?.domain ? (
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                            <Briefcase className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                            {student.application.domain.title}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic font-medium">Not Assigned</span>
                        )}
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-xs text-muted-foreground">
                        {student.application?.start_date ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(student.application.start_date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
                            {" — "}
                            {student.application.end_date 
                              ? new Date(student.application.end_date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }) 
                              : "Ongoing"}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Contact details */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <div className="space-y-0.5 text-xs">
                          {student.phone ? (
                            <p className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3 text-muted-foreground/60" /> {student.phone}
                            </p>
                          ) : null}
                          {student.company ? (
                            <p className="flex items-center gap-1 text-muted-foreground">
                              <Building2 className="h-3 w-3 text-muted-foreground/60" /> {student.company}
                            </p>
                          ) : null}
                          {!student.phone && !student.company ? <span className="text-muted-foreground/40">—</span> : null}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {student.is_blocked ? (
                          <Badge variant="destructive" className="text-[9px] px-1.5 py-0.2 gap-1 uppercase tracking-wider font-semibold">
                            <ShieldAlert className="h-2.5 w-2.5" /> Blocked
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 text-[9px] px-1.5 py-0.2 gap-1 uppercase tracking-wider font-semibold">
                            <ShieldCheck className="h-2.5 w-2.5" /> Active
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            title="Edit student"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this student profile?")) {
                                deleteStudentMutation.mutate(student.user_id);
                              }
                            }}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete student"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="h-4 w-px bg-border/60" />
                          <Switch
                            checked={!student.is_blocked}
                            onCheckedChange={(v) => toggleBlock.mutate({ userId: student.user_id, blocked: !v })}
                            title={student.is_blocked ? "Unblock account" : "Block account"}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-muted/10 border-t border-border border-dashed text-xs text-muted-foreground">
          Showing {filtered.length} of {totalCount} profiles
        </div>
      </div>

      {/* Modal - Add / Edit Student */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-xl bg-card border border-border/80 shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <h2 className="font-display text-base font-bold text-foreground">
                {editStudent ? "Edit Student Details" : "Onboard New Student"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-9 text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={!!editStudent}
                    className="h-9 text-xs"
                  />
                </div>

                {!editStudent ? (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default Password</label>
                    <Input
                      type="text"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-9 text-xs" />
                  </div>
                )}

                {editStudent && (
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">College / Company</label>
                    <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="h-9 text-xs" />
                  </div>
                )}
              </div>

              <div className="border-t border-border/40 my-4 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-foreground">Internship Placement</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Assign Domain</label>
                    <select
                      value={form.domainId}
                      onChange={(e) => setForm({ ...form, domainId: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">-- Select Domain --</option>
                      {domains.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                    <Input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      required={!!form.domainId}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
                    <Input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      required={!!form.domainId}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {editStudent && editStudent.application && (
                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Placement Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
                    >
                      <option value="approved">Approved (Active)</option>
                      <option value="pending">Pending Application</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)} disabled={saving} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="text-xs flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                  {editStudent ? "Save Changes" : "Create Student"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
