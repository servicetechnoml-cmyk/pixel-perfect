import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Award, ShieldCheck, Eye } from "lucide-react";

type Certificate = {
  id: string;
  domain_name: string;
  student_name: string;
  duration_text: string;
  issue_date: string | null;
};

const DashboardCertificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCerts();
  }, [user]);

  const fetchCerts = async () => {
    if (!user) return;
    const { data } = await supabase.from("internship_certificates").select("*").eq("user_id", user.id);
    setCertificates(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-card rounded-xl animate-pulse border border-border/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">Certificates</h1>
        <p className="text-muted-foreground text-sm">View and download your earned credentials.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🏅</div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Certificates Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Complete all tasks in your internship to earn your verified certificate. Keep going!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Left Badge Panel */}
                <div className="w-full sm:w-1/3 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary to-accent text-white">
                  <Award className="h-14 w-14 mb-2" />
                  <span className="font-bold text-[10px] tracking-[0.2em] uppercase opacity-80">Earned</span>
                </div>

                {/* Right Content */}
                <div className="w-full sm:w-2/3 p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <Badge variant="secondary" className="text-[10px]">Verified</Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">{cert.domain_name}</h3>
                  <p className="text-xs text-muted-foreground mb-0.5">{cert.student_name} • {cert.duration_text}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mb-1">ID: {cert.id.slice(0, 12)}...</p>
                  <p className="text-[10px] text-muted-foreground mb-auto">
                    Issued: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "N/A"}
                  </p>

                  <div className="flex gap-2 pt-3 mt-3 border-t border-border/40">
                    <Button
                      size="sm"
                      className="flex-1 text-xs rounded-lg"
                      onClick={() => navigate(`/certificate/${cert.id}`)}
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs rounded-lg"
                      onClick={() => window.open(`/verify-certificate?id=${cert.id}`, "_blank")}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Verify
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCertificates;
