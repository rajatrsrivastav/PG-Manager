"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, CreditCard, Bell, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PG Manager</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => router.push("/dashboard")} variant="default">
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/signin")}>
                  Sign In
                </Button>
                <Button onClick={() => router.push("/signup")} variant="default">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            Simple PG Management Solution
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Manage Your PG Properties
            <span className="block text-foreground">
              With Ease
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Track students, manage fees, send reminders — all from one beautiful dashboard. Built for PG owners who want simplicity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push(user ? "/dashboard" : "/signup")} className="text-lg px-8">
              {user ? "Go to Dashboard" : "Start Free"} <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border hover:border-foreground/20 transition-colors">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Multiple PGs</h3>
              <p className="text-muted-foreground">Manage all your PG properties from a single dashboard</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-foreground/20 transition-colors">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Student Records</h3>
              <p className="text-muted-foreground">Keep track of all students with their contact details</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-foreground/20 transition-colors">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <CreditCard className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Fee Tracking</h3>
              <p className="text-muted-foreground">Track monthly fees and payment status for each student</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-foreground/20 transition-colors">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Bell className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Due Reminders</h3>
              <p className="text-muted-foreground">Never miss a payment with clear pending fee alerts</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border mt-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          © 2025 PG Manager. Built for PG Owners.
        </div>
      </footer>
    </div>
  );
}
