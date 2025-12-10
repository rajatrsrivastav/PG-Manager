"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowRight } from "lucide-react";

export default function SignIn() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#3B82F6] flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-semibold text-[#111827]">PG Manager</span>
        </div>

        <Card className="bg-white border-[#E5E7EB] rounded-2xl shadow-sm">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-semibold text-[#111827]">Welcome Back</CardTitle>
            <CardDescription className="text-[#6B7280] mt-2">Sign in to your PG Manager account</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-[#374151] font-medium text-sm">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@example.com"
                  className="h-11 rounded-lg border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#374151] font-medium text-sm">Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className="h-11 rounded-lg border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm({ email: "ratneshrsrivastav@gmail.com", password: "123456" })}
                  className="flex-1 h-11 rounded-lg border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151]"
                >
                  Auto Fill
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg shadow-sm"
                >
                  {loading ? "Signing In..." : "Sign In"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
            <p className="text-center text-sm text-[#6B7280] mt-6">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors">
                Sign Up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
