import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  UserPlus,
  PlusCircle,
  FileBadge2,
  ListRestart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";

// Mock data for graphs representing trends
const growthData = [
  { name: "Jan", Students: 45, Certificates: 12 },
  { name: "Feb", Students: 68, Certificates: 18 },
  { name: "Mar", Students: 89, Certificates: 32 },
  { name: "Apr", Students: 120, Certificates: 45 },
  { name: "May", Students: 155, Certificates: 78 },
  { name: "Jun", Students: 210, Certificates: 112 },
];

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

const AdminOverview = () => {
  // Query 1: Total Profiles (Students)
  const { data: totalStudents = 0, isLoading: loadingStudents } = useQuery({
    queryKey: ["admin-total-students"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 2: Active Internships
  const { data: activeInternships = 0, isLoading: loadingActive } = useQuery({
    queryKey: ["admin-active-internships"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 3: Certificates Issued
  const { data: certificatesCount = 0, isLoading: loadingCertificates } = useQuery({
    queryKey: ["admin-total-certificates"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_certificates")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 4: Pending Task Submissions
  const { data: pendingSubmissions = 0, isLoading: loadingPending } = useQuery({
    queryKey: ["admin-pending-submissions"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("internship_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count || 0;
    }
  });

  // Query 5: Recent Student Profiles for Activity
  const { data: recentStudents = [] } = useQuery({
    queryKey: ["admin-recent-students-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    }
  });

  // Query 6: Domain distribution count for charts
  const { data: domainDistribution = [] } = useQuery({
    queryKey: ["admin-domain-distribution"],
    queryFn: async () => {
      const { data: apps, error: appsError } = await supabase
        .from("internship_applications")
        .select("domain_id");
      if (appsError) throw appsError;

      const { data: domains, error: domainsError } = await supabase
        .from("internship_domains")
        .select("id, title");
      if (domainsError) throw domainsError;

      const domainMap = new Map(domains?.map(d => [d.id, d.title]));
      const counts: Record<string, number> = {};
      
      apps?.forEach(app => {
        const title = domainMap.get(app.domain_id) || "Other";
        counts[title] = (counts[title] || 0) + 1;
      });

      return Object.keys(counts).map(key => ({
        name: key,
        value: counts[key]
      }));
    }
  });

  const isStatsLoading = loadingStudents || loadingActive || loadingCertificates || loadingPending;

  const statCards = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/25",
      trend: "+12% overall",
      description: "Registered learners"
    },
    {
      label: "Active Internships",
      value: activeInternships,
      icon: Briefcase,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
      trend: "+8% this month",
      description: "Ongoing placements"
    },
    {
      label: "Certificates Issued",
      value: certificatesCount,
      icon: Award,
      color: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/25",
      trend: "Verifiable credentials",
      description: "Successfully completed"
    },
    {
      label: "Pending Evaluations",
      value: pendingSubmissions,
      icon: Clock,
      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/25",
      trend: "Awaiting review",
      description: "Submissions submitted"
    }
  ];

  const quickActions = [
    {
      title: "Add Student",
      desc: "Manually onboard a new intern profile",
      href: "/dashboard/students",
      icon: UserPlus,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/15"
    },
    {
      title: "Create Internship",
      desc: "Add a new domain category",
      href: "/dashboard/internships",
      icon: PlusCircle,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/15"
    },
    {
      title: "Issue Certificate",
      desc: "Distribute completion awards",
      href: "/dashboard/certifications",
      icon: FileBadge2,
      color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time summary of TechnoML learning portal and internship performance.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border border-border/60 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    {isStatsLoading ? (
                      <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                    ) : (
                      <h3 className="text-3xl font-extrabold font-display leading-none text-foreground">{stat.value}</h3>
                    )}
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      {stat.description}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br border ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} to={action.href} className="block group">
              <Card className="border border-border/60 transition-all duration-300 group-hover:border-primary/45 group-hover:shadow-sm bg-card hover:bg-muted/10 h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl ${action.color} transition-colors shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      {action.title}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Area Chart */}
        <Card className="border border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold font-display">Student & Certification Growth</CardTitle>
              <CardDescription className="text-xs">Visualized monthly tracking data</CardDescription>
            </div>
            <div className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
              Live updates
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCertificates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "rgba(148, 163, 184, 0.25)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ fontWeight: "bold", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="Students" stroke="#3B82F6" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Certificates" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorCertificates)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Domain Distribution Pie Chart */}
        <Card className="border border-border/60 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold font-display">Internship Distribution</CardTitle>
            <CardDescription className="text-xs">Top active domains by student count</CardDescription>
          </CardHeader>
          <CardContent className="h-56 flex items-center justify-center">
            {domainDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {domainDistribution.map((entry, index) => (
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
            ) : (
              <div className="text-xs text-muted-foreground italic flex flex-col items-center gap-1.5">
                <ListRestart className="h-5 w-5 animate-spin text-muted-foreground/50" />
                Processing domains distribution...
              </div>
            )}
          </CardContent>
          <div className="p-5 border-t border-border/40 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {domainDistribution.slice(0, 4).map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate max-w-[80px] font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity Card */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold font-display">Recent System Signups</CardTitle>
            <CardDescription className="text-xs">Latest students joining the platform</CardDescription>
          </div>
          <Link to="/dashboard/students">
            <Button variant="outline" size="sm" className="text-xs h-8">
              View All Students
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {recentStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No recent signups found.
              </div>
            ) : (
              recentStudents.map((student, i) => {
                const date = student.created_at ? new Date(student.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                }) : "Just now";
                return (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold border border-primary/20">
                        {student.full_name?.charAt(0).toUpperCase() || student.email?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {student.full_name || "New Student"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Joined {date}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
