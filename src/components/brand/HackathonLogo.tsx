"use client";

import React from "react";

export function HackathonLogo({ 
  className = "", 
  size = "md", 
  variant = "horizontal" 
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
  variant?: "horizontal" | "vertical";
}) {
  const sizeClasses = {
    sm: "scale-75 origin-center",
    md: "scale-100",
    lg: "scale-125 origin-center",
  };

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-start gap-5 ${className}`}>
        <img src="/avantika_logo.svg" alt="Avantika University" className="h-10 w-auto" />
        <div className="h-0.5 w-full max-w-[140px] bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow opacity-60 rounded-full" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
              Creative<span className="text-brand-red">Coding</span>
            </span>
            <div className="flex h-5 items-center px-1.5 rounded bg-brand-red/10 border border-brand-red/20">
              <span className="text-[8px] font-bold uppercase tracking-widest text-brand-red">2026</span>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-grey leading-none mt-2">
            HACKATHON
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-6 ${sizeClasses[size]} ${className}`}>
      {/* Avantika Logo */}
      <img src="/avantika_logo.svg" alt="Avantika University" className="h-12 w-auto" />
      
      {/* Separator */}
      <div className="h-10 w-px bg-gradient-to-b from-brand-red via-brand-orange to-brand-yellow opacity-40" />
      
      {/* Hackathon Text Content */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground whitespace-nowrap">
            Creative<span className="text-brand-red">Coding</span>
          </span>
          <div className="flex h-6 items-center px-2 rounded bg-brand-red/10 border border-brand-red/20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">2026</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-grey leading-none">
            H A C K A T H O N
          </span>
          <div className="flex-1 h-[1px] bg-brand-grey/20" />
          <div className="flex gap-1">
            <div className="h-1 w-1 rounded-full bg-brand-red" />
            <div className="h-1 w-1 rounded-full bg-brand-orange" />
            <div className="h-1 w-1 rounded-full bg-brand-yellow" />
          </div>
        </div>
      </div>
      
      {/* Decorative Brackets (Coding feel) */}
      <div className="hidden lg:flex items-center opacity-10 select-none ml-2">
        <span className="font-mono text-4xl leading-none">{"{"}</span>
        <div className="flex flex-col gap-1 mx-1">
          <div className="h-1 w-4 bg-foreground rounded-full" />
          <div className="h-1 w-2 bg-foreground rounded-full" />
          <div className="h-1 w-3 bg-foreground rounded-full" />
        </div>
        <span className="font-mono text-4xl leading-none">{"}"}</span>
      </div>
    </div>
  );
}
