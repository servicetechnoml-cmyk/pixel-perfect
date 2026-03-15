import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, GraduationCap, BookOpen, Award, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "Blog", path: "/blog" },
  { label: "Certifications", path: "/certifications" },
  { label: "History", path: "/history" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const getInternshipSubMenu = (isLoggedIn: boolean) => {
  const items = [
    { label: "Programs", path: "/internships", icon: BookOpen },
    { label: "Verify Certificate", path: "/verify-certificate", icon: ShieldCheck },
  ];
  if (isLoggedIn) {
    items.splice(1, 0, { label: "My Dashboard", path: "/student-dashboard", icon: GraduationCap });
  }
  return items;
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internshipOpen, setInternshipOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInternshipOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    setInternshipOpen(false);
    navigate("/login");
  };

  const isInternshipRoute = ["/internships", "/student-dashboard", "/verify-certificate"].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="RSverse" className="h-10 w-10" />
          <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">RSverse</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Internship Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setInternshipOpen(!internshipOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                isInternshipRoute ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <GraduationCap size={16} /> Internships <ChevronDown size={14} className={`transition-transform ${internshipOpen ? "rotate-180" : ""}`} />
            </button>
            {internshipOpen && (
              <div className="absolute top-full mt-2 right-0 w-52 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                {getInternshipSubMenu(!!user).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setInternshipOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent ${
                      location.pathname === item.path ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    <item.icon size={15} /> {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
          {user ? (
            <button onClick={handleSignOut} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2 text-sm font-bold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
            >
              Sign In
            </Link>
          )}
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground" aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-border my-2 pt-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 px-1">Internships</p>
            {getInternshipSubMenu(!!user).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon size={15} /> {item.label}
              </Link>
            ))}
          </div>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-accent">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="block py-3 text-sm font-medium text-muted-foreground">
              Sign Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-2 block w-full text-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
