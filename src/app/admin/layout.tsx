"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  LogOut, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HackathonLogo } from "@/components/brand/HackathonLogo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const judgeData = localStorage.getItem("current_judge");
    if (!judgeData) {
      router.push("/");
      return;
    }

    const judge = JSON.parse(judgeData);
    if (judge.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setIsAdmin(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("current_judge");
    router.push("/");
  };

  if (!isAdmin) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Evaluations", href: "/admin/evaluations", icon: ClipboardCheck },
    { name: "Judges", href: "/admin/judges", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-slate-900 text-white fixed h-full z-50">
        <div className="p-8">
          <HackathonLogo variant="vertical" className="brightness-0 invert" />
          <div className="mt-6 flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Control Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-6">
        <HackathonLogo size="sm" />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-40 pt-20 px-6">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center gap-4 py-4 text-slate-400">
                  <item.icon className="h-6 w-6" />
                  <span className="text-lg font-bold uppercase tracking-widest">{item.name}</span>
                </div>
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 py-4 text-brand-red"
            >
              <LogOut className="h-6 w-6" />
              <span className="text-lg font-bold uppercase tracking-widest">Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 pt-24 md:pt-12">
        {children}
      </main>
    </div>
  );
}
