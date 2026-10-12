// FIN:NECT wordmark after the 2025 banner: charcoal letters, gold colon.
// `compact`: hides "Global Singapore 2026" on phones, for crowded headers.
export function Wordmark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-2 font-display font-extrabold tracking-tight ${light ? "text-white" : "text-navy"}`}>
      <span className="inline-flex items-center text-[17px] leading-none sm:text-lg">
        FIN
        <span className="mx-[0.08em] inline-flex flex-col gap-[0.14em]" aria-hidden>
          <span className="colon-dot" />
          <span className="colon-dot" />
        </span>
        <span className="sr-only">:</span>
        NECT
      </span>
      <span className={`text-xs font-semibold tracking-[0.18em] text-yellow ${compact ? "max-sm:hidden" : ""}`}>Global</span>
      <span className={`text-xs font-medium ${light ? "text-white/70" : "text-muted-foreground"} ${compact ? "max-sm:hidden" : ""}`}>Singapore 2026</span>
    </span>
  );
}
