"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Laptop, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] opacity-60 mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Graphic Era Logo" className="h-12 w-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[#901f2f] leading-none">Graphic Era</span>
            <span className="text-sm font-medium text-gray-600 leading-none">Deemed to be University</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Academics</Link>
          <Link href="#" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Programs</Link>
          <Link href="#" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Campus Life</Link>
          <Link href="#" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Research</Link>
          <Link href="/login">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/5 rounded-full px-6">Admissions</Button>
          </Link>
        </nav>
      </header>

      {/* Dark Blue Admissions Banner */}
      <div className="w-full bg-primary py-4 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between shadow-md relative z-10">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-2xl font-bold text-white tracking-tight">Admissions 2026</span>
          <Link href="#" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">Scholarships</Link>
          <Link href="#" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">Eligibility & Fee Structure</Link>
          <Link href="#" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">Admission Process</Link>
          <Link href="#" className="text-sm font-semibold text-white/90 hover:text-white transition-colors">FAQs</Link>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-none font-semibold rounded-md">
            Download Brochure
          </Button>
          <Link href="/apply">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-lg rounded-md px-8">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center py-32 lg:py-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Admissions for 2026-27 are now open
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
            Shape Your Future at <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
              Graphic Era University
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience world-class education, state-of-the-art facilities, and a global community. 
            Begin your journey towards excellence today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/apply">
              <Button size="lg" className="h-14 px-8 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/25 transition-all w-full sm:w-auto">
                Start Application <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/status">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white border-border text-foreground hover:bg-gray-50 w-full sm:w-auto">
                Check Status
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full">
          {[
            { icon: Laptop, title: "Modern Campus", desc: "Equipped with the latest technology and learning labs." },
            { icon: Users, title: "Expert Faculty", desc: "Learn from industry leaders and experienced professors." },
            { icon: GraduationCap, title: "100% Placement", desc: "Guaranteed placement assistance for all top graduates." }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="flex flex-col items-center p-8 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
