"use client";

import React from "react";
import { Team, Score } from "@/lib/mock-data";
import { PDFLogo } from "./PDFLogo";

interface ScorecardPDFProps {
  team: Team;
  score: Partial<Score>;
}

export const ScorecardPDF = React.forwardRef<HTMLDivElement, ScorecardPDFProps>(
  ({ team, score }, ref) => {
    const totalScore = (score.creativity_score || 0) + 
                       (score.technical_score || 0) + 
                       (score.design_score || 0) + 
                       (score.theme_score || 0) + 
                       (score.engagement_score || 0);

    return (
      <div 
        ref={ref}
        className="w-[800px] p-12 bg-white text-slate-900 font-sans relative overflow-hidden"
        style={{ minHeight: "1100px", backgroundColor: "#ffffff" }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ backgroundColor: "#C1001608" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24" style={{ backgroundColor: "#FF690008" }} />

        {/* Header */}
        <div className="flex justify-between items-start border-b-2 pb-8 mb-12" style={{ borderColor: "#C10016" }}>
          <div>
            <PDFLogo className="scale-125 origin-left" />
            <p className="text-xs font-bold uppercase tracking-widest mt-6" style={{ color: "#7E7E82" }}>
              Official Evaluation Record
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-serif font-bold" style={{ color: "#C10016" }}>Scorecard</h2>
            <p className="text-sm text-slate-500 mt-1">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Team Info */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-2">Participating Team</label>
            <h3 className="text-3xl font-serif font-bold text-slate-800">{team.team_name}</h3>
            {team.member_names && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {team.member_names.join(" • ")}
              </p>
            )}
            <p className="text-sm font-semibold mt-1" style={{ color: "#FF6900" }}>{team.category}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center items-center">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Aggregate Score</label>
            <div className="text-5xl font-serif font-bold" style={{ color: "#C10016" }}>{totalScore}<span className="text-xl text-slate-300 ml-1">/100</span></div>
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-12">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-3">Project Overview</label>
          <p className="text-lg text-slate-600 leading-relaxed font-serif italic">
            "{team.description}"
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="mb-12">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-6">Evaluation Matrix</label>
          <div className="space-y-6">
            {[
              { label: "Creativity & Originality", value: score.creativity_score },
              { label: "Technical Implementation", value: score.technical_score },
              { label: "Visual Design & Aesthetics", value: score.design_score },
              { label: "Theme Interpretation", value: score.theme_score },
              { label: "Interactivity & Engagement", value: score.engagement_score },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-6">
                <div className="w-48 text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full" 
                    style={{ width: `${(item.value || 0) * 5}%`, backgroundColor: "#C10016" }}
                  />
                </div>
                <div className="w-12 text-right font-serif font-bold text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Judge Feedback */}
        <div className="p-8 rounded-3xl border mb-12" style={{ backgroundColor: "#C1001605", borderColor: "#C1001620" }}>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-4 font-black" style={{ color: "#C10016" }}>Judge's Remarks</label>
          <p className="text-slate-700 leading-relaxed">
            {score.feedback || "Excellent demonstration of creative coding principles. The technical execution aligns well with the artistic vision presented."}
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-auto pt-12 flex justify-between items-end">
          <div>
            <div className="w-48 border-b border-slate-300 mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Head of Judging Panel</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Official Hackathon System</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center opacity-30">
          <p className="text-[8px] font-bold uppercase tracking-[0.3em]">Creative Coding Hackathon 2026</p>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em]">Avantika University</p>
        </div>
      </div>
    );
  }
);

ScorecardPDF.displayName = "ScorecardPDF";
