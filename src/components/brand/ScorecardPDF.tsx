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

    // Style Constants
    const COLORS = {
      red: "#C10016",
      orange: "#FF6900",
      yellow: "#FFB81C",
      grey: "#7E7E82",
      lightGrey: "#F3F4F6",
      border: "#E5E7EB",
      text: "#1A1A1A",
      textMuted: "#6B7280"
    };

    return (
      <div 
        ref={ref}
        style={{
          width: "800px",
          minHeight: "1100px",
          padding: "60px",
          backgroundColor: "#ffffff",
          color: COLORS.text,
          fontFamily: "'Inter', sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative Background Elements */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", borderRadius: "50%", backgroundColor: COLORS.red + "08", marginRight: "-150px", marginTop: "-150px" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "200px", height: "200px", borderRadius: "50%", backgroundColor: COLORS.orange + "08", marginLeft: "-100px", marginBottom: "-100px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `3px solid ${COLORS.red}`, paddingBottom: "30px", marginBottom: "50px" }}>
          <div>
            <PDFLogo style={{ transform: "scale(1.2)", transformOrigin: "left" }} />
            <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: COLORS.grey, marginTop: "25px" }}>
              Official Evaluation Record
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontSize: "42px", fontFamily: "serif", fontWeight: "bold", color: COLORS.red, margin: 0 }}>Scorecard</h2>
            <p style={{ fontSize: "14px", color: COLORS.textMuted, marginTop: "5px" }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Team Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "50px" }}>
          <div>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: COLORS.textMuted, display: "block", marginBottom: "8px" }}>Participating Team</label>
            <h3 style={{ fontSize: "32px", fontFamily: "serif", fontWeight: "bold", color: "#000000", margin: 0 }}>{team.team_name}</h3>
            {team.member_names && (
              <p style={{ fontSize: "11px", fontWeight: "bold", color: COLORS.grey, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "6px" }}>
                {team.member_names.join(" • ")}
              </p>
            )}
            <p style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.orange, marginTop: "8px" }}>{team.category}</p>
          </div>
          <div style={{ backgroundColor: COLORS.lightGrey, padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: COLORS.textMuted, marginBottom: "4px" }}>Aggregate Score</label>
            <div style={{ fontSize: "56px", fontFamily: "serif", fontWeight: "bold", color: COLORS.red }}>
              {totalScore}<span style={{ fontSize: "20px", color: "#CBD5E1", marginLeft: "4px" }}>/100</span>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div style={{ marginBottom: "50px" }}>
          <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: COLORS.textMuted, display: "block", marginBottom: "12px" }}>Project Overview</label>
          <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "16px", borderLeft: `4px solid ${COLORS.yellow}` }}>
            <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.6", fontFamily: "serif", fontStyle: "italic", margin: 0 }}>
              "{team.description}"
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div style={{ marginBottom: "50px" }}>
          <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: COLORS.textMuted, display: "block", marginBottom: "24px" }}>Evaluation Matrix</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "Creativity & Originality", value: score.creativity_score },
              { label: "Technical Implementation", value: score.technical_score },
              { label: "Visual Design & Aesthetics", value: score.design_score },
              { label: "Theme Interpretation", value: score.theme_score },
              { label: "Interactivity & Engagement", value: score.engagement_score },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ width: "220px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>{item.label}</div>
                <div style={{ flex: 1, height: "10px", backgroundColor: COLORS.lightGrey, borderRadius: "5px", overflow: "hidden" }}>
                  <div 
                    style={{ height: "100%", width: `${(item.value || 0) * 5}%`, backgroundColor: COLORS.red, borderRadius: "5px" }}
                  />
                </div>
                <div style={{ width: "40px", textAlign: "right", fontSize: "18px", fontFamily: "serif", fontWeight: "bold", color: COLORS.text }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Judge Feedback */}
        <div style={{ padding: "30px", borderRadius: "24px", border: `1px solid ${COLORS.red}30`, backgroundColor: COLORS.red + "05", marginBottom: "50px" }}>
          <label style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", display: "block", marginBottom: "12px", color: COLORS.red }}>Judge's Remarks</label>
          <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", margin: 0 }}>
            {score.feedback || "Excellent demonstration of creative coding principles. The technical execution aligns well with the artistic vision presented."}
          </p>
        </div>

        {/* Signatures */}
        <div style={{ marginTop: "auto", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ width: "200px", borderBottom: `1px solid ${COLORS.border}`, marginBottom: "8px" }} />
            <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.textMuted }}>Head of Judging Panel</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.grey }}>Official Hackathon System</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: "30px", left: "60px", right: "60px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.4 }}>
          <p style={{ fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.3em" }}>Creative Coding Hackathon 2026</p>
          <p style={{ fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.3em" }}>Avantika University</p>
        </div>
      </div>
    );
  }
);

ScorecardPDF.displayName = "ScorecardPDF";
