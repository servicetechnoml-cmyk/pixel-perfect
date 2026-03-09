import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Search, CheckCircle, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Certificate = {
  id: string;
  student_name: string;
  domain_name: string;
  duration_text: string;
  issue_date: string | null;
};

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get("id") || "");
  const [cert, setCert] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("id")) {
      handleSearch(searchParams.get("id")!);
    }
  }, []);

  const handleSearch = async (id?: string) => {
    const searchId = id || certId.trim();
    if (!searchId) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from("internship_certificates")
      .select("*")
      .eq("id", searchId)
      .single();
    setCert(data);
    setLoading(false);
  };

  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/verify-certificate?id=${cert?.id}` : "";

  return (
    <div className="py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <Award className="mx-auto text-primary mb-4" size={48} />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Verify Certificate</h1>
          <p className="text-muted-foreground">Enter a certificate ID to verify its authenticity.</p>
        </div>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Enter Certificate ID..."
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={() => handleSearch()} disabled={loading}>
            <Search size={16} className="mr-1" /> Verify
          </Button>
        </div>

        {loading && <p className="text-center text-muted-foreground">Searching...</p>}

        {searched && !loading && !cert && (
          <Card className="border-destructive/30">
            <CardContent className="flex items-center gap-3 py-6">
              <XCircle className="text-destructive" size={24} />
              <div>
                <p className="font-semibold text-foreground">Certificate Not Found</p>
                <p className="text-sm text-muted-foreground">The ID you entered does not match any certificate in our records.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {cert && (
          <Card className="border-primary/30">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>
              </div>
              <CardTitle className="text-2xl">Certificate of Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Awarded to</p>
                <p className="text-xl font-semibold text-foreground">{cert.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Domain</p>
                <p className="text-lg font-medium text-foreground">{cert.domain_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-foreground">{cert.duration_text}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="text-foreground">{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Certificate ID</p>
                <p className="font-mono text-xs text-foreground bg-muted p-2 rounded">{cert.id}</p>
              </div>
              <div className="flex justify-center pt-4">
                <QRCodeSVG value={verifyUrl} size={128} />
              </div>
              <p className="text-xs text-muted-foreground">Scan QR code to verify this certificate</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
