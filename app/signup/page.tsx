"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "../../components/ThemeToggle";
import { Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    collegeId: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, collegeId: e.target.files[0] });
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        toast.error("Please fill all personal information fields");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email");
        return false;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error("Please fill all security fields");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.emergencyContactName || !formData.emergencyContactNumber) {
        toast.error("Please fill all emergency contact fields");
        return false;
      }
      if (!/^\d{10}$/.test(formData.emergencyContactNumber)) {
        toast.error("Please enter a valid 10-digit emergency contact number");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.collegeId) {
        toast.error("Please upload your college ID card");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      toast.success("Application submitted successfully! Please wait for approval.");
      setTimeout(() => router.push("/signin"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Student Registration</CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <Label htmlFor="address">Current Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your current address"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Account Security</h3>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Emergency Contact</h3>
              <div>
                <Label htmlFor="emergencyContactName">Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Emergency contact person name"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactNumber">Contact Number *</Label>
                <Input
                  id="emergencyContactNumber"
                  name="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit emergency contact number"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Document Upload</h3>
              <div>
                <Label htmlFor="collegeId">College ID Card *</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formData.collegeId ? formData.collegeId.name : "Click to upload or drag and drop"}
                  </p>
                  <Input
                    id="collegeId"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={handleNext} className="ml-auto">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto">
                Create Account
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
