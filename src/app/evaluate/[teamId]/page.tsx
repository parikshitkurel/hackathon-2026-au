"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Globe, ExternalLink, Users, AlertCircle, Save, CheckCircle, Download } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockTeams, Team, mockScores } from "@/lib/mock-data";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { ScorecardPDF } from "@/components/brand/ScorecardPDF";
import { generatePDF } from "@/lib/pdf-utils";
import { useRef } from "react";
import { saveEvaluation, getEvaluations } from "@/lib/persistence";

const SCORING_CATEGORIES = [
  { id: "creativity_score", label: "Creativity & Originality", description: "Innovation, unique approach, and creative vision.", max: 20 },
  { id: "technical_score", label: "Technical Implementation", description: "Code quality, complexity, and robust architecture.", max: 20 },
  { id: "design_score", label: "Visual Design & Aesthetics", description: "UI/UX, visual polish, and layout structure.", max: 20 },
  { id: "theme_score", label: "Theme Interpretation", description: "How well the project aligns with the hackathon theme.", max: 20 },
  { id: "engagement_score", label: "Interactivity & Engagement", description: "User experience, performance, and interactivity.", max: 20 },
];

const MAX_EDITS = 3;

export default function EvaluatePage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const scorecardRef = useRef<HTMLDivElement>(null);
  
  // Unwrap params using React.use
  const resolvedParams = React.use(params);
  
  useEffect(() => {
    async function fetchTeam() {
      const teamId = resolvedParams.teamId;
      console.log("Attempting to fetch team with ID:", teamId);

      if (!hasSupabaseConfig) {
        // Normalize ID for finding in mock data
        const normalizedId = teamId.replace(/\s/g, '-');
        const found = mockTeams.find(t => t.id === normalizedId || t.id === teamId);
        if (found) {
          setTeam(found);
        } else {
          console.error("Team not found in mock data:", teamId);
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamId)
          .single();

        if (error) {
          console.warn("Supabase fetch failed (possibly due to mock ID format), falling back to mock data.", error.message);
          throw error;
        }
        
        setTeam(data as Team);

        // Fetch existing score and edit count
        const judgeData = localStorage.getItem("current_judge");
        if (judgeData) {
          const { id: judgeId } = JSON.parse(judgeData);
          const { data: existingScore } = await supabase
            .from('scores')
            .select('*')
            .eq('team_id', teamId)
            .eq('judge_id', judgeId)
            .single();
          
          if (existingScore) {
            setScores({
              creativity_score: existingScore.creativity_score,
              technical_score: existingScore.technical_score,
              design_score: existingScore.design_score,
              theme_score: existingScore.theme_score,
              engagement_score: existingScore.engagement_score,
            });
            setFeedback(existingScore.feedback || "");
            setEditCount(existingScore.edit_count || 0);
          }
        }
      } catch (err) {
        // Fallback to mock data
        const normalizedId = teamId.replace(/\s/g, '-');
        const mockTeam = mockTeams.find(t => 
          t.id === teamId || 
          t.id === normalizedId || 
          t.team_name.toLowerCase().replace(/\s+/g, '-') === normalizedId.toLowerCase()
        );

        if (mockTeam) {
          setTeam(mockTeam);
          // Load mock edit count
          const key = `edit_count_${mockTeam.id}`;
          const savedEdits = parseInt(localStorage.getItem(key) || "0");
          setEditCount(savedEdits);

          // Load local evaluation if it exists
          const localEvaluations = getEvaluations();
          const localEval = localEvaluations[mockTeam.id];
          if (localEval) {
            setScores(localEval.scores);
            setFeedback(localEval.feedback);
          }
        } else {
          console.error("Critical: Team not found in database or mock data for ID:", teamId);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, [resolvedParams.teamId]);

  const [scores, setScores] = useState<Record<string, number>>({
    creativity_score: 0,
    technical_score: 0,
    design_score: 0,
    theme_score: 0,
    engagement_score: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (loading || !team) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (category: string, value: number | number[]) => {
    const score = Array.isArray(value) ? value[0] : value;
    setScores(prev => ({ ...prev, [category]: score }));
  };

  const handleManualScoreChange = (category: string, value: string, max: number) => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setScores(prev => ({ ...prev, [category]: 0 }));
      return;
    }
    const validatedNum = Math.min(Math.max(0, num), max);
    setScores(prev => ({ ...prev, [category]: validatedNum }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    // Validate score
    if (totalScore === 0) {
      setErrorMsg("You Can't Score 0");
      setIsSubmitting(false);
      return;
    }

    if (!hasSupabaseConfig || team.id.startsWith('t-')) {
        // Mock Persistence for edit count
        const key = `edit_count_${team.id}`;
        const currentEdits = parseInt(localStorage.getItem(key) || "0");
        localStorage.setItem(key, (currentEdits + 1).toString());
        
        try {
          const evaluationData = {
            teamId: resolvedParams.teamId,
            scores,
            feedback,
            submittedAt: new Date().toISOString()
          };

          await saveEvaluation(evaluationData);
          
          setIsSuccess(true);
          setShowConfirmModal(false);
          setEditCount(currentEdits + 1);
        } catch (err) {
          setErrorMsg("Failed to synchronize with database. Please check your connection.");
        } finally {
          setIsSubmitting(false);
        }
        return;
    }

    try {
      const judgeData = localStorage.getItem("current_judge");
      if (!judgeData) {
        setErrorMsg("Authentication error. Please log in again.");
        return;
      }
      
      const currentJudge = JSON.parse(judgeData);
      const judge_id = currentJudge.id;

      // Upsert score and increment edit count
      const { error } = await supabase
        .from('scores')
        .upsert({
          judge_id: judge_id,
          team_id: team.id,
          creativity_score: scores.creativity_score,
          technical_score: scores.technical_score,
          design_score: scores.design_score,
          theme_score: scores.theme_score,
          engagement_score: scores.engagement_score,
          feedback: feedback,
          edit_count: editCount + 1,
          submitted_at: new Date().toISOString()
        }, { onConflict: 'judge_id, team_id' });

      if (error) throw error;
      
      // Update team status to evaluated
      await supabase
        .from('teams')
        .update({ status: 'evaluated' })
        .eq('id', team.id);

      setEditCount(prev => prev + 1);
      setShowConfirmModal(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(err.message || "Failed to submit evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!scorecardRef.current) return;
    await generatePDF(scorecardRef.current, `Evaluation_Report_${team.team_name.replace(/\s+/g, '_')}`);
  };

  return (
    <PageWrapper className="container mx-auto px-4 py-8 pb-32 sm:px-8 max-w-5xl">
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center mx-auto py-20"
        >
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange animate-bounce">
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground mb-4">Submission Successful!</h1>
          <p className="text-xl text-muted-foreground mb-12">
            You have successfully evaluated <span className="text-brand-red font-bold">{team.team_name}</span>. 
            The scores have been locked and synchronized with the central database.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Button 
              onClick={handleDownloadReport}
              className="py-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-xl"
            >
              <Download className="h-5 w-5" /> Download Scorecard PDF
            </Button>
            <Link href="/dashboard" className="w-full">
              <Button 
                variant="outline"
                className="w-full py-8 rounded-2xl border-2 border-brand-red text-brand-red font-bold uppercase tracking-widest text-xs hover:bg-brand-red/5"
              >
                Return to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-12 pt-12 border-t border-border/10">
            <Link href="/results" className="text-brand-red font-bold uppercase tracking-widest text-xs hover:underline">
              View Final Leaderboard
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-brand-red transition-colors mb-8 group">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
          </Link>

          {editCount >= MAX_EDITS && (
            <div className="mb-10 p-6 rounded-2xl bg-brand-red/5 border border-brand-red/20 flex items-center gap-4 text-sm shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/10">
                <AlertCircle className="h-6 w-6 text-brand-red" />
              </div>
              <div>
                <p className="font-bold text-brand-red uppercase tracking-widest text-xs">Maximum edit limit reached ({editCount}/{MAX_EDITS})</p>
                <p className="text-muted-foreground mt-1 leading-relaxed">This evaluation is now locked. Admin intervention is required for any further modifications.</p>
              </div>
            </div>
          )}

          {/* 3-Edit Rule Informational Warning */}
          {editCount < MAX_EDITS && (
            <div className="mb-10 p-5 rounded-2xl bg-brand-yellow/[0.07] border border-brand-yellow/20 flex items-start gap-4 text-sm animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow/10">
                <AlertCircle className="h-5 w-5 text-brand-yellow" />
              </div>
              <div>
                <p className="font-bold text-brand-yellow uppercase tracking-widest text-[10px]">Evaluation Integrity Rule</p>
                <p className="text-muted-foreground mt-1 leading-relaxed text-xs font-medium">
                  Judges are allowed a maximum of <span className="text-foreground font-bold underline decoration-brand-yellow/30 underline-offset-4">3 total submissions</span> per team. Please ensure your scoring is final before confirming. Current edits: <span className="text-foreground font-bold">{editCount}/{MAX_EDITS}</span>.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Left Column: Project Info & Feedback */}
            <div className="space-y-12">
              <section>
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight">{team.project_name}</h1>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-grey">Submitted by {team.team_name}</p>
                  </div>
                  <div className="inline-flex items-center rounded-md bg-brand-red/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-red border border-brand-red/10 shadow-sm">
                    {team.category}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-grey bg-muted/30 px-3 py-2 rounded-lg">
                    <Users className="h-3.5 w-3.5" />
                    <span>{team.members} Members</span>
                  </div>
                  {team.github_url && (
                    <a href={team.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors bg-muted/30 px-3 py-2 rounded-lg">
                      <Globe className="h-3.5 w-3.5" />
                      <span>Repository</span>
                    </a>
                  )}
                  {team.demo_url && (
                    <a href={team.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all bg-brand-red hover:bg-brand-red/90 px-4 py-2 rounded-lg shadow-lg shadow-brand-red/20">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Launch Demo</span>
                    </a>
                  )}
                </div>

                {team.member_names && team.member_names.length > 0 && (
                  <div className="mt-6 p-6 rounded-2xl bg-brand-red/[0.03] border border-brand-red/10 max-w-sm animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1.5 w-4 bg-brand-red rounded-full" />
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">Team Roster</h4>
                    </div>
                    <ul className="grid gap-3">
                      {team.member_names.map((name, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-foreground group">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/10 text-[10px] text-brand-red">
                            0{idx + 1}
                          </div>
                          <span className="tracking-tight">{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-10 p-8 rounded-2xl bg-muted/20 border border-border/5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Project Narrative</h3>
                  <p className="text-base text-muted-foreground/90 leading-relaxed font-medium">
                    {team.description}
                  </p>
                </div>

                {/* Post-Evaluation Actions */}
                {editCount > 0 && (
                  <div className="mt-10 pt-10 border-t border-border/10">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <Button 
                        onClick={handleDownloadReport}
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-2xl shadow-slate-900/20"
                      >
                        <Download className="h-4 w-4" /> Download Official Scorecard
                      </Button>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground max-w-[200px] leading-relaxed">
                        Generate an official PDF record of your latest evaluation.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section>
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden">
                  <div className="h-1.5 w-full bg-brand-orange/20" />
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-serif font-bold">Constructive Feedback</CardTitle>
                    <p className="text-sm text-muted-foreground">Your notes will be shared with the team after judging concludes.</p>
                  </CardHeader>
                  <CardContent className={`p-8 pt-0 ${editCount >= MAX_EDITS ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Textarea 
                      placeholder="Share your thoughts on their implementation, creative process, and potential areas for growth..." 
                      className="min-h-[200px] resize-y bg-muted/30 border-none focus-visible:ring-brand-orange/30 p-6 rounded-xl leading-relaxed font-medium"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={editCount >= MAX_EDITS}
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Right Column: Scoring Panel */}
            <div className="space-y-6">
              <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-card/95 backdrop-blur-xl sticky top-24 overflow-hidden rounded-3xl">
                <div className="h-2 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow" />
                <CardHeader className="p-8 border-b border-border/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-serif font-bold">Evaluation</CardTitle>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Score Matrix</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-serif font-bold tracking-tight text-brand-red">{totalScore}</span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mt-1">/ 100 Points</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={`p-8 space-y-10 ${editCount >= MAX_EDITS ? 'opacity-50 pointer-events-none' : ''}`}>
                  {SCORING_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">{cat.label}</h4>
                          <p className="text-[10px] text-muted-foreground leading-normal max-w-[200px]">{cat.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            value={scores[cat.id]}
                            onChange={(e) => handleManualScoreChange(cat.id, e.target.value, cat.max)}
                            className="w-16 h-10 text-right font-serif font-bold text-xl p-2 bg-muted/20 border-none rounded-lg text-brand-orange focus-visible:ring-brand-orange/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            max={cat.max}
                            min={0}
                            disabled={editCount >= MAX_EDITS}
                          />
                          <span className="text-[10px] font-bold text-muted-foreground opacity-50">/{cat.max}</span>
                        </div>
                      </div>
                      <Slider
                        defaultValue={[0]}
                        max={cat.max}
                        step={1}
                        value={[scores[cat.id]]}
                        onValueChange={(val) => {
                          const numVal = Array.isArray(val) ? val[0] : (val as number);
                          handleScoreChange(cat.id, [numVal]);
                        }}
                        className="py-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Floating Action Bar */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-background/80 backdrop-blur-md border-t border-border/5 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="container mx-auto flex items-center justify-end px-0 sm:px-8 max-w-5xl">
              <Button 
                onClick={() => setShowConfirmModal(true)} 
                disabled={editCount >= MAX_EDITS}
                className={`w-full sm:w-auto gap-2 h-12 px-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl transition-all duration-300 ${
                  editCount >= MAX_EDITS 
                  ? 'bg-muted text-muted-foreground shadow-none cursor-not-allowed' 
                  : 'bg-brand-red hover:bg-brand-red/90 text-white shadow-brand-red/20'
                }`}
              >
                <CheckCircle className="h-4 w-4" /> 
                {editCount >= MAX_EDITS ? 'Evaluation Locked' : team.status === 'evaluated' ? 'Update scores' : 'Submit final scores'}
              </Button>
            </div>
          </motion.div>

          {/* Confirmation Modal */}
          <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
            <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl rounded-3xl overflow-hidden p-0">
              <div className="h-2 w-full bg-brand-red" />
              <div className="p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif font-bold">Confirm Submission</DialogTitle>
                  <DialogDescription className="text-sm font-medium pt-2">
                    Are you ready to submit your evaluation for <span className="text-foreground font-bold">{team.team_name}</span>? 
                    You are awarding them a total of <span className="text-brand-red font-bold">{totalScore} points</span>.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-6 space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/20 text-brand-grey text-xs">
                    <AlertCircle className="h-5 w-5 shrink-0 text-brand-yellow" />
                    <p className="leading-relaxed">
                      Finalizing this submission will lock the scores in the <span className="font-bold">Avantika Judging System</span>. 
                      Judges have a maximum of <span className="font-bold underline">3 edits</span> per team.
                    </p>
                  </div>
                  
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold uppercase tracking-widest text-center">
                      {errorMsg}
                    </div>
                  )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-border/5">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConfirmModal(false)} 
                    disabled={isSubmitting} 
                    className="flex-1 py-6 rounded-xl text-[10px] font-bold uppercase tracking-widest border-brand-red text-foreground hover:bg-brand-red/5"
                  >
                    Review again
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="flex-1 py-6 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-red/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing
                      </div>
                    ) : (
                      "Confirm & Submit"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Hidden Template for PDF Capture (Always available) */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        <ScorecardPDF ref={scorecardRef} team={team} score={{ ...scores, feedback }} />
      </div>
    </PageWrapper>
  );
}
