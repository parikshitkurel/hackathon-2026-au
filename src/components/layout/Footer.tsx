"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border/5 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span>Developed with</span>
          <span className="text-brand-red animate-pulse">❤️</span>
          <span>by</span>
          <a 
            href="https://www.linkedin.com/in/parikshit-kurel/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-foreground font-bold tracking-tight hover:text-brand-red transition-colors cursor-pointer"
          >
            Parikshit Kurel
          </a>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-grey/40">
          Avantika University • Creative Coding 2026
        </div>
      </div>
    </footer>
  );
}
