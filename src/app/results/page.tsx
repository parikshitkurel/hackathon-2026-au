"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Download, Trophy, Medal, Star, LayoutGrid, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTeams, Team, mockScores, Score } from "@/lib/mock-data";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { PDFLogo } from "@/components/brand/PDFLogo";
import { generatePDF } from "@/lib/pdf-utils";

interface TeamResult extends Team {
  finalScore: number;
  rank?: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResults() {
      let teamsData: Team[] = [];
      let scoresData: Score[] = [];

      if (!hasSupabaseConfig) {
        teamsData = mockTeams;
        scoresData = mockScores;
      } else {
        try {
          const { data: teams, error: tErr } = await supabase.from('teams').select('*');
          const { data: scores, error: sErr } = await supabase.from('scores').select('*');
          
          if (tErr || sErr) throw tErr || sErr;
          teamsData = teams;
          scoresData = scores;
        } catch (err) {
          console.error("Fetch failed:", err);
          teamsData = mockTeams;
          scoresData = mockScores;
        }
      }

      // Calculate final scores (average if multiple judges, or total)
      const mappedResults = teamsData.map(team => {
        const teamScores = scoresData.filter(s => s.team_id === team.id);
        const avgScore = teamScores.length > 0 
          ? Math.round(teamScores.reduce((acc, s) => acc + (s.total_score || 0), 0) / teamScores.length)
          : 0;
        
        return {
          ...team,
          finalScore: avgScore
        };
      }).sort((a, b) => b.finalScore - a.finalScore);

      // Add rankings
      const rankedResults = mappedResults.map((t, i) => ({ ...t, rank: i + 1 }));
      setResults(rankedResults);
      setLoading(false);
    }

    fetchResults();
  }, []);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    await generatePDF(reportRef.current, `Hackathon_Final_Results_2026`);
  };

  if (loading) return null;

  return (
    <PageWrapper className="container mx-auto px-4 py-8 sm:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-brand-red flex items-center gap-2 mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Final Results</h1>
          <p className="text-muted-foreground mt-2 font-medium">Consolidated leaderboard and evaluation summary for all participating teams.</p>
        </div>
        <Button 
          onClick={handleDownloadReport}
          className="bg-brand-red hover:bg-brand-red/90 text-white font-bold uppercase tracking-widest text-[10px] py-6 px-8 rounded-xl shadow-lg shadow-brand-red/20 gap-2"
        >
          <Download className="h-4 w-4" /> Export PDF Report
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        {/* Top 3 Podium */}
        {results.slice(0, 3).map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden border-none shadow-xl ${index === 0 ? 'bg-slate-900 text-white scale-105 z-10' : 'bg-card'}`}>
              <div className={`absolute top-0 left-0 w-full h-1.5 ${index === 0 ? 'bg-brand-orange' : index === 1 ? 'bg-slate-300' : 'bg-amber-600'}`} />
              <CardHeader className="pt-8 text-center">
                <div className="flex justify-center mb-4">
                  {index === 0 ? <Trophy className="h-12 w-12 text-brand-orange" /> : 
                   index === 1 ? <Medal className="h-10 w-10 text-slate-300" /> : 
                   <Medal className="h-10 w-10 text-amber-600" />}
                </div>
                <CardTitle className="text-2xl font-serif font-bold">{team.team_name}</CardTitle>
                <CardDescription className={index === 0 ? "text-slate-400 font-bold uppercase tracking-widest text-[10px]" : "font-bold uppercase tracking-widest text-[10px]"}>
                  Rank #{team.rank} • {team.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <div className={`text-5xl font-serif font-bold mb-2 ${index === 0 ? 'text-brand-orange' : 'text-brand-red'}`}>
                  {team.finalScore}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Total Aggregate Points</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="w-20 text-center font-bold uppercase tracking-widest text-[10px] py-6">Rank</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6">Team & Project</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6">Category</TableHead>
                <TableHead className="text-center font-bold uppercase tracking-widest text-[10px] py-6">Score</TableHead>
                <TableHead className="text-right font-bold uppercase tracking-widest text-[10px] py-6 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((team) => (
                <TableRow key={team.id} className="group hover:bg-muted/20 transition-colors border-border/5">
                  <TableCell className="text-center font-serif font-bold text-lg py-6">{team.rank}</TableCell>
                  <TableCell className="py-6">
                    <div>
                      <p className="font-bold text-foreground group-hover:text-brand-red transition-colors">{team.team_name}</p>
                      <p className="text-xs text-muted-foreground">{team.project_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <span className="inline-flex items-center rounded-full bg-brand-red/5 px-3 py-1 text-[10px] font-bold text-brand-red uppercase tracking-wider">
                      {team.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="text-xl font-serif font-bold text-brand-red">{team.finalScore}</div>
                  </TableCell>
                  <TableCell className="text-right py-6 pr-8">
                    <Link href={`/evaluate/${team.id}`}>
                      <Button variant="ghost" size="sm" className="hover:text-brand-red hover:bg-brand-red/5 font-bold uppercase tracking-widest text-[10px]">
                        Details <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* HIDDEN REPORT TEMPLATE FOR PDF EXPORT */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        <div ref={reportRef} className="w-[1000px] p-20 bg-white text-slate-900 font-sans" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex justify-between items-center border-b-4 pb-10 mb-12" style={{ borderColor: '#C10016' }}>
            <div>
              <PDFLogo className="scale-150 origin-left" />
              <h2 className="text-5xl font-serif font-bold mt-12 uppercase tracking-tighter" style={{ color: '#C10016' }}>Final Evaluation Summary</h2>
              <p className="text-sm font-bold uppercase tracking-[0.4em] mt-2" style={{ color: '#7E7E82' }}>Official Results Publication • 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl text-center" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Total Participants</p>
              <div className="text-5xl font-serif font-bold">{results.length}</div>
            </div>
            <div className="p-8 rounded-3xl text-center text-white" style={{ backgroundColor: '#C10016' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FFB81C' }}>Top Average Score</p>
              <div className="text-5xl font-serif font-bold">{results[0]?.finalScore || 0}</div>
            </div>
            <div className="bg-slate-100 p-8 rounded-3xl text-center" style={{ backgroundColor: '#f1f5f9' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2" style={{ color: '#94a3b8' }}>Winner</p>
              <div className="text-2xl font-serif font-bold truncate">{results[0]?.team_name || "N/A"}</div>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                <th className="p-6 font-bold uppercase tracking-widest text-[10px]" style={{ color: '#94a3b8' }}>Rank</th>
                <th className="p-6 font-bold uppercase tracking-widest text-[10px]" style={{ color: '#94a3b8' }}>Team Name</th>
                <th className="p-6 font-bold uppercase tracking-widest text-[10px]" style={{ color: '#94a3b8' }}>Theme/Category</th>
                <th className="p-6 text-right font-bold uppercase tracking-widest text-[10px]" style={{ color: '#94a3b8' }}>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((team) => (
                <tr key={team.id} className="border-b" style={{ borderColor: '#f1f5f9' }}>
                  <td className="p-6 font-serif font-bold text-xl">{team.rank}</td>
                  <td className="p-6">
                    <p className="font-bold" style={{ color: '#1e293b' }}>{team.team_name}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>{team.project_name}</p>
                  </td>
                  <td className="p-6 text-sm" style={{ color: '#475569' }}>{team.category}</td>
                  <td className="p-6 text-right">
                    <span className="font-serif font-bold text-2xl" style={{ color: '#C10016' }}>{team.finalScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-20 pt-10 border-t flex justify-between items-end" style={{ borderColor: '#e2e8f0' }}>
            <div className="opacity-50">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Generated By</p>
              <p className="text-sm font-serif font-bold">Avantika Judging System v1.0</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Technical Lead</p>
              <a 
                href="https://www.linkedin.com/in/parikshit-kurel/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-serif font-bold italic hover:underline cursor-pointer" 
                style={{ color: '#C10016' }}
              >
                Parikshit Kurel
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
