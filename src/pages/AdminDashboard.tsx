import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminCertifications from "@/components/admin/AdminCertifications";
import AdminHistory from "@/components/admin/AdminHistory";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminInternships from "@/components/admin/AdminInternships";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState("blog");

  if (loading) return (
    <div className="py-24">
      <div className="container mx-auto px-4 space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-10 w-96 bg-muted rounded animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />))}
        </div>
      </div>
    </div>
  );
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="blog"><AdminBlog /></TabsContent>
          <TabsContent value="projects"><AdminProjects /></TabsContent>
          <TabsContent value="certifications"><AdminCertifications /></TabsContent>
          <TabsContent value="history"><AdminHistory /></TabsContent>
          <TabsContent value="internships"><AdminInternships /></TabsContent>
          <TabsContent value="users"><AdminUsers /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
