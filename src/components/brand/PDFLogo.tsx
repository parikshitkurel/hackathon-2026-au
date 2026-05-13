"use client";

import React from "react";

/**
 * A specialized version of the HackathonLogo that uses standard HEX colors 
 * to ensure compatibility with PDF generation tools (html2canvas).
 */
export function PDFLogo({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flex items-center ${className}`} style={{ display: 'flex', alignItems: 'center', ...style }}>
      {/* Avantika Logo */}
      <div style={{ flexShrink: 0, width: '180px' }}>
        <img src="/avantika_logo.svg" alt="Avantika University" style={{ height: '2.5rem', width: 'auto', display: 'block' }} />
      </div>
      
      {/* Separator */}
      <div style={{ height: '2.5rem', width: '1px', background: '#C10016', opacity: 0.4, margin: '0 20px', flexShrink: 0 }} />
      
      {/* Hackathon Text Content */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: '250px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#1A1A1A', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'serif', whiteSpace: 'nowrap' }}>
            Creative<span style={{ color: '#C10016' }}>Coding</span>
          </span>
          <div style={{ display: 'flex', height: '1.2rem', alignItems: 'center', padding: '0 6px', borderRadius: '4px', backgroundColor: '#C100161A', border: '1px solid #C1001633', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C10016' }}>2026</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7E7E82', lineHeight: 1, whiteSpace: 'nowrap' }}>
            H A C K A T H O N
          </span>
          <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#7E7E8233', minWidth: '40px' }} />
          <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
            <div style={{ height: '4px', width: '4px', borderRadius: '9999px', backgroundColor: '#C10016' }} />
            <div style={{ height: '4px', width: '4px', borderRadius: '9999px', backgroundColor: '#FF6900' }} />
            <div style={{ height: '4px', width: '4px', borderRadius: '9999px', backgroundColor: '#FFB81C' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
