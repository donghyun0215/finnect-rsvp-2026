// Programme wordmark (text until the centre supplies a logo). The mark is
// the colon in FIN:NECT, joined — matches the favicon. `compact`: mark only
// on phones, for crowded headers.
export function Wordmark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-bold tracking-tight ${light ? "text-white" : "text-navy"}`}>
      <svg viewBox="0 0 512 512" className="h-6 w-6 shrink-0" aria-hidden>
        <rect width="512" height="512" rx="104" fill={light ? "#ffffff" : "#1C1433"} />
        <path d="M190 176 C 330 176, 330 336, 190 336" fill="none" stroke="#8B74FF" strokeWidth="36" strokeLinecap="round" />
        <circle cx="190" cy="176" r="52" fill={light ? "#5B3DF5" : "#C6F432"} />
        <circle cx="190" cy="336" r="52" fill={light ? "#5B3DF5" : "#C6F432"} />
      </svg>
      <span className={`text-[15px] leading-none sm:text-base ${compact ? "max-sm:sr-only" : ""}`}>
        FIN:NECT
        {!compact && <span className={`ml-1.5 hidden font-sans font-medium sm:inline ${light ? "text-white/70" : "text-muted-foreground"}`}>Global Singapore 2026</span>}
      </span>
    </span>
  );
}
