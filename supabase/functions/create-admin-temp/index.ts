import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async () => {
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const email = "service@technoml.in";
  const { data: existing } = await sb.auth.admin.listUsers();
  let user = existing.users.find(u => u.email === email);
  if (!user) {
    const { data, error } = await sb.auth.admin.createUser({ email, password: "TechnoML@2026", email_confirm: true, user_metadata: { full_name: "RSverse Admin" } });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    user = data.user;
  } else {
    await sb.auth.admin.updateUserById(user.id, { password: "TechnoML@2026", email_confirm: true });
  }
  await sb.from("user_roles").upsert({ user_id: user!.id, role: "admin" }, { onConflict: "user_id,role" });
  await sb.from("profiles").update({ is_approved: true, is_blocked: false }).eq("user_id", user!.id);
  return new Response(JSON.stringify({ ok: true, id: user!.id }));
});
