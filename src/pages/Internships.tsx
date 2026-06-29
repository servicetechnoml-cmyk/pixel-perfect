import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Clock, BookOpen, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type Domain = {
  id: string;
  title: string;
  description: string | null;
  duration_months: number;
  is_active: boolean | null;
};

const Internships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", college: "" });
  const [hasActiveInternship, setHasActiveInternship] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, [user]);

  const fetchDomains = async () => {
    const { data } = await supabase.from("internship_domains").select("*").eq("is_active", true);
    setDomains(data || []);

    if (user) {
      const { data: apps } = await supabase
        .from("internship_applications")
        .select("domain_id, status")
        .eq("user_id", user.id);
      setAppliedIds((apps || []).map((a) => a.domain_id));
      
      // Check if user has any active (not completed/rejected) internship
      const activeApp = (apps || []).some(
        (a) => a.status !== "completed" && a.status !== "rejected"
      );
      setHasActiveInternship(activeApp);

      // Pre-fill from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, phone, company")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        setFormData({
          full_name: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          college: profile.company || "",
        });
      }
    }
    setLoading(false);
  };

  const openApplyForm = (domain: Domain) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (hasActiveInternship) {
      toast({ 
        title: "Cannot apply", 
        description: "You already have an active internship. Please complete or wait for your current internship to finish before applying for a new one.", 
        variant: "destructive" 
      });
      return;
    }
    setSelectedDomain(domain);
  };

  const handleApply = async () => {
    if (!user || !selectedDomain) return;
    if (!formData.full_name || !formData.email) {
      toast({ title: "Please fill in your name and email", variant: "destructive" });
      return;
    }
    setApplying(selectedDomain.id);

    // Update profile with form data
    await supabase.from("profiles").update({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      company: formData.college,
    }).eq("user_id", user.id);

    // Determine if user is new (created within last 1 hour)
    const isNewUser = user.created_at 
      ? new Date().getTime() - new Date(user.created_at).getTime() < 60 * 60 * 1000
      : true; // fallback to true if created_at is missing for some reason
      
    const applicationStatus = isNewUser ? "pending" : "approved";

    const { error } = await supabase.from("internship_applications").insert({
      user_id: user.id,
      domain_id: selectedDomain.id,
      status: applicationStatus,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Applied!", description: "Your application has been submitted for review." });
      setAppliedIds((prev) => [...prev, selectedDomain.id]);
      setSelectedDomain(null);
    }
    setApplying(null);
  };

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Internship Programs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our available internship domains. Apply to start your learning journey and earn a verified certificate upon completion.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="flex justify-between"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-5 w-20 rounded-full" /></div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : domains.length === 0 ? (
          <p className="text-center text-muted-foreground">No internship programs available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => {
              const applied = appliedIds.includes(domain.id);
              return (
                <Card key={domain.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{domain.title}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock size={12} /> {domain.duration_months} {domain.duration_months === 1 ? "month" : "months"}
                      </Badge>
                    </div>
                    <CardDescription>{domain.description || "No description provided."}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applied ? (
                      <Button disabled variant="outline" className="w-full gap-2">
                        <CheckCircle size={16} /> Applied
                      </Button>
                    ) : hasActiveInternship ? (
                      <Button disabled variant="outline" className="w-full gap-2 opacity-60">
                        Complete Current Internship First
                      </Button>
                    ) : (
                      <Button onClick={() => openApplyForm(domain)} className="w-full gap-2">
                        <BookOpen size={16} /> Apply Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {user && (
          <div className="text-center mt-12">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Go to My Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* Application Form Dialog */}
      <Dialog open={!!selectedDomain} onOpenChange={(open) => !open && setSelectedDomain(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {selectedDomain?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Duration: {selectedDomain?.duration_months} month(s) • {selectedDomain?.description || "No description"}
            </p>
            <div>
              <Label>Full Name *</Label>
              <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
            </div>
            <div>
              <Label>College / Company</Label>
              <Input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} placeholder="Your institution" />
            </div>
            <Button onClick={handleApply} disabled={applying === selectedDomain?.id} className="w-full">
              {applying === selectedDomain?.id ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Internships;
