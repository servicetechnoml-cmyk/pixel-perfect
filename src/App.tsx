import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import LayoutWrapper from "./components/LayoutWrapper";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboardLayout from "./components/AdminDashboardLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Resources from "./pages/Resources";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import History from "./pages/History";
import Internships from "./pages/Internships";
import StudentDashboard from "./pages/StudentDashboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import CertificatePage from "./pages/CertificatePage";
import NotFound from "./pages/NotFound";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardInternship from "./pages/dashboard/DashboardInternship";
import DashboardAssessments from "./pages/dashboard/DashboardAssessments";
import DashboardTasks from "./pages/dashboard/DashboardTasks";
import DashboardProgress from "./pages/dashboard/DashboardProgress";
import DashboardCertificates from "./pages/dashboard/DashboardCertificates";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import DashboardSupport from "./pages/dashboard/DashboardSupport";

// Admin page imports
import AdminOverview from "./pages/admin/AdminOverview";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminInternships from "./components/admin/AdminInternships";
import AdminBlog from "./components/admin/AdminBlog";
import AdminProjects from "./components/admin/AdminProjects";
import AdminCertifications from "./components/admin/AdminCertifications";
import AdminHistory from "./components/admin/AdminHistory";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
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

  if (isAdmin) {
    return <AdminDashboardLayout />;
  }

  return <DashboardLayout />;
};

const DashboardIndexSelector = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminOverview /> : <DashboardOverview />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardRouter />}>
              {/* Shared dashboard index and profile */}
              <Route index element={<DashboardIndexSelector />} />
              <Route path="profile" element={<DashboardProfile />} />

              {/* Student dashboard routes */}
              <Route path="internship" element={<DashboardInternship />} />
              <Route path="assessments" element={<DashboardAssessments />} />
              <Route path="tasks" element={<DashboardTasks />} />
              <Route path="progress" element={<DashboardProgress />} />
              <Route path="certificates" element={<DashboardCertificates />} />
              <Route path="support" element={<DashboardSupport />} />

              {/* Admin dashboard routes */}
              <Route path="students" element={<AdminStudents />} />
              <Route path="internships" element={<AdminInternships />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="certifications" element={<AdminCertifications />} />
              <Route path="history" element={<AdminHistory />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public routes — wrapped with Header/Footer */}
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<Index />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/history" element={<History />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/student-dashboard-legacy" element={<StudentDashboard />} />
              <Route path="/verify-certificate" element={<VerifyCertificate />} />
              <Route path="/certificate/:id" element={<CertificatePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
