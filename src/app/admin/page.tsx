"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Trophy, Search, CircleDashed } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTeams, mockScores, Team, Score } from "@/lib/mock-data";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!hasSupabaseConfig) {
        setTeams(mockTeams);
        setScores(mockScores);
        setLoading(false);
        return;
      }

      try {
        const [teamsResponse, scoresResponse] = await Promise.all([
          supabase.from('teams').select('*'),
          supabase.from('scores').select('*')
        ]);

        if (teamsResponse.error) throw teamsResponse.error;
        if (scoresResponse.error) throw scoresResponse.error;

        setTeams(teamsResponse.data as Team[]);
        setScores(scoresResponse.data as Score[]);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setTeams(mockTeams);
        setScores(mockScores);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Aggregate scores for the leaderboard
  const leaderboard = teams.map(team => {
    const teamScores = scores.filter(s => s.team_id === team.id);
    const avgScore = teamScores.length > 0 
      ? Math.round(teamScores.reduce((acc, curr) => acc + curr.total_score, 0) / teamScores.length)
      : 0;
      
    return {
      ...team,
      avgScore,
      evaluations: teamScores.length
    };
  })
  .filter(team => team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) || team.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => b.avgScore - a.avgScore);

  if (loading) {
    return (
      <PageWrapper className="container mx-auto px-4 py-8 sm:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading admin data...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Global leaderboard and judging analytics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-background">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {!hasSupabaseConfig && (
        <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center gap-3 text-sm">
          <CircleDashed className="h-5 w-5 shrink-0" />
          <p>Running in offline mode. Add Supabase credentials to `.env.local` to view live judging analytics.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leaderboard[0]?.avgScore || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{leaderboard[0]?.project_name || 'N/A'}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{scores.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all judges</p>
          </CardContent>
        </Card>
        {/* Add more stats cards as needed */}
      </div>

      <Card className="border-border/60 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4 bg-muted/10">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Leaderboard
            </CardTitle>
            <CardDescription className="mt-1">Real-time ranking of all teams</CardDescription>
          </div>
          <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search teams..." 
              className="pl-9 bg-background/50 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-border/40">
                <TableHead className="w-16 text-center font-semibold">Rank</TableHead>
                <TableHead className="font-semibold">Project & Team</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="text-center font-semibold">Evaluations</TableHead>
                <TableHead className="text-right font-semibold">Avg Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((team, index) => (
                <TableRow key={team.id} className="group hover:bg-muted/20 transition-colors">
                  <TableCell className="text-center font-medium">
                    {index === 0 ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-600 font-bold">1</span>
                    ) : index === 1 ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-400/20 text-slate-600 font-bold">2</span>
                    ) : index === 2 ? (
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-orange-700/20 text-orange-800 font-bold">3</span>
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{team.project_name}</div>
                    <div className="text-sm text-muted-foreground">{team.team_name}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-border/50 bg-background/50 px-2 py-0.5 text-xs">
                      {team.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {team.evaluations}
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {team.avgScore > 0 ? team.avgScore : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {leaderboard.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageWrapper>
  );
}
