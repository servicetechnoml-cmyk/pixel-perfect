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

const AdminHistory = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", icon: "", published: false });

  const { data: events } = useQuery({
    queryKey: ["admin-history"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_history").select("*").order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, event_date: form.event_date || null };
      if (editId) {
        const { error } = await supabase.from("company_history").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("company_history").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-history"] }); toast.success("Saved"); resetForm(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("company_history").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-history"] }); toast.success("Deleted"); },
  });

  const resetForm = () => { setForm({ title: "", description: "", event_date: "", icon: "", published: false }); setEditId(null); setOpen(false); };

  const startEdit = (e: any) => {
    setForm({ title: e.title, description: e.description || "", event_date: e.event_date || "", icon: e.icon || "", published: e.published });
    setEditId(e.id);
    setOpen(true);
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Company History</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} /> New Event</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Event" : "New Event"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={update("title")} required /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={update("description")} rows={3} /></div>
              <div><Label>Event Date</Label><Input type="date" value={form.event_date} onChange={update("event_date")} /></div>
              <div><Label>Icon (emoji or text)</Label><Input value={form.icon} onChange={update("icon")} /></div>
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
        {events?.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-lg bg-card p-4 shadow-card">
            <div>
              <h3 className="font-medium text-foreground">{e.title}</h3>
              <span className={`text-xs ${e.published ? "text-accent" : "text-muted-foreground"}`}>{e.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(e)}><Edit size={16} /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(e.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHistory;
