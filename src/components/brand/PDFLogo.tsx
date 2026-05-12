"use client";

import React from "react";

/**
 * A specialized version of the HackathonLogo that uses standard HEX colors 
 * to ensure compatibility with PDF generation tools (html2canvas).
 */
export function PDFLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-6 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      {/* Avantika Logo */}
      <img src="/avantika_logo.svg" alt="Avantika University" className="h-12 w-auto" style={{ height: '3rem', width: 'auto' }} />
      
      {/* Separator */}
      <div style={{ height: '2.5rem', width: '1px', background: 'linear-gradient(to bottom, #C10016, #FF6900, #FFB81C)', opacity: 0.4 }} />
      
      {/* Hackathon Text Content */}
      <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="font-serif text-2xl font-bold tracking-tight" style={{ color: '#1A1A1A', fontSize: '1.5rem' }}>
            Creative<span style={{ color: '#C10016' }}>Coding</span>
          </span>
          <div style={{ display: 'flex', height: '1.5rem', alignItems: 'center', padding: '0 0.5rem', borderRadius: '4px', backgroundColor: '#C100161A', border: '1px solid #C1001633' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C10016' }}>2026</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#7E7E82', lineHeight: 1 }}>
            H A C K A T H O N
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#7E7E8233' }} />
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <div style={{ height: '4px', width: '4px', borderRadius: '9999px', backgroundColor: '#C10016' }} />
            <div style={{ height: '4px', width: '4px', borderRadius: '9999px', backgroundColor: '#FF6900' }} />
            <div style={{ height: '4px', width: '4px', borderRadius: '9999px', backgroundColor: '#FFB81C' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
