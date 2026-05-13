"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  ArrowRight, 
  Download, 
  Search, 
  Users, 
  ExternalLink, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTeams, Team, mockScores, Score } from "@/lib/mock-data";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { PDFLogo } from "@/components/brand/PDFLogo";
import { generatePDF } from "@/lib/pdf-utils";
import { getEvaluations } from "@/lib/persistence";

interface TeamResult extends Team {
  finalScore: number;
  rank: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let scoresData: Score[] = [];
        
        if (hasSupabaseConfig) {
          const { data } = await supabase.from('scores').select('*');
          if (data) scoresData = data;
        } else {
          const localEvals = getEvaluations();
          const localScores: Score[] = Object.values(localEvals).map(ev => ({
            id: `local-${ev.teamId}`,
            team_id: ev.teamId,
            judge_id: "local-judge",
            creativity_score: ev.scores.creativity_score || 0,
            technical_score: ev.scores.technical_score || 0,
            design_score: ev.scores.design_score || 0,
            theme_score: ev.scores.theme_score || 0,
            engagement_score: ev.scores.engagement_score || 0,
            total_score: Object.values(ev.scores).reduce((a, b) => a + b, 0),
            feedback: ev.feedback,
            submitted_at: ev.submittedAt,
            edit_count: 0
          }));
          scoresData = [...mockScores, ...localScores];
        }

        // Aggregate scores per team
        const teamAverages = mockTeams.map(team => {
          const teamScores = scoresData.filter(s => s.team_id === team.id);
          const total = teamScores.reduce((acc, s) => {
            return acc + s.creativity_score + s.technical_score + s.design_score + s.theme_score + s.engagement_score;
          }, 0);
          
          const average = teamScores.length > 0 ? Math.round(total / teamScores.length) : 0;
          
          return {
            ...team,
            finalScore: average
          };
        });

        // Sort and rank
        const sorted = teamAverages.sort((a, b) => b.finalScore - a.finalScore).map((t, i) => ({
          ...t,
          rank: i + 1
        }));

        setResults(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  const handleExportReport = async () => {
    if (!reportRef.current) return;
    await generatePDF(reportRef.current, "Final_Hackathon_Results_2026");
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Calculating Results...</p>
        </div>
      </PageWrapper>
    );
  }

  const podium = results.slice(0, 3);

  return (
    <PageWrapper className="container mx-auto px-4 py-12 sm:px-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-[10px] font-bold uppercase tracking-widest mb-4">
            <Trophy className="h-3 w-3" /> Live Standings
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tighter text-foreground mb-4">
            The <span className="text-brand-red italic">Leaderboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Final aggregate scores calculated from all judge evaluations across five core innovation categories.
          </p>
        </div>
        <Button 
          onClick={handleExportReport}
          className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-2xl shadow-slate-900/20"
        >
          <Download className="h-4 w-4" /> Export Results Report
        </Button>
      </div>

      {/* Podium Display */}
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {podium.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-none shadow-2xl rounded-[2.5rem] overflow-hidden ${index === 0 ? 'bg-slate-900 text-white scale-105 z-10' : 'bg-card'}`}>
              <div className={`h-2 w-full ${index === 0 ? 'bg-brand-orange' : index === 1 ? 'bg-slate-300' : 'bg-amber-600'}`} />
              <CardHeader className="text-center pt-10">
                <div className="flex justify-center mb-6">
                  {index === 0 ? <Trophy className="h-16 w-16 text-brand-yellow" /> : 
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
      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden mb-20">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="w-20 text-center font-bold uppercase tracking-widest text-[10px] py-6">Rank</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6 min-w-[200px]">Team & Project</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6 hidden sm:table-cell">Category</TableHead>
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
                  <TableCell className="py-6 hidden sm:table-cell">
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
                <th className="py-6 px-4 font-bold uppercase tracking-widest text-[10px]">Rank</th>
                <th className="py-6 px-4 font-bold uppercase tracking-widest text-[10px]">Team Name</th>
                <th className="py-6 px-4 font-bold uppercase tracking-widest text-[10px]">Project</th>
                <th className="py-6 px-4 font-bold uppercase tracking-widest text-[10px] text-right">Final Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((team, index) => (
                <tr key={team.id} className="border-b" style={{ borderColor: '#f1f5f9' }}>
                  <td className="py-6 px-4 font-serif font-bold text-xl">#{team.rank}</td>
                  <td className="py-6 px-4 font-bold">{team.team_name}</td>
                  <td className="py-6 px-4 text-slate-500">{team.project_name}</td>
                  <td className="py-6 px-4 text-right font-serif font-bold text-2xl" style={{ color: '#C10016' }}>{team.finalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-20 pt-10 border-t flex justify-between items-center" style={{ borderColor: '#e2e8f0' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Published via Avantika Hackathon Systems</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Official Hackathon System</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
