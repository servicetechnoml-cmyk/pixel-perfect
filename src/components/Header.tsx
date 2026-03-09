import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
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

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TechnoML" className="h-10 w-10" />
          <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">TechnoML</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === item.path ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
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
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
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
