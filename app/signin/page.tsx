"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { user, loading, login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "STUDENT") {
        router.push("/dashboard");
      } else if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, loading, router]);

  const handleGoogleLogin = useCallback(async (credential: string) => {
    if (!credential) {
      showToast("No credential received", "error");
      return;
    }

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returned error (e.g., 404 - user not found)
        showToast("No account found. Please sign up first.", "error");
        return;
      }

      if (data.success && data.user) {
        // Update auth context with user object
        loginWithGoogle(data.user);
        showToast("Logged in successfully!", "success");
      } else {
        showToast("No account found. Please sign up first.", "error");
      }
    } catch (error) {
      console.error("Google login error:", error);
      showToast("No account found. Please sign up first.", "error");
    }
  }, [showToast, loginWithGoogle]);

  useEffect(() => {
    // Load Google Sign-In SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Google Sign-In
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          handleGoogleLogin(response.credential);
        }
      });

      // Render the button or use programmatic sign-in
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };
  }, [handleGoogleLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      await login(formData.email, formData.password);
      showToast("Signed in successfully!", "success");
    } catch (error: unknown) {
      const err = error as Error;
      showToast(err.message || "Invalid credentials", "error");
    }
  };

  return (
     <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div
            id="googleSignInButton"
            className="w-full flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          ></div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
