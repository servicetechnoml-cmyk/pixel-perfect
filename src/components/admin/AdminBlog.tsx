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
import { useAuth } from "@/hooks/useAuth";

const AdminBlog = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", cover_image: "", published: false });

  const { data: posts } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, author_id: user?.id };
      if (editId) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success(editId ? "Post updated" : "Post created");
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast.success("Deleted"); },
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", cover_image: "", published: false });
    setEditId(null);
    setOpen(false);
  };

  const startEdit = (p: any) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content || "", cover_image: p.cover_image || "", published: p.published });
    setEditId(p.id);
    setOpen(true);
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Blog Posts</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus size={16} /> New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={update("title")} required /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={update("slug")} required placeholder="my-blog-post" /></div>
              <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={update("excerpt")} rows={2} /></div>
              <div><Label>Content</Label><Textarea value={form.content} onChange={update("content")} rows={10} /></div>
              <div><Label>Cover Image URL</Label><Input value={form.cover_image} onChange={update("cover_image")} /></div>
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
        {posts?.map((p) => (
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

export default AdminBlog;
