"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ChevronRight, ChevronLeft, UploadCloud, ArrowLeft, Printer } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminNewApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseId: "",
  });

  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    AADHAAR: null,
    TENTH_MARKSHEET: null,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (type: string, file: File | null) => {
    setDocuments({ ...documents, [type]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create application");
      const data = await res.json();
      const newLeadId = data.id;
      setTrackingId(newLeadId);

      // Upload Documents
      const uploadPromises = [];
      for (const [type, file] of Object.entries(documents)) {
        if (file) {
          const fileData = new FormData();
          fileData.append('file', file);
          fileData.append('type', type);
          uploadPromises.push(
            fetch(`http://localhost:3001/api/documents/${newLeadId}/upload`, {
              method: "POST",
              body: fileData,
            })
          );
        }
      }
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      setStep(4);
      toast.success("Application and documents uploaded successfully!");
    } catch (err) {
      toast.error("An error occurred. Check if details already exist or if files are valid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin/applications')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Create New Application</h2>
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
              {step === 4 && "Application Created!"}
            </CardTitle>
            <CardDescription className="text-white/80">
              {step === 1 && "Enter the student's personal details."}
              {step === 2 && "Select the course and academic history."}
              {step === 3 && "Upload the required verification documents."}
              {step === 4 && "The application is now successfully recorded."}
            </CardDescription>
          </CardHeader>

        <CardContent className="pt-6">
          {step === 4 ? (
            <div className="text-center py-8">
              <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Successfully Created!</h3>
              <p className="text-muted-foreground mb-6">The application has been recorded in the system.</p>
              <div className="p-4 bg-card border border-border rounded-lg inline-block">
                <p className="text-sm text-muted-foreground mb-1">Generated Reference ID</p>
                <p className="text-2xl font-mono font-bold text-primary tracking-widest">{trackingId}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-6 print:hidden">
                Print this page and provide it to the student for fee payment.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
                <Button 
                  onClick={() => window.print()}
                  variant="outline" 
                  className="w-full sm:w-auto bg-card border-border text-foreground hover:bg-muted"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print Reference Page
                </Button>
                <Link href="/admin/applications">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">Return to Applications</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">First Name</label>
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="bg-card border-border text-foreground focus-visible:ring-primary" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Select Course</label>
                    <select name="courseId" value={formData.courseId} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
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
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-6 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer group relative">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-foreground font-medium mb-1">Upload Aadhaar Card</h4>
                    <p className="text-xs text-muted-foreground mb-2">PDF, JPG or PNG (Max 5MB)</p>
                    {documents.AADHAAR && <p className="text-xs text-emerald-400 mb-2">Selected: {documents.AADHAAR.name}</p>}
                    <Input type="file" required onChange={(e) => handleFileChange('AADHAAR', e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="mt-2 text-xs font-semibold text-primary cursor-pointer hover:underline">Browse File</span>
                  </div>

                  <div className="p-6 border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer group relative">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-foreground font-medium mb-1">Upload Previous Marksheet</h4>
                    <p className="text-xs text-muted-foreground mb-2">PDF, JPG or PNG (Max 5MB)</p>
                    {documents.TENTH_MARKSHEET && <p className="text-xs text-emerald-400 mb-2">Selected: {documents.TENTH_MARKSHEET.name}</p>}
                    <Input type="file" required onChange={(e) => handleFileChange('TENTH_MARKSHEET', e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="mt-2 text-xs font-semibold text-primary cursor-pointer hover:underline">Browse File</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={step === 1 ? () => window.location.href = '/admin/applications' : prevStep}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground min-w-[120px] shadow-lg">
                  {isSubmitting ? "Processing..." : step === 3 ? "Create Admission" : "Continue"}
                  {!isSubmitting && step < 3 && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
