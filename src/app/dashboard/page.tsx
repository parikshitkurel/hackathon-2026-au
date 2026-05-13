"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle2, CircleDashed, Users, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { mockTeams, Team } from "@/lib/mock-data";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { getEvaluatedTeamIds, fetchTeamsFromSupabase } from "@/lib/persistence";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    async function fetchTeams() {
      const judgeData = localStorage.getItem("current_judge");
      const judgeId = judgeData ? JSON.parse(judgeData).id : null;

      try {
        const data = await fetchTeamsFromSupabase();
        const evaluatedIds = getEvaluatedTeamIds(judgeId);

        const mappedTeams = data.map(t => {
          const isEvaluated = evaluatedIds.includes(t.id) || 
                             evaluatedIds.includes(t.team_name.replace(/\s+/g, '-')) ||
                             evaluatedIds.includes(t.team_name);
          return {
            ...t,
            status: (isEvaluated ? 'evaluated' : (t.status || 'pending')) as 'pending' | 'evaluated'
          };
        });

        setTeams(mappedTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);
  
  const uniqueThemes = ["All Themes", ...Array.from(new Set(teams.map(t => t.category)))];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.project_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = selectedTheme === "All Themes" || team.category === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const evaluatedCount = teams.filter(t => t.status === "evaluated").length;
  const pendingCount = teams.filter(t => t.status === "pending").length;

  if (loading) {
    return (
      <PageWrapper className="container mx-auto px-4 py-8 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-8 border-b border-border/5">
          <div className="space-y-2">
            <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded-md" />
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-64 bg-muted animate-pulse rounded-xl" />
            <div className="h-12 w-12 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>

        <div className="grid gap-6 mb-12 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-3xl" />
          ))}
        </div>

        <div className="space-y-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-muted/30 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 sm:px-8">
      {/* Header Section */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/5 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Evaluations</h1>
          <p className="text-muted-foreground mt-2 font-medium">Review and score teams for the <span className="text-brand-red">Creative Coding Hackathon</span>.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search teams..." 
              className="pl-10 bg-background border-border/20 shadow-sm focus-visible:ring-brand-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Button 
              variant={selectedTheme !== "All Themes" ? "default" : "outline"} 
              size="icon" 
              onClick={() => setShowFilter(!showFilter)}
              className={`shrink-0 border-border/20 shadow-sm transition-all duration-300 ${
                selectedTheme !== "All Themes" 
                ? 'bg-brand-red hover:bg-brand-red/90 text-white' 
                : 'bg-background hover:border-brand-red hover:text-brand-red'
              }`}
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            {showFilter && (
              <div className="absolute right-0 mt-2 w-64 z-50 bg-card border border-border/10 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-2 border-b border-border/5 mb-1">
                  Filter by Theme
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {uniqueThemes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setSelectedTheme(theme);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                        selectedTheme === theme 
                        ? 'bg-brand-red/10 text-brand-red font-semibold' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{theme}</span>
                      {selectedTheme === theme && <div className="h-1.5 w-1.5 rounded-full bg-brand-red" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-12 sm:grid-cols-3">
        {[
          { label: "Total Assigned", value: teams.length, icon: Users, color: "bg-brand-red", textColor: "text-brand-red" },
          { label: "Evaluated", value: evaluatedCount, icon: CheckCircle2, color: "bg-brand-orange", textColor: "text-brand-orange" },
          { label: "Pending", value: pendingCount, icon: CircleDashed, color: "bg-brand-yellow", textColor: "text-brand-yellow" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-card border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden relative group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${stat.color}`} />
              <CardContent className="flex items-center justify-between p-7">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="text-4xl font-serif font-bold">{stat.value}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/30 group-hover:bg-muted/50 transition-colors ${stat.textColor}`}>
                  <stat.icon className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {!hasSupabaseConfig && (
        <div className="mb-10 p-5 rounded-xl bg-brand-yellow/5 border border-brand-yellow/20 text-brand-grey flex items-center gap-4 text-sm shadow-sm backdrop-blur-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow/10">
            <CircleDashed className="h-5 w-5 text-brand-yellow" />
          </div>
          <p className="leading-relaxed">
            <span className="font-bold text-foreground">Offline Preview Mode</span> — Showing curated competition data. 
            Connect Supabase to fetch live submissions from the <span className="font-semibold text-brand-red">Avantika University</span> database.
          </p>
        </div>
      )}

      {/* Teams Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold tracking-tight">Your assigned submissions</h2>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
            <span>{filteredTeams.length} Teams</span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-4 pt-8">
                  <div className="flex items-start justify-between">
                    <div className="inline-flex items-center rounded-md bg-brand-red/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-red">
                      {team.category}
                    </div>
                    {team.status === 'evaluated' ? (
                      <CheckCircle2 className="h-4 w-4 text-brand-orange" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-brand-yellow animate-pulse" />
                    )}
                  </div>
                  <CardTitle className="text-2xl font-serif mt-4 leading-tight group-hover:text-brand-red transition-colors">{team.project_name}</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">by {team.team_name}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-6 pb-6">
                  <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3">
                    {team.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-border/5 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-brand-grey" />
                        <span>{team.members} members</span>
                      </div>
                      {team.member_names && (
                        <div className="text-[10px] text-muted-foreground/60 italic truncate max-w-[200px]">
                          {team.member_names.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/evaluate/${team.id}`} className="w-full">
                    <Button 
                      variant={team.status === 'evaluated' ? "secondary" : "default"} 
                      className={`w-full py-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${
                        team.status === 'evaluated' 
                        ? 'bg-muted/50 hover:bg-brand-orange/10 hover:text-brand-orange border-none shadow-none' 
                        : 'bg-brand-red hover:bg-brand-red/90 shadow-lg shadow-brand-red/20'
                      }`}
                    >
                      {team.status === 'evaluated' ? 'Review scores' : 'Start scoring'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {filteredTeams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 text-muted-foreground mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium">No teams found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
