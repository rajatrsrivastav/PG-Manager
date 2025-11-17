"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, FileText, DollarSign, Check, X, ExternalLink } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { NavLink } from "../../../../components/NavLink";
import { Badge } from "@/components/ui/badge";

export default function ApplicationDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const application = {
    id: parseInt(id || "1"),
    name: "Alex Kumar",
    email: "alex@example.com",
    phone: "9876543210",
    address: "123 College Street, Mumbai, Maharashtra 400001",
    password: "********",
    emergencyContactName: "Rajesh Kumar",
    emergencyContactNumber: "9876543220",
    collegeIdUrl: "https://placehold.co/600x400/e2e8f0/64748b?text=College+ID+Card",
    status: "Pending",
    submittedAt: "2025-11-15 14:30:00",
    approvedBy: null,
    approvedAt: null,
  };

  const handleApprove = () => {
    toast.success(`Application for ${application.name} approved successfully`);
    setTimeout(() => router.push("/admin/applications"), 1500);
  };

  const handleReject = () => {
    toast.error(`Application for ${application.name} rejected`);
    setTimeout(() => router.push("/admin/applications"), 1500);
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
            <Button variant="outline" onClick={() => router.push("/admin/applications")}>
              ← Back to Applications
            </Button>
          </div>

          <div className="space-y-6">
            {/* Header Card */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{application.name}</CardTitle>
                    <CardDescription>Application ID: #{application.id}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Personal Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{application.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{application.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-semibold">{application.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Current Address</p>
                    <p className="font-semibold">{application.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Name</p>
                    <p className="font-semibold">{application.emergencyContactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Number</p>
                    <p className="font-semibold">{application.emergencyContactNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Documents */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">College ID Card</p>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <img
                      src={application.collegeIdUrl}
                      alt="College ID"
                      className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(application.collegeIdUrl, "_blank")}
                    />
                    <Button
                      variant="link"
                      className="mt-2 p-0"
                      onClick={() => window.open(application.collegeIdUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Metadata */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted At</p>
                    <p className="font-semibold">{application.submittedAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{application.status}</p>
                  </div>
                  {application.approvedBy && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved By</p>
                        <p className="font-semibold">{application.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approved At</p>
                        <p className="font-semibold">{application.approvedAt}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {application.status === "Pending" && (
              <div className="flex gap-4">
                <Button onClick={handleApprove} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button onClick={handleReject} variant="destructive" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
