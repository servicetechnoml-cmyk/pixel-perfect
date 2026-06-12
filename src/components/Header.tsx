import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Award,
  ShieldCheck,
  Briefcase,
  Calendar,
  Mail,
  Info,
  FileText,
  User,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationMenu = [
  {
    label: "Explore",
    items: [
      { label: "Learning Resources", path: "/resources", icon: BookOpen, description: "Self-learning docs and videos" },
      { label: "Projects", path: "/projects", icon: Briefcase, description: "Real-world tasks and challenges" },
      { label: "Certifications", path: "/certifications", icon: Award, description: "Verified training credentials" },
    ],
  },
  {
    label: "Internships",
    items: [
      { label: "Browse Internships", path: "/internships", icon: GraduationCap, description: "Start virtual training" },
      { label: "Verify Certificate", path: "/verify-certificate", icon: ShieldCheck, description: "Verify student credentials" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About Us", path: "/about", icon: Info, description: "Who we are and our mission" },
      { label: "History", path: "/history", icon: Calendar, description: "Our growth and milestones" },
      { label: "Contact", path: "/contact", icon: Mail, description: "Get in touch with us" },
    ],
  },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate("/login");
  };

  const isDropdownActive = (items: { path: string }[]) => {
    return items.some((item) => location.pathname === item.path);
  };

  const toggleMobileMenu = (label: string) => {
    setExpandedMobileMenu(expandedMobileMenu === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center h-16 px-4">
        {/* Logo — left */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.jpg" alt="RSverse" className="h-16 w-16 object-contain rounded-lg" />
        </Link>

        {/* Desktop Navigation — centered */}
        <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
          {navigationMenu.map((item) => {
            const active = isDropdownActive(item.items);
            return (
              <div key={item.label} className="relative group py-2">
                <button
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    active ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform duration-200 text-muted-foreground/75"
                  />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-80 rounded-2xl bg-card border border-border/80 p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50">
                  <div className="grid gap-1">
                    {item.items.map((subItem) => {
                      const Icon = subItem.icon;
                      const subActive = location.pathname === subItem.path;
                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex gap-3.5 p-3 rounded-xl hover:bg-muted/60 transition-colors ${
                            subActive ? "bg-muted/40 text-primary" : "text-foreground"
                          }`}
                        >
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            subActive ? "bg-primary/20 text-primary" : "bg-primary/5 text-primary"
                          }`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{subItem.label}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                              {subItem.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right side — auth buttons */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus:outline-none">
                <User size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer w-full">
                    {isAdmin ? <LayoutDashboard size={16} /> : <GraduationCap size={16} />}
                    {isAdmin ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="flex items-center gap-2 cursor-pointer w-full">
                    <Settings size={16} />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer w-full">
                  <LogOut size={16} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-2 text-sm font-bold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-foreground p-1 ml-auto"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border px-4 pb-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {navigationMenu.map((item) => {
              const active = isDropdownActive(item.items);
              const expanded = expandedMobileMenu === item.label;
              return (
                <div key={item.label} className="border-b border-border/40 py-1.5">
                  <button
                    onClick={() => toggleMobileMenu(item.label)}
                    className={`flex items-center justify-between w-full py-2 text-sm font-semibold hover:text-primary ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="pl-4 pb-2 space-y-1 mt-1">
                      {item.items.map((subItem) => {
                        const Icon = subItem.icon;
                        const subActive = location.pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2.5 py-2.5 text-xs font-semibold hover:text-primary ${
                              subActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <Icon size={15} className={subActive ? "text-primary" : "text-muted-foreground/70"} />
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 space-y-2">
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-3 text-sm font-semibold text-primary"
              >
                {isAdmin ? <LayoutDashboard size={18} /> : <GraduationCap size={18} />} {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <LogOut size={18} /> Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block w-full text-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

