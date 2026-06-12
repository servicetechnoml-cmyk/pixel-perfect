import { Bell, Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const DashboardTopNav = () => {
  const { user } = useAuth();
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  const displayName = user?.user_metadata?.full_name || user?.email || "Student";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-card px-4 md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <Link to="/" className="flex items-center gap-2 lg:hidden">
        <img src="/logo.jpg" alt="RSverse Logo" className="w-7 h-7 rounded-md object-contain bg-white" />
        <span className="font-display font-bold text-primary">
          RSverse
        </span>
      </Link>
      <div className="w-full flex-1">
        <form className="relative hidden sm:flex items-center max-w-sm">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search internships, tasks..."
            className="w-full bg-muted/50 pl-9 border-none h-9 rounded-lg focus-visible:ring-1 text-sm"
          />
        </form>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground h-9 w-9"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-card" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="flex items-center gap-2.5 border-l border-border/60 pl-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
            {initials}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold leading-none text-foreground">
              {displayName}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopNav;
