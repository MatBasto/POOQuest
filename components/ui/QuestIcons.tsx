import type { ReactNode } from "react";

const strokes: Record<string, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/><path d="M9 21h6"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.7 8.3-2.3 5.1-5.1 2.3 2.3-5.1z"/></>,
  chart: <><path d="M4 20V5m0 15h16"/><path d="m7 15 4-4 3 2 5-6"/></>,
  trophy: <><path d="M7 4h10v6a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v3a4 4 0 0 0 3 4m10-7h3v3a4 4 0 0 1-3 4m-5 2v5m-4 0h8"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.5 1.7c-.6.6-2 1.2-2 3.3m0 3v.2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  spark: <><path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3z"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  code: <><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/></>,
};

export function NavIcon({ name, size = 21 }: { name: keyof typeof strokes; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{strokes[name]}</svg>;
}

/** Símbolos geométricos originales, no emojis, con silueta propia para cada pilar. */
export function TerritorySigil({ kind, size = 80 }: { kind: string; size?: number }) {
  return (
    <svg className="v7-sigil" width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="43" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="4 6"/>
      {kind === "abstraccion" ? <>
        <path d="M50 12 84 32v36L50 88 16 68V32z" stroke="currentColor" strokeWidth="2"/>
        <path d="m50 28 22 13v18L50 72 28 59V41z" fill="currentColor" fillOpacity=".13" stroke="currentColor" strokeWidth="3"/>
        <path d="M50 28v44M28 41l22 13 22-13" stroke="currentColor" strokeWidth="2"/>
      </> : kind === "encapsulamiento" ? <>
        <path d="M50 17 80 29v22c0 20-12 32-30 39C32 83 20 71 20 51V29z" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity=".11"/>
        <rect x="36" y="45" width="28" height="24" rx="5" fill="currentColor" fillOpacity=".2" stroke="currentColor" strokeWidth="3"/>
        <path d="M42 45v-6a8 8 0 0 1 16 0v6m-8 10v5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </> : kind === "herencia" ? <>
        <rect x="36" y="11" width="28" height="18" rx="4" stroke="currentColor" strokeWidth="3"/>
        <path d="M50 29v20M22 49h56M22 49v12m28-12v12m28-12v12" stroke="currentColor" strokeWidth="3"/>
        <rect x="9" y="61" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity=".12"/>
        <rect x="37" y="61" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity=".12"/>
        <rect x="65" y="61" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity=".12"/>
      </> : <>
        <path d="M50 13c-13 13-22 24-22 37a22 22 0 0 0 44 0C72 37 63 26 50 13Z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="3"/>
        <circle cx="42" cy="51" r="11" stroke="currentColor" strokeWidth="3"/>
        <path d="m53 42 13 12-13 12m-3 8 14-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </>}
    </svg>
  );
}
