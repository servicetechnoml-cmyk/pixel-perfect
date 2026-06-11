import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  UploadCloud,
  FileImage,
  Signature,
  Save,
  Trash2,
  Image as ImageIcon
} from "lucide-react";

type CompanySettings = {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
};

const defaultSettings: CompanySettings = {
  name: "RSverse Solutions",
  address: "102, Innovation Hub, Hitech City, Hyderabad, India - 500081",
  email: "hr@technoml.com",
  phone: "+91 80081 23456",
  website: "https://www.technoml.com",
};

const AdminSettings = () => {
  const [form, setForm] = useState<CompanySettings>(defaultSettings);
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const savedForm = localStorage.getItem("technoml_admin_settings");
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    const savedLogo = localStorage.getItem("technoml_admin_logo");
    if (savedLogo) {
      setLogo(savedLogo);
    }

    const savedSignature = localStorage.getItem("technoml_admin_signature");
    if (savedSignature) {
      setSignature(savedSignature);
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("technoml_admin_settings", JSON.stringify(form));
      setSaving(false);
      toast.success("Company settings saved successfully");
    }, 500);
  };

  // Convert uploaded image to Base64 and store in LocalStorage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: "technoml_admin_logo" | "technoml_admin_signature") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      localStorage.setItem(key, base64);
      if (key === "technoml_admin_logo") {
        setLogo(base64);
        toast.success("Logo uploaded successfully");
      } else {
        setSignature(base64);
        toast.success("Signature uploaded successfully");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = (key: "technoml_admin_logo" | "technoml_admin_signature") => {
    localStorage.removeItem(key);
    if (key === "technoml_admin_logo") {
      setLogo(null);
      toast.success("Logo cleared");
    } else {
      setSignature(null);
      toast.success("Signature cleared");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage corporate profiles, logo branding, and signature credentials used across the system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side - Details Form */}
        <div className="lg:col-span-3">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-base font-bold font-display flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-primary" /> Corporate Credentials
              </CardTitle>
              <CardDescription className="text-xs">Update your legal name, contact addresses, and website links</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="companyName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      id="companyName"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Office Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required
                      rows={3}
                      className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="pl-9 h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Line</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        className="pl-9 h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="website" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      id="website"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      required
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex justify-end">
                  <Button type="submit" size="sm" disabled={saving} className="text-xs flex items-center gap-1.5 px-4">
                    <Save size={14} />
                    {saving ? "Saving..." : "Save Details"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Branding Assets Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Asset */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold font-display flex items-center gap-2">
                <ImageIcon className="h-4.5 w-4.5 text-primary" /> Corporate Logo
              </CardTitle>
              <CardDescription className="text-xs">Logo appearing in system dashboards and credentials</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {logo ? (
                <div className="flex flex-col items-center gap-3 bg-muted/20 p-4 rounded-xl border border-dashed border-border/60">
                  <img src={logo} alt="Corporate Logo" className="max-h-24 object-contain max-w-full rounded-md shadow-sm" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearImage("technoml_admin_logo")}
                    className="text-xs text-destructive hover:bg-destructive/10 border-destructive/20 h-8 gap-1.5"
                  >
                    <Trash2 size={13} /> Remove logo
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/80 hover:border-primary/50 bg-muted/10 rounded-xl cursor-pointer hover:bg-muted/20 transition-all text-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground/70 mb-2" />
                  <span className="text-xs font-semibold text-foreground">Click to upload logo</span>
                  <span className="text-[10px] text-muted-foreground mt-1 font-medium">PNG, JPG up to 2MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "technoml_admin_logo")}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Signature Asset */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold font-display flex items-center gap-2">
                <Signature className="h-4.5 w-4.5 text-primary" /> Authorized Signature
              </CardTitle>
              <CardDescription className="text-xs">Digital signature stamped on internship completion awards</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {signature ? (
                <div className="flex flex-col items-center gap-3 bg-muted/20 p-4 rounded-xl border border-dashed border-border/60">
                  <img src={signature} alt="Authorized Signature" className="max-h-16 object-contain max-w-full bg-white p-2 rounded-md shadow-sm border" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClearImage("technoml_admin_signature")}
                    className="text-xs text-destructive hover:bg-destructive/10 border-destructive/20 h-8 gap-1.5"
                  >
                    <Trash2 size={13} /> Remove signature
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/80 hover:border-primary/50 bg-muted/10 rounded-xl cursor-pointer hover:bg-muted/20 transition-all text-center">
                  <FileImage className="h-8 w-8 text-muted-foreground/70 mb-2" />
                  <span className="text-xs font-semibold text-foreground">Click to upload signature</span>
                  <span className="text-[10px] text-muted-foreground mt-1 font-medium">Transparent PNG recommended</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "technoml_admin_signature")}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
