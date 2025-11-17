"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, CreditCard, User, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function StudentDashboard() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  
  const paymentStatus = {
    currentMonth: "November 2025",
    isPaid: false,
    amount: 2000,
    dueDate: "2025-11-30",
    outstandingDues: 0,
  };

  const paymentHistory = [
    { month: "October 2025", status: "Paid", amount: 2000, date: "2025-10-05" },
    { month: "September 2025", status: "Paid", amount: 2000, date: "2025-09-03" },
    { month: "August 2025", status: "Paid", amount: 2000, date: "2025-08-07" },
  ];

  const studentProfile = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    address: "123 Main Street, City",
    emergencyContact: "Jane Doe - 9876543211",
  };

  const handlePayment = () => {
    if (paymentStatus.isPaid) {
      showToast("You have already paid for this month!", "error");
      return;
    }
    showToast("Payment processing... This is a demo.", "success");
  };

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully", "success");
  };

  return (
    <ProtectedRoute allowedRole="STUDENT">
      <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Status
            </CardTitle>
            <CardDescription>Current month payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Month</p>
                <p className="text-lg font-semibold">{paymentStatus.currentMonth}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  {paymentStatus.isPaid ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-success font-semibold">Paid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="text-destructive font-semibold">Pending</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-lg font-semibold">₹{paymentStatus.amount}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-lg font-semibold">{paymentStatus.dueDate}</p>
              </div>
            </div>
            {paymentStatus.outstandingDues > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-semibold text-destructive">
                  Outstanding Dues: ₹{paymentStatus.outstandingDues}
                </p>
              </div>
            )}
            <Button 
              onClick={handlePayment} 
              className="w-full"
              disabled={paymentStatus.isPaid}
            >
              {paymentStatus.isPaid ? "Already Paid" : `Pay ₹${paymentStatus.amount} Online`}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Month</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4">{payment.month}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">₹{payment.amount}</td>
                      <td className="py-3 px-4">{payment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-semibold">{studentProfile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{studentProfile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{studentProfile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold">{studentProfile.address}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p className="font-semibold">{studentProfile.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </ProtectedRoute>
  );
}
