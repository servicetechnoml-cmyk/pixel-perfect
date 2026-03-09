import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Clock, BookOpen, CheckCircle } from "lucide-react";

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

  useEffect(() => {
    fetchDomains();
  }, [user]);

  const fetchDomains = async () => {
    const { data } = await supabase.from("internship_domains").select("*").eq("is_active", true);
    setDomains(data || []);

    if (user) {
      const { data: apps } = await supabase
        .from("internship_applications")
        .select("domain_id")
        .eq("user_id", user.id);
      setAppliedIds((apps || []).map((a) => a.domain_id));
    }
    setLoading(false);
  };

  const handleApply = async (domainId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(domainId);
    const { error } = await supabase.from("internship_applications").insert({
      user_id: user.id,
      domain_id: domainId,
      status: "pending",
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Applied!", description: "Your application has been submitted for review." });
      setAppliedIds((prev) => [...prev, domainId]);
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
          <p className="text-center text-muted-foreground">Loading programs...</p>
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
                    ) : (
                      <Button
                        onClick={() => handleApply(domain.id)}
                        disabled={applying === domain.id}
                        className="w-full gap-2"
                      >
                        <BookOpen size={16} /> {applying === domain.id ? "Applying..." : "Apply Now"}
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
            <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
              Go to My Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;
