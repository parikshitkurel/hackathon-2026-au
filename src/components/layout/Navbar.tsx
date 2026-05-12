"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HackathonLogo } from "@/components/brand/HackathonLogo";

export function Navbar() {
  const router = useRouter();
  const [judgeName, setJudgeName] = useState("Judge");

  useEffect(() => {
    const judge = localStorage.getItem("current_judge");
    if (judge) {
      setJudgeName(JSON.parse(judge).name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("current_judge");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">MIT Pune Campus</span>
            <span className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">at Ujjain | MP</span>
          </div>
          <div className="h-8 w-px bg-border/20 mx-2" />
          <span className="hidden text-sm text-muted-foreground sm:inline-block font-medium">
            Authorized Judge: <span className="font-bold text-foreground">{judgeName}</span>
          </span>
        </div>

        <Link href="/dashboard" className="transition-all hover:opacity-90">
          <HackathonLogo size="sm" />
        </Link>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2 text-muted-foreground hover:text-brand-red hover:bg-brand-red/5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block font-medium">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
