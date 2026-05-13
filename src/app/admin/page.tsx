"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Trophy, 
  ClipboardCheck, 
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { mockTeams } from "@/lib/mock-data";
import { getEvaluations, getJudges } from "@/lib/persistence";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    evaluatedTeams: 0,
    totalJudges: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const evaluations = getEvaluations();
    const judges = getJudges();
    
    const totalTeams = mockTeams.length;
    const evaluatedTeams = Object.keys(evaluations).length;
    const totalJudges = judges.filter(j => j.role === "judge").length;
    const completionRate = totalTeams > 0 ? Math.round((evaluatedTeams / totalTeams) * 100) : 0;

    setStats({
      totalTeams,
      evaluatedTeams,
      totalJudges,
      completionRate
    });
  }, []);

  const statCards = [
    { name: "Total Teams", value: stats.totalTeams, icon: Trophy, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Evaluated", value: stats.evaluatedTeams, icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Active Judges", value: stats.totalJudges, icon: Users, color: "text-brand-orange", bg: "bg-orange-50" },
    { name: "Completion", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-brand-red", bg: "bg-red-50" },
  ];

  return (
    <PageWrapper>
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2 font-medium">Real-time overview of hackathon judging progress.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {statCards.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.name}</p>
                  <p className="text-3xl font-serif font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-none shadow-sm rounded-3xl p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-serif font-bold">Judging Status</CardTitle>
          </CardHeader>
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Progress Bar</span>
              <span className="text-brand-red font-bold">{stats.completionRate}% Complete</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-red transition-all duration-1000 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-brand-red" />
                <span className="text-xs font-bold text-slate-600">Evaluated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="text-xs font-bold text-slate-600">Remaining</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl p-8 bg-slate-900 text-white">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-serif font-bold">System Alerts</CardTitle>
            <AlertCircle className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <div className="mt-6 space-y-4">
            {stats.completionRate < 100 ? (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                <Clock className="h-5 w-5 text-brand-orange shrink-0" />
                <div>
                  <p className="text-sm font-bold">Judging in Progress</p>
                  <p className="text-xs text-slate-400 mt-1">There are still {stats.totalTeams - stats.evaluatedTeams} teams awaiting evaluation.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4">
                <ClipboardCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">Judging Complete</p>
                  <p className="text-xs text-emerald-400/70 mt-1">All teams have been successfully evaluated.</p>
                </div>
              </div>
            )}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
              <Users className="h-5 w-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-sm font-bold">Judge Activity</p>
                <p className="text-xs text-slate-400 mt-1">All {stats.totalJudges} judge accounts are currently active.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
