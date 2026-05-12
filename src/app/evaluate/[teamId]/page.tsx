"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Globe, ExternalLink, Users, AlertCircle, Save, CheckCircle } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockTeams, Team } from "@/lib/mock-data";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";

const SCORING_CATEGORIES = [
  { id: "creativity_score", label: "Creativity & Originality", description: "Innovation, unique approach, and creative vision.", max: 20 },
  { id: "technical_score", label: "Technical Implementation", description: "Code quality, complexity, and robust architecture.", max: 20 },
  { id: "design_score", label: "Visual Design & Aesthetics", description: "UI/UX, visual polish, and layout structure.", max: 20 },
  { id: "theme_score", label: "Theme Interpretation", description: "How well the project aligns with the hackathon theme.", max: 20 },
  { id: "engagement_score", label: "Interactivity & Engagement", description: "User experience, performance, and interactivity.", max: 20 },
];

export default function EvaluatePage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using React.use
  const resolvedParams = React.use(params);
  
  useEffect(() => {
    async function fetchTeam() {
      if (!hasSupabaseConfig) {
        const found = mockTeams.find(t => t.id === resolvedParams.teamId);
        if (found) setTeam(found);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', resolvedParams.teamId)
          .single();

        if (error) throw error;
        setTeam(data as Team);
      } catch (err) {
        console.error("Error fetching team:", err);
        // Fallback
        const found = mockTeams.find(t => t.id === resolvedParams.teamId);
        if (found) setTeam(found);
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

  const handleScoreChange = (category: string, value: number[]) => {
    setScores(prev => ({ ...prev, [category]: value[0] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    if (!hasSupabaseConfig) {
      // Mock Submission
      setTimeout(() => {
        setIsSubmitting(false);
        setShowConfirmModal(false);
        router.push("/dashboard");
      }, 1000);
      return;
    }

    try {
      // Get the actual judge ID from localStorage
      const judgeData = localStorage.getItem("current_judge");
      if (!judgeData) {
        setErrorMsg("Authentication error. Please log in again.");
        return;
      }
      
      const currentJudge = JSON.parse(judgeData);
      const judge_id = currentJudge.id;

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
          // total_score is GENERATED ALWAYS in postgres, no need to insert
        }, { onConflict: 'judge_id, team_id' });

      if (error) throw error;
      
      // Update team status to evaluated
      await supabase
        .from('teams')
        .update({ status: 'evaluated' })
        .eq('id', team.id);

      setShowConfirmModal(false);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(err.message || "Failed to submit evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="container mx-auto px-4 py-8 pb-32 sm:px-8 max-w-5xl">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-brand-red transition-colors mb-8 group">
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Project Info & Feedback */}
        <div className="space-y-12">
          <section>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground leading-tight">{team.project_name}</h1>
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

            <div className="mt-10 p-8 rounded-2xl bg-muted/20 border border-border/5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Project Narrative</h3>
              <p className="text-base text-muted-foreground/90 leading-relaxed font-medium">
                {team.description}
              </p>
            </div>
          </section>

          <section>
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card overflow-hidden">
              <div className="h-1.5 w-full bg-brand-orange/20" />
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-serif font-bold">Constructive Feedback</CardTitle>
                <p className="text-sm text-muted-foreground">Your notes will be shared with the team after judging concludes.</p>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Textarea 
                  placeholder="Share your thoughts on their implementation, creative process, and potential areas for growth..." 
                  className="min-h-[200px] resize-y bg-muted/30 border-none focus-visible:ring-brand-orange/30 p-6 rounded-xl leading-relaxed font-medium"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
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
            <CardContent className="p-8 space-y-10">
              {SCORING_CATEGORIES.map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">{cat.label}</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal max-w-[200px]">{cat.description}</p>
                    </div>
                    <span className="text-xl font-serif font-bold tracking-tighter w-10 text-right text-brand-orange">
                      {scores[cat.id]}
                    </span>
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
        className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border/5 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
      >
        <div className="container mx-auto flex items-center justify-end gap-6 px-4 sm:px-8 max-w-5xl">
          <Button variant="ghost" className="gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <Save className="h-4 w-4" /> Save as Draft
          </Button>
          <Button 
            onClick={() => setShowConfirmModal(true)} 
            className="gap-2 h-12 px-8 rounded-xl bg-brand-red hover:bg-brand-red/90 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-red/20"
          >
            <CheckCircle className="h-4 w-4" /> Submit final scores
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
                  Admin intervention is required for any post-submission modifications.
                </p>
              </div>
              
              {errorMsg && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-widest text-center">
                  {errorMsg}
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
              <Button variant="ghost" onClick={() => setShowConfirmModal(false)} disabled={isSubmitting} className="flex-1 text-[10px] font-bold uppercase tracking-widest">
                Review again
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="flex-1 h-12 rounded-xl bg-brand-red hover:bg-brand-red/90 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-brand-red/10"
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
    </PageWrapper>
  );
}
