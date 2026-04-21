import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck, Clock, Check } from "lucide-react";

const AdminUsers = () => {
  const qc = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleBlock = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: string; blocked: boolean }) => {
      const { error } = await supabase.from("profiles").update({ is_blocked: blocked }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const approveUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("profiles").update({ is_approved: true }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User approved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">User Management</h2>
      <div className="space-y-3">
        {profiles?.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg bg-card p-4 shadow-card">
            <div>
              <h3 className="font-medium text-foreground">{p.full_name || "No name"}</h3>
              <p className="text-xs text-muted-foreground">{p.email}</p>
              {p.company && <p className="text-xs text-muted-foreground">{p.company}</p>}
              {!p.is_approved && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                  <Clock size={11} /> Pending approval
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!p.is_approved && (
                <Button size="sm" onClick={() => approveUser.mutate(p.user_id)} className="gap-1">
                  <Check size={14} /> Approve
                </Button>
              )}
              {p.is_blocked ? (
                <ShieldAlert className="text-destructive" size={18} />
              ) : (
                <ShieldCheck className="text-accent" size={18} />
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{p.is_blocked ? "Blocked" : "Active"}</span>
                <Switch
                  checked={!!p.is_blocked}
                  onCheckedChange={(v) => toggleBlock.mutate({ userId: p.user_id, blocked: v })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
