"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, FileText, DollarSign, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NavLink } from "../../../components/NavLink";
import { Badge } from "@/components/ui/badge";

export default function Applications() {
  const router = useRouter();

  const applications = [
    {
      id: 1,
      name: "Alex Kumar",
      email: "alex@example.com",
      phone: "9876543210",
      status: "Pending",
      submittedAt: "2025-11-15",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "9876543211",
      status: "Approved",
      submittedAt: "2025-11-10",
      approvedAt: "2025-11-12",
    },
    {
      id: 3,
      name: "Rahul Verma",
      email: "rahul@example.com",
      phone: "9876543212",
      status: "Rejected",
      submittedAt: "2025-11-08",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha@example.com",
      phone: "9876543213",
      status: "Pending",
      submittedAt: "2025-11-16",
    },
  ];

  const handleViewDetails = (id: number) => {
    router.push(`/admin/applications/${id}`);
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success text-success-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-warning text-warning-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <NavLink
              to="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <DollarSign className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/applications"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Manage Applications
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
              ← Back to Dashboard
            </Button>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Student Applications</CardTitle>
              <CardDescription>Review and manage all student applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Phone</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Submitted</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{application.name}</td>
                        <td className="py-3 px-4">{application.email}</td>
                        <td className="py-3 px-4">{application.phone}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{application.submittedAt}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Show Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
