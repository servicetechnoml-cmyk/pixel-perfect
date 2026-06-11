import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  CheckSquare,
  BarChart,
  Award,
  User,
  LifeBuoy,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Internship", href: "/dashboard/internship", icon: Briefcase },
  { name: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Progress", href: "/dashboard/progress", icon: BarChart },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
];

const DashboardSidebar = () => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-border/60 bg-card lg:flex h-full">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/60">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="RSverse Logo" className="w-8 h-8 rounded-md object-contain bg-white" />
          <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RSverse
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navLinks.map((link) => {
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
              <Icon
                className={`h-[18px] w-[18px] ${
                  active ? "text-primary" : "text-muted-foreground/70"
                }`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/60">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
        >
          ← Back to Home
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
