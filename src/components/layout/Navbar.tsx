"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Home, Trophy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HackathonLogo } from "@/components/brand/HackathonLogo";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [judgeName, setJudgeName] = useState("Judge");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const judge = localStorage.getItem("current_judge");
    if (judge) {
      try {
        const parsed = JSON.parse(judge);
        setJudgeName(parsed.name);
        setIsAdmin(parsed.role === "admin");
      } catch (e) {
        setJudgeName("Judge");
        setIsAdmin(false);
      }
    }
  }, []);

  // Hide Navbar on the landing page or admin pages (which have their own sidebar)
  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  const handleLogout = () => {
    localStorage.removeItem("current_judge");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">MIT Pune Campus</span>
            <span className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">at Ujjain | MP</span>
          </div>
          <div className="h-8 w-px bg-border/20 mx-2" />
          <span className="hidden text-xs text-muted-foreground sm:inline-block font-medium">
            Authorized Judge: <span className="font-bold text-foreground">{judgeName}</span>
          </span>
        </div>

        <Link href="/dashboard" className="transition-all hover:opacity-90 absolute left-1/2 -translate-x-1/2">
          <HackathonLogo size="sm" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className={`gap-2 text-[10px] font-bold uppercase tracking-widest ${pathname === '/dashboard' ? 'text-brand-red bg-brand-red/5' : 'text-muted-foreground'}`}>
              <Home className="h-3 w-3" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/results">
            <Button variant="ghost" size="sm" className={`gap-2 text-[10px] font-bold uppercase tracking-widest ${pathname === '/results' ? 'text-brand-red bg-brand-red/5' : 'text-muted-foreground'}`}>
              <Trophy className="h-3 w-3" />
              <span className="hidden md:inline">Leaderboard</span>
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:bg-brand-orange/5">
                <ShieldCheck className="h-3 w-3" />
                <span className="hidden md:inline">Admin Panel</span>
              </Button>
            </Link>
          )}
          <div className="h-4 w-px bg-border/20 mx-1" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2 text-muted-foreground hover:text-brand-red hover:bg-brand-red/5 text-[10px] font-bold uppercase tracking-widest"
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden sm:inline-block">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
