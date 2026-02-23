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

const AdminCertifications = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", issuer: "", date_issued: "", image_url: "", description: "", published: false });

  const { data: certs } = useQuery({
    queryKey: ["admin-certs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, date_issued: form.date_issued || null };
      if (editId) {
        const { error } = await supabase.from("certifications").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("certifications").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-certs"] }); toast.success("Saved"); resetForm(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-certs"] }); toast.success("Deleted"); },
  });

  const resetForm = () => { setForm({ title: "", issuer: "", date_issued: "", image_url: "", description: "", published: false }); setEditId(null); setOpen(false); };

  const startEdit = (c: any) => {
    setForm({ title: c.title, issuer: c.issuer || "", date_issued: c.date_issued || "", image_url: c.image_url || "", description: c.description || "", published: c.published });
    setEditId(c.id);
    setOpen(true);
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Certifications</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} /> New Certification</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Certification" : "New Certification"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={update("title")} required /></div>
              <div><Label>Issuer</Label><Input value={form.issuer} onChange={update("issuer")} /></div>
              <div><Label>Date Issued</Label><Input type="date" value={form.date_issued} onChange={update("date_issued")} /></div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={update("image_url")} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={update("description")} rows={3} /></div>
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
        {certs?.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg bg-card p-4 shadow-card">
            <div>
              <h3 className="font-medium text-foreground">{c.title}</h3>
              <span className={`text-xs ${c.published ? "text-accent" : "text-muted-foreground"}`}>{c.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(c)}><Edit size={16} /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCertifications;
