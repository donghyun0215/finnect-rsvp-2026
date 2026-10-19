import { companySessions, SESSION_LABELS, type Session } from "@/data/timeslots";

const ORDER: Session[] = ["demo", "thu", "fri"];

// Where a startup can be met, as three node squares: filled when the company
// is at that session, hollow when it isn't (MYSC's per-company open/close).
export function Sessions({ slug, dark = false, className = "" }: { slug: string; dark?: boolean; className?: string }) {
  const on = new Set(companySessions(slug));
  const label = ORDER.filter((s) => on.has(s)).map((s) => SESSION_LABELS[s]).join(", ");
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${className}`} aria-label={`Meet them at: ${label}`}>
      {ORDER.map((s) => {
        const open = on.has(s);
        return (
          <li
            key={s}
            aria-hidden={!open}
            className={`inline-flex items-center gap-1.5 ${
              open ? (dark ? "text-white/85" : "text-navy") : dark ? "text-white/30 line-through" : "text-navy/30 line-through"
            }`}
          >
            <span
              aria-hidden
              className={`h-2.5 w-2.5 shrink-0 ${open ? "bg-yellow ring-1 ring-navy/15" : dark ? "ring-1 ring-white/30" : "ring-1 ring-navy/25"}`}
            />
            {SESSION_LABELS[s]}
          </li>
        );
      })}
    </ul>
  );
}
