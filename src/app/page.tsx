"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HackathonLogo } from "@/components/brand/HackathonLogo";
import { AUTHORIZED_JUDGES } from "@/config/auth";
import { initializeJudges, fetchJudgesFromSupabase, initializeTeams } from "@/lib/persistence";
import { mockTeams } from "@/lib/mock-data";

export default function RootPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    initializeJudges(AUTHORIZED_JUDGES);
    initializeTeams(mockTeams);
  }, []);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // 3.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(async () => {
      const judges = await fetchJudgesFromSupabase();
      const judge = judges.find(
        (j) => j.email === email && j.password === password
      );

      if (judge) {
        if (!judge.active) {
          setError("This account has been deactivated by the administrator.");
          setIsLoading(false);
          return;
        }

        localStorage.setItem("current_judge", JSON.stringify(judge));
        
        if (judge.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFCF8] p-4"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-[#C10016] blur-[150px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-[#FF6900] blur-[150px] rounded-full" />
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-col items-center space-y-20"
            >
              <div className="mb-16 scale-150 origin-center">
                <HackathonLogo size="lg" />
              </div>
              
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="h-px w-24 bg-brand-red mx-auto mb-8"
                />
                
                <div className="space-y-2">
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-sm font-bold uppercase tracking-[0.4em] text-brand-grey"
                  >
                    University Level
                  </motion.h2>
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="text-6xl font-serif font-bold text-[#1A1A1A]"
                  >
                    Welcome <span className="text-brand-red italic">Judges</span>
                  </motion.h1>
                </div>
              </div>

            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg z-10 p-4"
          >
            <div className="flex justify-center mb-12">
              <HackathonLogo size="lg" />
            </div>
            
            <Card className="border-border/50 shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow" />
              <CardHeader className="space-y-1 text-center p-8 pb-4">
                <CardTitle className="text-3xl font-serif font-bold tracking-tight">Judging Panel</CardTitle>
                <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                  Authorized Access Only
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive text-xs font-bold flex items-center gap-3"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}
                  <div className="space-y-3 text-left">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Official Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="judge@avantika.edu.in" 
                      required 
                      className="bg-muted/30 border-none h-12 rounded-xl focus-visible:ring-brand-red/30 px-5"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Access Key</Label>
                    </div>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="bg-muted/30 border-none h-12 rounded-xl focus-visible:ring-brand-red/30 px-5 pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-brand-red/20 gap-3" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Authenticating
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Secure Sign In <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
                <div className="h-px w-full bg-border/5" />
                <div className="flex items-center justify-between w-full opacity-60">
                  <div className="text-[8px] font-black uppercase tracking-[0.3em]">Creative Coding Hackathon 2026</div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
