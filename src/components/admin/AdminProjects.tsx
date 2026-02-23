import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminProjects = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tech_stack: "", image_url: "", live_url: "", published: false });

  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean) };
      if (editId) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Saved"); resetForm(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Deleted"); },
  });

  const resetForm = () => { setForm({ title: "", description: "", tech_stack: "", image_url: "", live_url: "", published: false }); setEditId(null); setOpen(false); };

  const startEdit = (p: any) => {
    setForm({ title: p.title, description: p.description || "", tech_stack: (p.tech_stack || []).join(", "), image_url: p.image_url || "", live_url: p.live_url || "", published: p.published });
    setEditId(p.id);
    setOpen(true);
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Projects</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} /> New Project</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={update("title")} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={update("description")} rows={4} /></div>
              <div><Label>Tech Stack (comma-separated)</Label><Input value={form.tech_stack} onChange={update("tech_stack")} placeholder="React, Node.js, Python" /></div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={update("image_url")} /></div>
              <div><Label>Live URL</Label><Input value={form.live_url} onChange={update("live_url")} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={(v) => setForm((p) => ({ ...p, published: v }))} />
                <Label>Published</Label>
              </div>
              <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {projects?.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg bg-card p-4 shadow-card">
            <div>
              <h3 className="font-medium text-foreground">{p.title}</h3>
              <span className={`text-xs ${p.published ? "text-accent" : "text-muted-foreground"}`}>{p.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Edit size={16} /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
