import { Team, Score } from "./mock-data";

const EVALUATIONS_KEY = "hackathon_evaluations";

export interface LocalEvaluation {
  teamId: string;
  scores: Record<string, number>;
  feedback: string;
  submittedAt: string;
}

export const saveEvaluation = (evaluation: LocalEvaluation) => {
  const existing = getEvaluations();
  const updated = { ...existing, [evaluation.teamId]: evaluation };
  localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(updated));
};

export const getEvaluations = (): Record<string, LocalEvaluation> => {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(EVALUATIONS_KEY);
  return data ? JSON.parse(data) : {};
};

export const getEvaluatedTeamIds = (): string[] => {
  return Object.keys(getEvaluations());
};

export const getTeamStatus = (teamId: string): 'pending' | 'evaluated' => {
  const evaluations = getEvaluations();
  return evaluations[teamId] ? 'evaluated' : 'pending';
};
