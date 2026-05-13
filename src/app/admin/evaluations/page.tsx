"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  RotateCcw, 
  Trash2, 
  ShieldAlert, 
  Search, 
  Filter,
  Users,
  Trophy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockTeams } from "@/lib/mock-data";
import { 
  fetchAllEvaluationsFromSupabase, 
  fetchJudgesFromSupabase, 
  deleteEvaluationFromSupabase, 
  resetEditLimitInSupabase 
} from "@/lib/persistence";

export default function AdminEvaluations() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [judges, setJudges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const evalsMap = await fetchAllEvaluationsFromSupabase();
      const judgesList = await fetchJudgesFromSupabase();
      
      setEvaluations(Object.values(evalsMap));
      setJudges(judgesList);
    } catch (err) {
      console.error("Error loading evaluations:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleResetScore = async (judgeId: string, teamId: string) => {
    if (confirm("Are you sure you want to PERMANENTLY RESET this score? The judge will have to re-evaluate.")) {
      await deleteEvaluationFromSupabase(judgeId, teamId);
      loadData();
    }
  };

  const handleResetLimit = async (judgeId: string, teamId: string) => {
    if (confirm("Reset edit limit for this judge? They will get 3 more edits.")) {
      await resetEditLimitInSupabase(judgeId, teamId);
      loadData();
    }
  };

  const filteredEvaluations = evaluations.filter(ev => {
    const judge = judges.find(j => j.id === ev.judgeId);
    const team = mockTeams.find(t => t.id === ev.teamId);
    const searchString = `${judge?.name} ${team?.team_name} ${ev.teamId}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Evaluation Management</h1>
          <p className="text-slate-500 mt-2 font-medium">Reset scores or edit limits for individual judges.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by judge or team..." 
            className="pl-10 h-12 w-full sm:w-80 rounded-xl border-slate-200 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6 pl-8">Judge</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6">Team Details</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6 text-center">Score</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6 text-center">Edits</TableHead>
                <TableHead className="font-bold uppercase tracking-widest text-[10px] py-6 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Filter className="h-10 w-10 text-slate-300" />
                      <p className="text-slate-400 font-serif text-lg">No evaluations found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((ev, i) => {
                  const judge = judges.find(j => j.id === ev.judgeId);
                  const team = mockTeams.find(t => t.id === ev.teamId);
                  const totalScore = Object.values(ev.scores).reduce((a: any, b: any) => a + b, 0);
                  
                  return (
                    <TableRow key={i} className="border-slate-50 group hover:bg-slate-50/30 transition-colors">
                      <TableCell className="py-6 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none mb-1">{judge?.name || "Unknown Judge"}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tight font-medium">{judge?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                            <Trophy className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 leading-none mb-1">{team?.team_name || "Unknown Team"}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tight font-medium">ID: {ev.teamId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 text-center">
                        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-brand-red/5 text-brand-red font-serif font-bold text-xl">
                          {totalScore}
                        </span>
                      </TableCell>
                      <TableCell className="py-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          ev.edit_count >= 3 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {ev.edit_count}/3
                        </span>
                      </TableCell>
                      <TableCell className="py-6 text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleResetLimit(ev.judgeId, ev.teamId)}
                            title="Reset 3-edit limit"
                            className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm"
                          >
                            <RotateCcw className="h-3 w-3" /> Reset Limit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleResetScore(ev.judgeId, ev.teamId)}
                            title="Delete Score"
                            className="h-9 px-4 rounded-xl text-slate-400 hover:text-brand-red hover:bg-brand-red/5 gap-2 text-[10px] font-bold uppercase tracking-widest"
                          >
                            <Trash2 className="h-3 w-3" /> Reset Score
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white flex gap-6 shadow-2xl shadow-slate-900/20">
        <ShieldAlert className="h-8 w-8 text-brand-orange shrink-0" />
        <div>
          <h4 className="text-lg font-serif font-bold text-brand-orange">Admin Override Panel</h4>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl">
            You are viewing live evaluations across all judges. <strong>Reset Score</strong> will permanently remove the record from the system, allowing the judge to start fresh. <strong>Reset Limit</strong> will set the edit counter back to zero without deleting the current marks.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
