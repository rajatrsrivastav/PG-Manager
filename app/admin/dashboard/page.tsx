"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Users, DollarSign, AlertCircle, CheckCircle2, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavLink } from "../../../components/NavLink";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const stats = {
    totalStudents: 45,
    paidThisMonth: 38,
    pendingPayments: 7,
    outstandingAmount: 14000,
  };

  const students = [
    { id: 1, name: "John Doe", month: "November 2025", status: "Pending", amount: 2000, dueDate: "2025-11-30" },
    { id: 2, name: "Jane Smith", month: "November 2025", status: "Paid", amount: 2000, dueDate: "2025-11-30" },
    { id: 3, name: "Mike Johnson", month: "November 2025", status: "Pending", amount: 2000, dueDate: "2025-11-30" },
    { id: 4, name: "Sarah Williams", month: "November 2025", status: "Paid", amount: 2000, dueDate: "2025-11-30" },
    { id: 5, name: "Tom Brown", month: "November 2025", status: "Paid", amount: 2000, dueDate: "2025-11-30" },
  ];

  const handleDelete = (id: number, name: string) => {
    showToast(`Student ${name} removed successfully`, "success");
  };

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully", "success");
  };

  return (
    <ProtectedRoute allowedRole="ADMIN">
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
              end
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

        <main className="flex-1 p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.paidThisMonth}</div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{stats.pendingPayments}</div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">₹{stats.outstandingAmount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Students Payment Table */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Student Fee Payment Management</CardTitle>
              <CardDescription>Manage monthly fee payments for all students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Student Name</th>
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Due Date</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4">{student.month}</td>
                        <td className="py-3 px-4">
                          {student.status === "Paid" ? (
                            <span className="inline-flex items-center gap-1 text-success">
                              <CheckCircle2 className="h-4 w-4" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-warning">
                              <AlertCircle className="h-4 w-4" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">₹{student.amount}</td>
                        <td className="py-3 px-4">{student.dueDate}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student.id, student.name)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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
    </ProtectedRoute>
  );
}
