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
        const { data: dbEvaluations } = await supabase
          .from('evaluations')
          .select('*');

        const localEvals = getEvaluations();
        
        // Combine both, preferring DB if available
        const combinedEvals: Record<string, any> = { ...localEvals };
        if (dbEvaluations) {
          dbEvaluations.forEach(ev => {
            combinedEvals[ev.team_id] = {
              teamId: ev.team_id,
              scores: {
                creativity_score: ev.creativity_score,
                technical_score: ev.technical_score,
                design_score: ev.design_score,
                theme_score: ev.theme_score,
                engagement_score: ev.engagement_score,
              },
              feedback: ev.feedback
            };
          });
        }

        const teamAverages = mockTeams.map(team => {
          const evaluation = combinedEvals[team.id];
          const totalScore = evaluation ? 
            (evaluation.scores.creativity_score || 0) +
            (evaluation.scores.technical_score || 0) +
            (evaluation.scores.design_score || 0) +
            (evaluation.scores.theme_score || 0) +
            (evaluation.scores.engagement_score || 0) : 0;
          
          return {
            ...team,
            finalScore: totalScore,
            status: (evaluation ? 'evaluated' : 'pending') as 'pending' | 'evaluated'
          };
        });

        const sorted = teamAverages.sort((a, b) => b.finalScore - a.finalScore).map((t, i) => ({
          ...t,
          rank: i + 1
        }));

        setResults(sorted);
      } catch (err) {
        console.error("Error fetching results:", err);
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
        <div 
          ref={reportRef} 
          style={{
            width: "1000px",
            padding: "80px",
            backgroundColor: "#ffffff",
            color: "#1A1A1A",
            fontFamily: "sans-serif"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "4px solid #C10016", paddingBottom: "40px", marginBottom: "50px" }}>
            <div>
              <PDFLogo style={{ transform: "scale(1.5)", transformOrigin: "left" }} />
              <h2 style={{ fontSize: "48px", fontFamily: "serif", fontWeight: "bold", marginTop: "48px", textTransform: "uppercase", letterSpacing: "-0.02em", color: "#C10016", margin: "48px 0 0 0" }}>Final Evaluation Summary</h2>
              <p style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.4em", marginTop: "8px", color: "#7E7E82" }}>Official Results Publication • 2026</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", marginBottom: "64px" }}>
            <div style={{ padding: "32px", borderRadius: "24px", textAlign: "center", backgroundColor: "#0f172a", color: "#ffffff" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", color: "#94a3b8" }}>Total Participants</p>
              <div style={{ fontSize: "48px", fontFamily: "serif", fontWeight: "bold" }}>{results.length}</div>
            </div>
            <div style={{ padding: "32px", borderRadius: "24px", textAlign: "center", backgroundColor: "#C10016", color: "#ffffff" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", color: "#FFB81C" }}>Top Average Score</p>
              <div style={{ fontSize: "48px", fontFamily: "serif", fontWeight: "bold" }}>{results[0]?.finalScore || 0}</div>
            </div>
            <div style={{ padding: "32px", borderRadius: "24px", textAlign: "center", backgroundColor: "#f1f5f9", color: "#1e293b" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", color: "#94a3b8" }}>Winner</p>
              <div style={{ fontSize: "24px", fontFamily: "serif", fontWeight: "bold" }}>{results[0]?.team_name || "N/A"}</div>
            </div>
          </div>

          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "24px 16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "10px" }}>Rank</th>
                <th style={{ padding: "24px 16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "10px" }}>Team Name</th>
                <th style={{ padding: "24px 16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "10px" }}>Project</th>
                <th style={{ padding: "24px 16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "10px", textAlign: "right" }}>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((team, index) => (
                <tr key={team.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "24px 16px", fontFamily: "serif", fontWeight: "bold", fontSize: "20px" }}>#{team.rank}</td>
                  <td style={{ padding: "24px 16px", fontWeight: "bold" }}>{team.team_name}</td>
                  <td style={{ padding: "24px 16px", color: "#64748b" }}>{team.project_name}</td>
                  <td style={{ padding: "24px 16px", textAlign: "right", fontFamily: "serif", fontWeight: "bold", fontSize: "24px", color: "#C10016" }}>{team.finalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.4em", color: "#94a3b8" }}>Published via Avantika Hackathon Systems</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.4em", color: "#94a3b8" }}>Official Hackathon System</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
