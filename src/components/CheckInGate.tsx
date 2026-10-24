import { useEffect, useRef, useState } from "react";
import { checkInById, findRsvpForCheckIn, walkInRsvp, type CheckInMatch } from "@/lib/booking.server";
import { BusyLabel } from "@/components/Spinner";

// Entrance QR flow: find your name → confirm → checked in (show the desk for
// your badge) → lounge. Walk-ins register from the same screen. The email
// never comes back from a name pick, so the parent only gets one when the
// visitor typed it themselves (walk-in).
export type CheckedInAs = { id: string | null; name: string; email?: string };

const INTERESTS = ["Investment", "Distribution / partnership", "Pilot / trial opportunity", "General interest"];

// Site skin — the only part that differs between the three lounges.
const T = {
  label: "text-sm font-semibold text-white",
  field:
    "w-full rounded-[3px] bg-white px-4 py-3.5 text-[17px] text-navy placeholder:text-[#8a8a8a] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#00ccff]",
  smallField:
    "w-full rounded-[3px] bg-white px-3.5 py-2.5 text-base text-navy placeholder:text-[#8a8a8a] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#00ccff]",
  primary: "btn-node disabled:opacity-60",
  secondary: "btn-node-ghost",
  ghost: "text-[13px] font-semibold text-white/65 underline-offset-4 transition hover:text-yellow hover:underline",
  row: "flex w-full items-center justify-between gap-4 border-b border-white/15 py-3.5 text-left transition hover:bg-white/[0.05]",
  name: "text-[16px] font-bold text-white",
  meta: "text-[13px] text-white/50",
  tag: "shrink-0 rounded-[2px] bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70",
  error: "text-sm leading-relaxed text-[#ffb4a8]",
  done: "bg-yellow p-6 text-navy shadow-[6px_6px_0_0_#00ccff]",
  tick: "flex h-12 w-12 items-center justify-center bg-navy text-yellow",
  donePrimary: "btn-node-dark",
  big: "text-[28px] font-extrabold leading-tight tracking-tight",
  sub: "text-[16px] opacity-80",
  faint: "opacity-55",
  note: "text-sm leading-relaxed opacity-75",
  chip: "inline-flex items-center rounded-[3px] border px-3 py-1.5 text-[13px] font-semibold transition",
  chipOn: "border-yellow bg-white/10 text-white",
  chipOff: "border-white/15 text-white/70 hover:border-white/40",
};

export function CheckInGate(props: { loungeKey: string; onEnter: (me: CheckedInAs) => void; onUseEmail: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"search" | "confirm" | "walkin" | "done">("search");
  // On a phone the hero sits above this block; bring each new step into view.
  useEffect(() => {
    if (step !== "search") root.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);
  return (
    <div ref={root} className="scroll-mt-24">
      <Steps {...props} step={step} setStep={setStep} />
    </div>
  );
}

function Steps({
  step,
  setStep,
  loungeKey,
  onEnter,
  onUseEmail,
}: {
  loungeKey: string;
  onEnter: (me: CheckedInAs) => void;
  onUseEmail: () => void;
  step: "search" | "confirm" | "walkin" | "done";
  setStep: (s: "search" | "confirm" | "walkin" | "done") => void;
}) {
  const [q, setQ] = useState("");
  const [matches, setMatches] = useState<CheckInMatch[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [pick, setPick] = useState<CheckInMatch | null>(null);
  const [me, setMe] = useState<CheckedInAs | null>(null);
  const [counted, setCounted] = useState(true);
  const [at, setAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [w, setW] = useState({ fullName: "", organisation: "", jobTitle: "", email: "", primaryInterest: "" });
  const seq = useRef(0);

  useEffect(() => {
    if (step !== "search") return;
    const term = q.trim();
    if (term.replace(/\s/g, "").length < 2) {
      setMatches(null);
      return;
    }
    const n = ++seq.current;
    setSearching(true);
    const t = setTimeout(async () => {
      const res = await findRsvpForCheckIn({ data: { key: loungeKey, q: term } });
      if (n !== seq.current) return;
      setSearching(false);
      if (res.ok) setMatches(res.matches);
      else setErr("This QR code isn't valid any more. Please ask the desk.");
    }, 220);
    return () => clearTimeout(t);
  }, [q, step, loungeKey]);

  const finish = (who: CheckedInAs, recorded: boolean) => {
    setMe(who);
    setCounted(recorded);
    setAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setStep("done");
  };

  const confirm = async () => {
    if (!pick || busy) return;
    setBusy(true);
    setErr("");
    const res = await checkInById({ data: { key: loungeKey, rsvpId: pick.id } });
    setBusy(false);
    if (!res.ok) return setErr("Couldn't check you in. Please try again or ask the desk.");
    finish({ id: pick.id, name: pick.full_name }, res.recorded !== false);
  };

  const register = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");
    const res = await walkInRsvp({ data: { key: loungeKey, ...w } });
    setBusy(false);
    if (!res.ok) return setErr(res.message ?? "Something went wrong.");
    finish({ id: null, name: w.fullName.trim(), email: w.email.trim().toLowerCase() }, true);
  };

  if (step === "done" && me) {
    return (
      <div className={T.done} role="status">
        <span className={T.tick}>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className={`${T.big} mt-5`}>{counted ? "You're checked in" : "You're in"}</p>
        <p className={`${T.sub} mt-1`}>
          {me.name}
          {counted && <span className={T.faint}>, {at}</span>}
        </p>
        {counted && <p className={`${T.note} mt-4`}>Show this screen at the desk to collect your name badge.</p>}
        <button type="button" onClick={() => onEnter(me)} className={`${T.donePrimary} mt-6 w-full sm:w-auto`}>
          Enter the lounge
        </button>
      </div>
    );
  }

  if (step === "confirm" && pick) {
    return (
      <div>
        <p className={T.label}>Is this you?</p>
        <p className={`${T.big} mt-3`}>{pick.full_name}</p>
        <p className={`${T.sub} mt-1`}>
          {pick.organisation} <span className={T.faint}>· {pick.hint}</span>
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <button type="button" onClick={() => void confirm()} disabled={busy} className={T.primary}>
            <BusyLabel busy={busy} text="Checking in…">Yes, check me in</BusyLabel>
          </button>
          <button type="button" onClick={() => setStep("search")} className={T.ghost}>
            That's not me
          </button>
        </div>
        {err && <p role="alert" className={`${T.error} mt-4`}>{err}</p>}
      </div>
    );
  }

  if (step === "walkin") {
    const ready = w.fullName.trim() && w.organisation.trim() && w.jobTitle.trim() && /^\S+@\S+\.\S+$/.test(w.email.trim());
    const set = (k: keyof typeof w) => (e: { target: { value: string } }) => setW((v) => ({ ...v, [k]: e.target.value }));
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ready) void register();
        }}
      >
        <p className={T.label}>Not on the list? Register in 30 seconds.</p>
        <div className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <input className={T.smallField} placeholder="Full name" autoComplete="name" value={w.fullName} onChange={set("fullName")} aria-label="Full name" />
          <input className={T.smallField} placeholder="Organisation" autoComplete="organization" value={w.organisation} onChange={set("organisation")} aria-label="Organisation" />
          <input className={T.smallField} placeholder="Job title" autoComplete="organization-title" value={w.jobTitle} onChange={set("jobTitle")} aria-label="Job title" />
          <input className={T.smallField} type="email" inputMode="email" placeholder="Email" autoComplete="email" value={w.email} onChange={set("email")} aria-label="Email" />
        </div>
        <fieldset className="mt-5">
          <legend className={T.label}>What brings you here?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                type="button"
                aria-pressed={w.primaryInterest === i}
                onClick={() => setW((v) => ({ ...v, primaryInterest: i }))}
                className={`${T.chip} ${w.primaryInterest === i ? T.chipOn : T.chipOff}`}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <button type="submit" disabled={busy || !ready} className={T.primary}>
            <BusyLabel busy={busy} text="Registering…">Register and check in</BusyLabel>
          </button>
          <button type="button" onClick={() => setStep("search")} className={T.ghost}>
            Back to search
          </button>
        </div>
        {err && <p role="alert" className={`${T.error} mt-4`}>{err}</p>}
      </form>
    );
  }

  return (
    <div>
      <label htmlFor="checkin-name" className={T.label}>
        You're at the venue. Find your name to check in.
      </label>
      <input
        id="checkin-name"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setErr("");
        }}
        placeholder="Your name or company"
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        className={`${T.field} mt-2`}
      />
      <div className="min-h-[3rem]" aria-live="polite">
        {matches && matches.length > 0 && (
          <ul className="mt-1">
            {matches.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={T.row}
                  onClick={() => {
                    setPick(m);
                    setErr("");
                    setStep("confirm");
                  }}
                >
                  <span className="min-w-0">
                    <span className={`${T.name} block truncate`}>{m.full_name}</span>
                    <span className={`${T.meta} block truncate`}>{m.organisation}</span>
                  </span>
                  {m.checked_in && <span className={T.tag}>Checked in</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
        {matches && matches.length === 0 && !searching && <p className={`${T.meta} mt-3`}>No one by that name yet.</p>}
        {err && <p role="alert" className={`${T.error} mt-3`}>{err}</p>}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" onClick={() => setStep("walkin")} className={T.secondary}>
          I'm not on the list
        </button>
        <button type="button" onClick={onUseEmail} className={T.ghost}>
          Use my email instead
        </button>
      </div>
    </div>
  );
}
