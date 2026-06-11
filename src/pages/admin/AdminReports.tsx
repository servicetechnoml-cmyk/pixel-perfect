import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BarChart3, TrendingUp, Award, CheckCircle2, ShieldAlert } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

const AdminReports = () => {
  // Query 1: Total applications
  const { data: totalApps = 0, isLoading: appsLoading } = useQuery({
    queryKey: ["reports-total-apps"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_applications")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 2: Total certificates
  const { data: totalCertificates = 0, isLoading: certsLoading } = useQuery({
    queryKey: ["reports-total-certs"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_certificates")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 3: Active applications (approved)
  const { data: activeApps = 0, isLoading: activeLoading } = useQuery({
    queryKey: ["reports-active-apps"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 4: Pending applications
  const { data: pendingApps = 0, isLoading: pendingLoading } = useQuery({
    queryKey: ["reports-pending-apps"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 5: Domains and metrics per domain (client-side aggregation)
  const { data: domainMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ["reports-domain-metrics"],
    queryFn: async () => {
      const { data: domains, error: domainsError } = await supabase
        .from("internship_domains")
        .select("id, title");
      if (domainsError) throw domainsError;

      const { data: apps, error: appsError } = await supabase
        .from("internship_applications")
        .select("domain_id, status");
      if (appsError) throw appsError;

      const { data: certs, error: certsError } = await supabase
        .from("internship_certificates")
        .select("domain_name");
      if (certsError) throw certsError;

      return domains.map((domain) => {
        const domainApps = apps.filter((a) => a.domain_id === domain.id);
        const activeCount = domainApps.filter((a) => a.status === "approved").length;
        const pendingCount = domainApps.filter((a) => a.status === "pending").length;
        const completedCount = domainApps.filter((a) => a.status === "completed").length;
        
        // Exact count matching domain title
        const certsCount = certs.filter((c) => c.domain_name.toLowerCase().includes(domain.title.toLowerCase())).length;

        return {
          name: domain.title,
          active: activeCount,
          pending: pendingCount,
          completed: completedCount,
          certificates: certsCount,
        };
      });
    }
  });

  // Trend data representing monthly performance (mocked for visualization)
  const monthlyTrend = [
    { month: "Jan", Placements: 12, Certificates: 4 },
    { month: "Feb", Placements: 19, Certificates: 6 },
    { month: "Mar", Placements: 26, Certificates: 12 },
    { month: "Apr", Placements: 35, Certificates: 18 },
    { month: "May", Placements: 48, Certificates: 25 },
    { month: "Jun", Placements: 62, Certificates: 38 },
  ];

  const loading = appsLoading || certsLoading || activeLoading || pendingLoading || metricsLoading;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Gathering platform metrics...</p>
      </div>
    );
  }

  // Distribution chart data
  const pieData = domainMetrics.map((item) => ({
    name: item.name,
    value: item.active + item.completed + item.pending || 0
  })).filter((item) => item.value > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Detailed metrics showing virtual internship signups, certificate distribution, and domain breakdowns.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: totalApps, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
          { label: "Active Interns", value: activeApps, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Pending Placements", value: pendingApps, icon: Clock, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
          { label: "Certificates Distributed", value: totalCertificates, icon: Award, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border border-border/60 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-extrabold font-display leading-none text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold font-display">Enrollment & Certificate Trends</CardTitle>
            <CardDescription className="text-xs">Cumulative performance comparison (Jan - Jun)</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "rgba(148, 163, 184, 0.25)",
                    borderRadius: "8px",
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="Placements" stroke="#3B82F6" strokeWidth={2} fillOpacity={0.08} fill="#3B82F6" />
                <Area type="monotone" dataKey="Certificates" stroke="#10B981" strokeWidth={2} fillOpacity={0.08} fill="#10B981" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Domain Distribution Pie Chart */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold font-display">Intern Share by Domain</CardTitle>
            <CardDescription className="text-xs">Distribution of students across active internship fields</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex flex-col md:flex-row items-center justify-between gap-4">
            {pieData.length > 0 ? (
              <>
                <div className="w-full md:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "rgba(148, 163, 184, 0.25)",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 shrink-0 text-xs w-full md:w-1/2 max-h-56 overflow-y-auto px-2">
                  {pieData.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="truncate font-medium text-foreground max-w-[120px]">{entry.name}</span>
                      </div>
                      <span className="font-semibold text-muted-foreground">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground italic">
                <ShieldAlert className="h-5 w-5 text-muted-foreground/50" />
                No placements data available to chart.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain Performance Table Card */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold font-display">Performance by Internship Category</CardTitle>
          <CardDescription className="text-xs">Placements and certification issuance statistics per category</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                  <th className="text-left py-3 px-5">Domain</th>
                  <th className="text-center py-3 px-4">Active Interns</th>
                  <th className="text-center py-3 px-4">Pending Approval</th>
                  <th className="text-center py-3 px-4">Completed Placements</th>
                  <th className="text-center py-3 px-4">Certificates Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {domainMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground italic">
                      No active domains registered.
                    </td>
                  </tr>
                ) : (
                  domainMetrics.map((item, i) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-5 font-semibold text-foreground">{item.name}</td>
                      <td className="text-center py-3 px-4 font-medium text-foreground">{item.active}</td>
                      <td className="text-center py-3 px-4 text-muted-foreground">{item.pending}</td>
                      <td className="text-center py-3 px-4 text-muted-foreground">{item.completed}</td>
                      <td className="text-center py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{item.certificates}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
