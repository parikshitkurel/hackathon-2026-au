"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Save, AlertCircle, ShieldCheck } from "lucide-react";
import { mockTeams, Team } from "@/lib/mock-data";
import { getEvaluations, saveEvaluation, fetchTeamsFromSupabase } from "@/lib/persistence";
import Link from "next/link";

const SCORING_CATEGORIES = [
  { id: "creativity_score", label: "Creativity & Originality", max: 20 },
  { id: "technical_score", label: "Technical Implementation", max: 20 },
  { id: "design_score", label: "Visual Design & Aesthetics", max: 20 },
  { id: "theme_score", label: "Theme Interpretation", max: 20 },
  { id: "engagement_score", label: "Interactivity & Engagement", max: 20 },
];

export default function AdminEditEvaluation({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, number>>({
    creativity_score: 0,
    technical_score: 0,
    design_score: 0,
    theme_score: 0,
    engagement_score: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Unwrap params using React.use
  const resolvedParams = React.use(params);

  useEffect(() => {
    async function loadData() {
      const teamId = resolvedParams.teamId;
      const teamsData = await fetchTeamsFromSupabase();
      const foundTeam = teamsData.find(t => t.id === teamId);
      
      if (foundTeam) {
        setTeam(foundTeam);
        const allEvals = getEvaluations();
        // For admin, we might want to show the first evaluation found or allow selecting judge
        // For now, find ANY evaluation for this team
        const existing = Object.values(allEvals).find(ev => ev.teamId === teamId);
        if (existing) {
          setScores(existing.scores);
          setFeedback(existing.feedback);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [resolvedParams.teamId]);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (id: string, value: number | readonly number[]) => {
    const score = Array.isArray(value) ? value[0] : value;
    setScores(prev => ({ ...prev, [id]: score }));
  };

  const handleSave = async () => {
    if (!team) return;
    setIsSaving(true);
    
    const judgeData = localStorage.getItem("current_judge");
    const adminId = judgeData ? JSON.parse(judgeData).id : "admin";
    
    await saveEvaluation({
      teamId: team.id,
      scores,
      feedback,
      submittedAt: new Date().toISOString()
    }, adminId);

    setIsSaving(false);
    router.push("/admin/evaluations");
  };

  if (loading || !team) return null;

  return (
    <PageWrapper className="max-w-4xl mx-auto">
      <Link href="/admin/evaluations" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-red transition-colors mb-8 group">
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Evaluations
      </Link>

      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-5 w-5 text-brand-red" />
            <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Score Override</h1>
          </div>
          <p className="text-slate-500 font-medium">Modifying marking for team <span className="text-brand-red font-bold">{team.team_name}</span></p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-serif font-bold text-brand-red">{totalScore}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Points</p>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-xl font-serif font-bold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {SCORING_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-700">{cat.label}</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={scores[cat.id]}
                      onChange={(e) => handleScoreChange(cat.id, [parseInt(e.target.value) || 0])}
                      className="w-20 h-10 text-right font-serif font-bold text-xl bg-slate-50 border-none rounded-lg"
                      max={cat.max}
                    />
                    <span className="text-xs font-bold text-slate-300">/ {cat.max}</span>
                  </div>
                </div>
                <Slider
                  max={cat.max}
                  step={1}
                  value={[scores[cat.id]]}
                  onValueChange={(val) => handleScoreChange(cat.id, val)}
                  className="py-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-xl font-serif font-bold">Feedback Override</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Textarea 
              className="min-h-[150px] bg-slate-50 border-none rounded-2xl p-6 leading-relaxed"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter official administrative feedback..."
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-xl"
          >
            {isSaving ? "Saving Changes..." : <><Save className="h-4 w-4" /> Save Score Override</>}
          </Button>
          <Link href="/admin/evaluations" className="flex-1">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-xs">
              Cancel
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-brand-red/5 border border-brand-red/10 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-brand-red shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-brand-red">Warning:</span> Administrative overrides are recorded and will bypass standard judge edit limits. 
            The team's final standings will be updated immediately across the entire portal.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
