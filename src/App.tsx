import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import LayoutWrapper from "./components/LayoutWrapper";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
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
import AdminDashboard from "./pages/AdminDashboard";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Dashboard routes — sidebar layout, no Header/Footer */}
            <Route path="/student-dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="internship" element={<DashboardInternship />} />
              <Route path="assessments" element={<DashboardAssessments />} />
              <Route path="tasks" element={<DashboardTasks />} />
              <Route path="progress" element={<DashboardProgress />} />
              <Route path="certificates" element={<DashboardCertificates />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="support" element={<DashboardSupport />} />
            </Route>

            {/* Public routes — wrapped with Header/Footer */}
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<Index />} />
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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
