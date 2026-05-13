"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Key, 
  Shield, 
  ShieldAlert,
  Save,
  UserCheck,
  UserMinus,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchJudgesFromSupabase, updateJudgeInSupabase, JudgeAccount } from "@/lib/persistence";
import { useToast } from "@/hooks/use-toast"; // Assuming shadcn toast is available, if not we use alert

export default function AdminJudges() {
  const [judges, setJudges] = useState<JudgeAccount[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const loadJudges = async () => {
      setJudges(await fetchJudgesFromSupabase());
    };
    loadJudges();
  }, []);

  const handleToggleStatus = async (judge: JudgeAccount) => {
    const updated = { ...judge, active: !judge.active };
    await updateJudgeInSupabase(updated);
    setJudges(await fetchJudgesFromSupabase());
  };

  const handleUpdatePassword = async (judge: JudgeAccount) => {
    if (!newPassword) return;
    const updated = { ...judge, password: newPassword };
    await updateJudgeInSupabase(updated);
    setJudges(await fetchJudgesFromSupabase());
    setEditingId(null);
    setNewPassword("");
    alert(`Password updated for ${judge.name}`);
  };

  return (
    <PageWrapper>
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900">Judge Management</h1>
        <p className="text-slate-500 mt-2 font-medium">Control access and security for all judge accounts.</p>
      </div>

      <div className="grid gap-6">
        {judges.map((judge) => (
          <Card key={judge.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                    judge.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-brand-red/5 text-brand-red'
                  }`}>
                    {judge.role === 'admin' ? <Shield className="h-8 w-8" /> : <Users className="h-8 w-8" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-serif font-bold text-slate-900">{judge.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                        judge.role === 'admin' ? 'bg-slate-100 text-slate-600' : 'bg-brand-red/10 text-brand-red'
                      }`}>
                        {judge.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mt-1">{judge.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {editingId === judge.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                      <Input 
                        placeholder="New Password" 
                        className="h-12 w-48 rounded-xl border-slate-200"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="text"
                      />
                      <Button 
                        onClick={() => handleUpdatePassword(judge)}
                        className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" /> Save
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                        className="h-12 px-6 rounded-xl text-slate-500"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => setEditingId(judge.id)}
                      className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2"
                    >
                      <Key className="h-4 w-4" /> Change Password
                    </Button>
                  )}

                  {judge.role !== 'admin' && (
                    <Button 
                      variant="ghost"
                      onClick={() => handleToggleStatus(judge)}
                      className={`h-12 px-6 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] ${
                        judge.active 
                        ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700' 
                        : 'text-brand-red hover:bg-brand-red/5 hover:text-brand-red'
                      }`}
                    >
                      {judge.active ? (
                        <><UserCheck className="h-4 w-4" /> Account Active</>
                      ) : (
                        <><UserMinus className="h-4 w-4" /> Account Disabled</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-brand-orange/5 border border-brand-orange/10 flex gap-6">
        <ShieldAlert className="h-8 w-8 text-brand-orange shrink-0" />
        <div>
          <h4 className="text-lg font-serif font-bold text-brand-orange">Security Protocol</h4>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            As an administrator, you have the authority to manage judge credentials and system access. 
            All password changes take effect immediately and will require the judge to re-authenticate. 
            Deactivating an account will prevent the judge from accessing the dashboard or submitting scores.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
