"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Edit3,
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockTeams, Team } from "@/lib/mock-data";
import { getEvaluations, LocalEvaluation } from "@/lib/persistence";
import Link from "next/link";

export default function AdminEvaluations() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, LocalEvaluation>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "evaluated">("all");

  useEffect(() => {
    setTeams(mockTeams);
    setEvaluations(getEvaluations());
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.project_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const evaluation = evaluations[team.id];
    const isEvaluated = !!evaluation;
    
    if (filterStatus === "pending") return matchesSearch && !isEvaluated;
    if (filterStatus === "evaluated") return matchesSearch && isEvaluated;
    return matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Evaluations</h1>
          <p className="text-slate-500 mt-2 font-medium">Review and modify judge markings for all teams.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search teams..." 
              className="pl-10 h-12 w-full sm:w-64 rounded-xl border-slate-200 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <Button 
              variant={filterStatus === "all" ? "default" : "ghost"}
              onClick={() => setFilterStatus("all")}
              className={`h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest ${filterStatus === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "evaluated" ? "default" : "ghost"}
              onClick={() => setFilterStatus("evaluated")}
              className={`h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest ${filterStatus === 'evaluated' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
            >
              Evaluated
            </Button>
            <Button 
              variant={filterStatus === "pending" ? "default" : "ghost"}
              onClick={() => setFilterStatus("pending")}
              className={`h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest ${filterStatus === 'pending' ? 'bg-brand-orange text-white' : 'text-slate-500'}`}
            >
              Pending
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTeams.map((team) => {
          const evalData = evaluations[team.id];
          const isEvaluated = !!evalData;
          const totalScore = evalData ? Object.values(evalData.scores).reduce((a, b) => a + b, 0) : 0;

          return (
            <Card key={team.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`h-2 w-2 rounded-full ${isEvaluated ? 'bg-emerald-500' : 'bg-brand-orange'}`} />
                      <h3 className="text-lg font-serif font-bold text-slate-900">{team.project_name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Team {team.team_name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>{team.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {isEvaluated ? (
                      <div className="text-center md:text-right min-w-[100px]">
                        <p className="text-2xl font-serif font-bold text-emerald-600">{totalScore}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Final Score</p>
                      </div>
                    ) : (
                      <div className="text-center md:text-right min-w-[100px]">
                        <div className="flex items-center gap-2 text-brand-orange justify-center md:justify-end">
                          <Clock className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/evaluations/${team.id}`}>
                        <Button className="h-12 w-12 rounded-xl bg-slate-900 hover:bg-brand-red text-white transition-all shadow-lg shadow-slate-900/10">
                          <Edit3 className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredTeams.length === 0 && (
          <div className="py-20 text-center">
            <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-serif text-lg">No teams found matching your criteria.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
