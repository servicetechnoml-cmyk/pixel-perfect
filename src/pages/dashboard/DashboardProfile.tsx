import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { User, Mail, Briefcase, GraduationCap, MapPin, Upload } from "lucide-react";

const DashboardProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    company: "",
    email: "",
    avatar_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, phone, company, avatar_url")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        company: data.company || "",
        avatar_url: data.avatar_url || "",
      });
    } else {
      setProfile((prev) => ({ ...prev, email: user.email || "" }));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        company: profile.company,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated successfully." });
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user!.id);
      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({ title: "Avatar updated successfully!" });
    } catch (error: any) {
      toast({ title: "Error uploading avatar", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast({ title: "Passwords do not match", variant: "destructive" });
    }
    if (passwords.new.length < 6) {
      return toast({ title: "Password must be at least 6 characters", variant: "destructive" });
    }
    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    setUpdatingPassword(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Password updated successfully" });
      setPasswords({ new: "", confirm: "" });
    }
  };

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-card rounded-xl animate-pulse border border-border/50" />
          <div className="md:col-span-2 h-64 bg-card rounded-xl animate-pulse border border-border/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Profile Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account details and personal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="rounded-xl bg-card border border-border/50 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="h-28 w-28 rounded-full border-4 border-card shadow-lg bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-primary text-3xl font-bold mb-4 overflow-hidden relative group">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
              <Upload className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Upload</span>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-0.5">{profile.full_name || "Student"}</h2>
          <p className="text-xs text-muted-foreground mb-4">{profile.company || "Not set"}</p>
          <div className="w-full space-y-2">
            <Button variant="outline" className="w-full text-xs relative overflow-hidden" disabled={uploading}>
              <Upload className="mr-1.5 h-3.5 w-3.5" /> {uploading ? "Uploading..." : "Change Avatar"}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 rounded-xl bg-card border border-border/50 shadow-sm">
          <div className="p-5 border-b border-border/40">
            <h2 className="text-base font-bold text-foreground">Personal Information</h2>
            <p className="text-xs text-muted-foreground">Update your personal and educational details here.</p>
          </div>
          <div className="p-5">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      className="pl-9 h-9 text-sm"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input className="pl-9 h-9 text-sm" value={profile.email} disabled />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      className="pl-9 h-9 text-sm"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 0000000000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">College / Company</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                    <Input
                      className="pl-9 h-9 text-sm"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Institution name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-foreground">Resume Upload</label>
                <div className="border-2 border-dashed border-border/60 rounded-lg p-5 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <Upload className="h-7 w-7 text-muted-foreground/50 mb-2" />
                  <p className="text-xs font-medium text-foreground mb-0.5">Click to upload or drag & drop</p>
                  <p className="text-[10px] text-muted-foreground">PDF, DOCX up to 5MB</p>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button type="submit" className="rounded-lg px-6 h-9 text-sm" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="p-5 border-t border-border/40">
            <h2 className="text-base font-bold text-foreground mb-1">Security</h2>
            <p className="text-xs text-muted-foreground mb-4">Update your password to keep your account secure.</p>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">New Password</label>
                  <Input
                    type="password"
                    className="h-9 text-sm"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Confirm Password</label>
                  <Input
                    type="password"
                    className="h-9 text-sm"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="secondary" className="rounded-lg px-6 h-9 text-sm" disabled={updatingPassword}>
                  {updatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
