import { Team, Score } from "./mock-data";
import { supabase } from "./supabase";

const EVALUATIONS_KEY = "hackathon_evaluations";
const JUDGES_KEY = "hackathon_judges";

export interface LocalEvaluation {
  teamId: string;
  scores: Record<string, number>;
  feedback: string;
  submittedAt: string;
}

export interface JudgeAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "judge";
  active: boolean;
}

// Evaluation Persistence (Supabase + Local Fallback)
export const saveEvaluation = async (evaluation: LocalEvaluation) => {
  // 1. Sync to Supabase
  const { error } = await supabase
    .from('evaluations')
    .upsert({
      team_id: evaluation.teamId,
      creativity_score: evaluation.scores.creativity_score,
      technical_score: evaluation.scores.technical_score,
      design_score: evaluation.scores.design_score,
      theme_score: evaluation.scores.theme_score,
      engagement_score: evaluation.scores.engagement_score,
      total_score: Object.values(evaluation.scores).reduce((a, b) => a + b, 0),
      feedback: evaluation.feedback,
      updated_at: new Date().toISOString()
    }, { onConflict: 'team_id' });

  if (error) console.error("Supabase sync error:", error);

  // 2. Local Fallback
  const existing = getEvaluations();
  const updated = { ...existing, [evaluation.teamId]: evaluation };
  localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(updated));
};

export const getEvaluations = (): Record<string, LocalEvaluation> => {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(EVALUATIONS_KEY);
  return data ? JSON.parse(data) : {};
};

// Admin Functions (Supabase Prioritized)
export const fetchJudgesFromSupabase = async (): Promise<JudgeAccount[]> => {
  const { data, error } = await supabase
    .from('judges')
    .select('*');
  
  if (error) {
    console.error("Error fetching judges from Supabase:", error);
    return getJudges(); // Fallback to local
  }
  
  return data as JudgeAccount[];
};

export const initializeJudges = async (initialJudges: JudgeAccount[]) => {
  if (typeof window === "undefined") return;
  
  // Save to Local for redundancy
  const existing = localStorage.getItem(JUDGES_KEY);
  if (!existing) {
    localStorage.setItem(JUDGES_KEY, JSON.stringify(initialJudges));
  }

  // Attempt to sync to Supabase if not already there
  const { data } = await supabase.from('judges').select('count');
  if (!data || data.length === 0) {
    await supabase.from('judges').insert(initialJudges);
  }
};

export const getJudges = (): JudgeAccount[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(JUDGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateJudgeInSupabase = async (judge: JudgeAccount) => {
  // 1. Update Supabase
  const { error } = await supabase
    .from('judges')
    .update({ 
      password: judge.password, 
      active: judge.active,
      name: judge.name,
      role: judge.role
    })
    .eq('id', judge.id);

  if (error) console.error("Supabase update error:", error);

  // 2. Update Local
  const judges = getJudges();
  const updated = judges.map(j => j.id === judge.id ? judge : j);
  localStorage.setItem(JUDGES_KEY, JSON.stringify(updated));
};

export const getEvaluatedTeamIds = (): string[] => {
  return Object.keys(getEvaluations());
};

export const getTeamStatus = (teamId: string): 'pending' | 'evaluated' => {
  const evaluations = getEvaluations();
  return evaluations[teamId] ? 'evaluated' : 'pending';
};
