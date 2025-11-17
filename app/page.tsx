"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "../components/ThemeToggle";
import { Building2, Users, Shield, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      if (user.role === "STUDENT") {
        router.push("/dashboard");
      } else if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      }
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">PG Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => router.push("/signin")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Modern PG Management System
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline your paying guest accommodation management with our comprehensive platform.
            Track payments, manage applications, and maintain student records effortlessly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Student Portal</h3>
              <p className="text-sm text-muted-foreground">
                Easy registration, payment tracking, and profile management for students
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive control panel for managing applications and payments
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Payment Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track monthly payments, dues, and maintain complete payment history
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Application Review</h3>
              <p className="text-sm text-muted-foreground">
                Review and approve student applications with document verification
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
