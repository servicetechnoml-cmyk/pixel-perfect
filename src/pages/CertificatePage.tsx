import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer } from "lucide-react";

type Certificate = {
  id: string;
  student_name: string;
  domain_name: string;
  duration_text: string;
  issue_date: string | null;
};

const CertificatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      supabase
        .from("internship_certificates")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          setCert(data);
          setLoading(false);
        });
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/verify-certificate?id=${cert?.id}` : "";

  if (loading) return <div className="py-24 text-center text-muted-foreground">Loading certificate...</div>;
  if (!cert) return <div className="py-24 text-center text-muted-foreground">Certificate not found.</div>;

  return (
    <div className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Action Buttons - hidden when printing */}
        <div className="flex justify-center gap-3 mb-8 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer size={16} /> Print / Save as PDF
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Download size={16} /> Download PDF
          </Button>
        </div>

        {/* Certificate */}
        <div ref={certRef} className="bg-white print:shadow-none shadow-xl rounded-lg overflow-hidden">
          {/* Decorative Border */}
          <div className="border-[6px] border-double border-primary/40 m-3 p-8 md:p-12 relative">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/60 -translate-x-px -translate-y-px" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary/60 translate-x-px -translate-y-px" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary/60 -translate-x-px translate-y-px" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/60 translate-x-px translate-y-px" />

            <div className="text-center space-y-6">
              {/* Header */}
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">RSverse</p>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Certificate of Completion</h1>
                <div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
              </div>

              {/* Body */}
              <div className="py-4 space-y-4">
                <p className="text-gray-500 text-sm">This is to certify that</p>
                <p className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 border-b-2 border-primary/30 pb-2 inline-block px-8">
                  {cert.student_name}
                </p>
                <p className="text-gray-500 text-sm">has successfully completed the</p>
                <p className="text-xl md:text-2xl font-semibold text-primary">{cert.domain_name}</p>
                <p className="text-gray-500 text-sm">internship program</p>
                <p className="text-gray-600">
                  Duration: <span className="font-medium">{cert.duration_text}</span>
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-6">
                <div className="text-left">
                  <p className="text-xs text-gray-400 mb-1">Issue Date</p>
                  <p className="text-sm font-medium text-gray-700">
                    {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <QRCodeSVG value={verifyUrl} size={80} />
                  <p className="text-[10px] text-gray-400 mt-1">Scan to verify</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Certificate ID</p>
                  <p className="text-[10px] font-mono text-gray-500">{cert.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          [class*="certRef"], [class*="certRef"] * { visibility: visible; }
          header, footer, nav { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
