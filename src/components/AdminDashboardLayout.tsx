import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  FolderKanban,
  Award,
  History as HistoryIcon,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

const adminNavLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Internships", href: "/dashboard/internships", icon: Briefcase },
  { name: "Blog", href: "/dashboard/blog", icon: BookOpen },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Certifications", href: "/dashboard/certifications", icon: Award },
  { name: "History", href: "/dashboard/history", icon: HistoryIcon },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const AdminDashboardLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "AD";

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Administrator";

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getBreadcrumbLabel = () => {
    const current = adminNavLinks.find(link => {
      if (link.href === "/dashboard") {
        return location.pathname === link.href;
      }
      return location.pathname.startsWith(link.href);
    });
    return current ? current.name : "Admin";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/60">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            RSverse LMS
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</p>
          <div className="space-y-1">
            {adminNavLinks.slice(0, 7).map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] ${active ? "text-primary" : "text-muted-foreground/70"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Analytics & Config</p>
          <div className="space-y-1">
            {adminNavLinks.slice(7).map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] ${active ? "text-primary" : "text-muted-foreground/70"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
          <div className="space-y-1">
            <Link
              to="/student-dashboard-legacy"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            >
              <User className="h-[18px] w-[18px] text-muted-foreground/70" />
              Student View
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-muted-foreground/70" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-none text-foreground truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">
                Admin
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-card lg:flex h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-card px-4 md:px-6">
          {/* Mobile Navigation Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{getBreadcrumbLabel()}</span>
          </div>

          <div className="w-full flex-1" />

          {/* Notifications and Info */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-card" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="h-8 w-px bg-border/60 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
                Portal Admin
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
