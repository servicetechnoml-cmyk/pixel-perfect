import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    if (data.user) {
      const { data: roleData } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin" as const,
      });
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_approved, is_blocked")
        .eq("user_id", data.user.id)
        .maybeSingle();
      setLoading(false);
      if (profile?.is_blocked) {
        await supabase.auth.signOut();
        toast.error("Your account has been blocked. Contact the administrator.");
        return;
      }
      if (!roleData && !profile?.is_approved) {
        // Auto-approve older accounts (created > 1 hour ago)
        const createdAt = data.user.created_at ? new Date(data.user.created_at).getTime() : 0;
        const isNewUser = Date.now() - createdAt < 60 * 60 * 1000;
        if (isNewUser) {
          await supabase.auth.signOut();
          toast.error("Your account is pending admin approval.");
          return;
        }
        // Auto-approve this older user
        await supabase.from("profiles").update({ is_approved: true }).eq("user_id", data.user.id);
      }
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } else {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-elevated">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-center">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
