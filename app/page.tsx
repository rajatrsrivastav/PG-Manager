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
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#111827]">PG Manager</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => router.push("/dashboard")} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg px-5 h-10">
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/signin")} className="text-[#374151] hover:bg-[#F3F4F6] rounded-lg h-10">
                  Sign In
                </Button>
                <Button onClick={() => router.push("/signup")} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg px-5 h-10">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] text-[#374151] text-sm mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            Simple PG Management Solution
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#111827] mb-6 leading-tight">
            Manage Your PG Properties
            <span className="block text-[#111827]">
              With Ease
            </span>
          </h1>
          <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
            Track students, manage fees, send reminders — all from one beautiful dashboard. Built for PG owners who want simplicity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push(user ? "/dashboard" : "/signup")} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-lg px-8 h-12 rounded-lg shadow-sm">
              {user ? "Go to Dashboard" : "Start Free"} <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-[#E5E7EB] rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Multiple PGs</h3>
              <p className="text-[#6B7280] leading-relaxed">Manage all your PG properties from a single dashboard</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Student Records</h3>
              <p className="text-[#6B7280] leading-relaxed">Keep track of all students with their contact details</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-6">
                <CreditCard className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Fee Tracking</h3>
              <p className="text-[#6B7280] leading-relaxed">Track monthly fees and payment status for each student</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] rounded-2xl hover:shadow-md transition-all duration-200">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-6">
                <Bell className="h-7 w-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">Due Reminders</h3>
              <p className="text-[#6B7280] leading-relaxed">Never miss a payment with clear pending fee alerts</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-[#E5E7EB] mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-[#6B7280] text-sm">
          © 2025 PG Manager. Built for PG Owners.
        </div>
      </footer>
    </div>
  );
}
