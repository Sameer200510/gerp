"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, CreditCard, LogOut, Settings } from "lucide-react";

const navItems = [
  { name: "Applications", href: "/admin/applications", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden w-64 flex-col border-r border-border bg-card border-r border-border backdrop-blur-xl md:flex"
      >
        <div className="flex h-16 items-center px-6 border-b border-border gap-2">
          <img src="/logo.png" alt="Graphic Era Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Graphic Era
          </span>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-md"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-black/20 backdrop-blur-md px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find((n) => pathname.startsWith(n.href))?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
              <span className="text-sm font-bold text-primary">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
