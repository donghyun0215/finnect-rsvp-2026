import { FinnectLogo } from "@/components/Brand";

// FIN:NECT 2026 logo with the programme name set after it in grey, as in
// the KV's "Program Identity" row (FIN:NECT Challenge / Demoday …).
// `compact`: hides "Demoday Singapore 2026" on phones, for crowded headers.
export function Wordmark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display ${light ? "text-white" : "text-navy"}`}>
      <FinnectLogo className="h-[17px] w-auto shrink-0 sm:h-[19px]" />
      <span className={`text-[15px] font-bold leading-none tracking-tight sm:text-base ${light ? "text-white/60" : "text-[#6d6d6d]"}`}>
        Global<span className={compact ? "max-sm:hidden" : ""}> Demoday Singapore 2026</span>
      </span>
    </span>
  );
}
