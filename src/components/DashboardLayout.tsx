import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopNav from "@/components/DashboardTopNav";

const DashboardLayout = () => {
  const { user, loading, isAdmin, viewAsStudent, setViewAsStudent } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {isAdmin && viewAsStudent && (
          <div className="bg-primary text-primary-foreground py-1.5 px-4 text-center text-xs font-medium flex justify-between items-center z-50 shrink-0">
            <span>You are currently in <strong>Student View</strong> simulation</span>
            <button 
              onClick={() => {
                if (setViewAsStudent) setViewAsStudent(false);
                navigate('/dashboard');
              }}
              className="bg-primary-foreground text-primary hover:bg-white px-3 py-1 rounded text-xs font-semibold transition-colors"
            >
              Back to Admin
            </button>
          </div>
        )}
        <DashboardTopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
