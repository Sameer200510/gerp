"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ChevronRight, ChevronLeft, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    // Mock API Call
    setTimeout(() => {
      setTrackingId("APP" + Math.floor(Math.random() * 1000000));
      setStep(4);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="z-10 w-full max-w-2xl">
        <div className="mb-8 flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Graphic Era Logo" className="h-12 w-12 object-contain" />
          <Link href="/" className="text-2xl font-bold text-primary">
            Graphic Era University
          </Link>
        </div>

        <Card className="bg-card border-border backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center border-b border-border pb-6 bg-primary rounded-t-xl text-primary-foreground pt-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${step >= s ? 'bg-secondary text-secondary-foreground' : 'bg-primary-foreground/20 text-white'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 mx-2 rounded-full transition-colors ${step > s ? 'bg-secondary' : 'bg-primary-foreground/20'}`} />}
                </div>
              ))}
            </div>
            <CardTitle className="text-2xl text-white">
              {step === 1 && "Personal Information"}
              {step === 2 && "Academic Details"}
              {step === 3 && "Document Upload"}
              {step === 4 && "Application Submitted!"}
            </CardTitle>
            <CardDescription className="text-white/80">
              {step === 1 && "Tell us about yourself."}
              {step === 2 && "What are you applying for?"}
              {step === 3 && "Upload your verification documents."}
              {step === 4 && "Your application is under review."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {step === 4 ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-6">Your application has been received successfully.</p>
                <div className="p-4 bg-card border border-border rounded-lg inline-block">
                  <p className="text-sm text-muted-foreground mb-1">Your Tracking ID</p>
                  <p className="text-2xl font-mono font-bold text-primary tracking-widest">{trackingId}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  You can use this ID to track your application status.
                </p>
                <div className="mt-8">
                  <Link href="/status">
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">Track Status</Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                        <Input required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                        <Input required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <Input type="email" required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <Input type="tel" required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Select Course</label>
                      <select required className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option value="" className="text-black">Select a course...</option>
                        <option value="btech" className="text-black">B.Tech Computer Science</option>
                        <option value="bba" className="text-black">Bachelor of Business Admin</option>
                        <option value="mba" className="text-black">Master of Business Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Previous School/College</label>
                      <Input required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Percentage / CGPA</label>
                      <Input type="number" required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="p-6 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-foreground font-medium mb-1">Upload Aadhaar Card</h4>
                      <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                      <Input type="file" required className="hidden" id="aadhaar" />
                      <label htmlFor="aadhaar" className="mt-4 text-xs font-semibold text-primary cursor-pointer hover:underline">Browse File</label>
                    </div>

                    <div className="p-6 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-foreground font-medium mb-1">Upload Previous Marksheet</h4>
                      <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                      <Input type="file" required className="hidden" id="marksheet" />
                      <label htmlFor="marksheet" className="mt-4 text-xs font-semibold text-primary cursor-pointer hover:underline">Browse File</label>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={step === 1 ? () => window.location.href = '/' : prevStep}
                    disabled={isSubmitting}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground min-w-[120px] shadow-lg">
                    {isSubmitting ? "Processing..." : step === 3 ? "Submit Application" : "Continue"}
                    {!isSubmitting && step < 3 && <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
