import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { Wordmark } from "@/components/Wordmark";
import { FinnectLogo, NodePattern } from "@/components/Brand";
import fckLogo from "@/assets/logos/fintech-center-korea.png";
import fckLogoWhite from "@/assets/logos/fintech-center-korea-white.png";
import kakaobankLogo from "@/assets/logos/kakaobank.png";
import kakaobankLogoWhite from "@/assets/logos/kakaobank-white.png";
import tenityLogoWhite from "@/assets/logos/tenity-white.png";
import myscLogoWhite from "@/assets/logos/mysc-white.png";
import lodestartLogoWhite from "@/assets/logos/lodestart-white.png";
import { JUDGES } from "@/data/speakers";
import { companies } from "@/data/companies";
import { STARTUP_LOGOS } from "@/data/companyImages";
import { Pair, PAIRS } from "@/components/Pair";
import { Sessions } from "@/components/Sessions";
import { useScrollMotion } from "@/lib/useScrollMotion";
import {
  EVENT_ADDRESS,
  EVENT_DATE,
  EVENT_MAP_URL,
  EVENT_NAME,
  EVENT_TIME,
  EVENT_VENUE,
  CREDITS,
  DEMO_AGENDA,
  TIMESLOTS,
  MEETUP_ADDRESS,
  MEETUP_MAP_URL,
  MEETUP_TIME,
  MEETUP_VENUE,
  ONE_ON_ONE_OPEN,
  meetupDay,
} from "@/data/timeslots";

export const Route = createFileRoute("/")({
  component: Landing,
});

const ORGANIZER_EMAIL = "support@lodestart.ai";
const FCK_SITE = "https://www.fintech.or.kr";
const KAKAOBANK_SITE = "https://www.kakaobank.com";


// Logos drawn as a mark with small text under it read tiny at wordmark height.
const SQUARE_MARKS = new Set(["276holdings", "bigtechplus", "atones"]);

// The node board: the startups set on the KV's stair, rising left to right
// (one step across, one step up). Sized from the cohort, so 12 → 7 × 6.
const STAIR: [x: number, y: number][] = companies.map((_, i) => [Math.ceil(i / 2), Math.ceil(companies.length / 2) - 1 - Math.floor(i / 2)]);
const BOARD_COLS = Math.max(...STAIR.map(([x]) => x)) + 1;
const BOARD_ROWS = Math.ceil(companies.length / 2);

function ContactOrganizer() {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ORGANIZER_EMAIL);
    } catch {
      // Locked-down browsers: the address is still shown below the button
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        title={ORGANIZER_EMAIL}
        className="rounded-[3px] border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-yellow hover:text-yellow sm:px-4 sm:py-2 sm:text-sm"
      >
        {copied ? "Email copied" : "Contact"}
      </button>
      {copied && (
        <span className="absolute right-0 top-full z-40 mt-2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-medium text-navy shadow-elegant">
          {ORGANIZER_EMAIL}
        </span>
      )}
    </div>
  );
}

function Place({ venue, address, map }: { venue: string; address: string; map: string }) {
  return (
    <div className="text-sm text-navy">
      {map ? (
        <a href={map} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-primary/30 underline-offset-2 hover:text-primary">
          {venue}
        </a>
      ) : (
        <span className="font-semibold">{venue}</span>
      )}
      <span className="text-muted-foreground">, {address}</span>
    </div>
  );
}



// Hero: the startups as nodes on the KV stair. One is "lit" at a time
// (auto-advancing until the visitor points at one); the readout names it.
function NodeBoard() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % companies.length), 2600);
    return () => clearInterval(t);
  }, [held]);
  const lit = companies[active];
  const [who, what] = PAIRS[lit.slug] ?? ["", lit.sector];
  const at = new Map(STAIR.map(([x, y], i) => [`${x},${y}`, i]));
  return (
    <div className="w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px]" onMouseLeave={() => setHeld(false)}>
      <div className="board grid gap-2 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, minmax(0, 1fr))` }} role="list" aria-label={`The ${companies.length} startups`}>
        {Array.from({ length: BOARD_COLS * BOARD_ROWS }, (_, k) => {
          const x = k % BOARD_COLS, y = Math.floor(k / BOARD_COLS);
          const i = at.get(`${x},${y}`);
          if (i === undefined) return <span key={k} aria-hidden className="board-cell" />;
          const c = companies[i];
          return (
            <Link
              key={k}
              role="listitem"
              to="/companies/$slug"
              params={{ slug: c.slug }}
              aria-label={`${c.name}: ${(PAIRS[c.slug] ?? ["", c.sector]).join(" — ")}`}
              onMouseEnter={() => { setHeld(true); setActive(i); }}
              onFocus={() => { setHeld(true); setActive(i); }}
              className={`board-node ${i === active ? "is-lit" : ""}`}
              style={{ "--i": i } as CSSProperties}
            >
              <span className="board-num">{i + 1}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 min-h-[7.5rem] border-t border-white/15 pt-5" aria-live="polite">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-[8.5rem] shrink-0 items-center justify-center rounded-[3px] bg-white px-3">
            {STARTUP_LOGOS[lit.slug] ? (
              <img src={STARTUP_LOGOS[lit.slug]} alt="" className={`${SQUARE_MARKS.has(lit.slug) ? "max-h-10" : "max-h-7"} max-w-full object-contain`} />
            ) : (
              <span className="text-sm font-extrabold tracking-tight text-navy">{lit.name}</span>
            )}
          </span>
          <div className="min-w-0">
            <div className="text-lg font-bold text-white">{lit.name}</div>
            <div className="text-xs text-white/50">{lit.sector}</div>
          </div>
        </div>
        <p className="mt-3 text-[15px] leading-snug sm:text-base"><Pair who={who} what={what} dark /></p>
      </div>
    </div>
  );
}

// The ruler and the Thursday card show Thursday's rounds; Friday has its own card.
const THU_SLOTS = TIMESLOTS.filter((t) => t.day === "thu");
const FRI_SLOTS = TIMESLOTS.filter((t) => t.day === "fri");

// One shared clock for the day: 08:30–17:30, both sessions placed to scale.
const DAY_START = 8.5, DAY_END = 17.5;
const toH = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};
const pct = (hhmm: string) => ((toH(hhmm) - DAY_START) / (DAY_END - DAY_START)) * 100;
const span = (range: string) => range.split("–").map((v) => toH(v.trim())) as [number, number];
const within = (h: number | null, range: string) => {
  if (h === null) return false;
  const [a, b] = span(range);
  return h >= a && h < b;
};
const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

// What is happening at hour h, in the words of the agenda.
function whatsOn(h: number): [where: "am" | "pm" | null, what: string] {
  for (const [t, item] of DEMO_AGENDA) if (within(h, t)) return ["am", item];
  const first = span(THU_SLOTS[0].time)[0];
  if (h < 9) return [null, "Doors open at 80RR Fintech Hub"];
  if (h < first) return [null, "Lunch and networking"];
  for (const t of THU_SLOTS) if (within(h, t.time)) return ["pm", `${t.label}: 1:1 with a startup of your choice`];
  if (h < span(THU_SLOTS[THU_SLOTS.length - 1].time)[1]) return ["pm", "Short break between rounds"];
  return [null, "That's a wrap"];
}

function DayRuler({ at, onScrub }: { at: number | null; onScrub: (h: number | null) => void }) {
  const ticks = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const f = at === null ? 0 : ((at - DAY_START) / (DAY_END - DAY_START)) * 100;
  const what = at === null ? null : whatsOn(at)[1];
  return (
    <div
      aria-hidden
      data-reveal="ruler"
      className="ruler relative hidden h-24 cursor-crosshair select-none md:block"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const h = DAY_START + x * (DAY_END - DAY_START);
        onScrub(Math.round(h * 12) / 12); // snap to 5 minutes
      }}
      onMouseLeave={() => onScrub(null)}
    >
      <div className="ruler-band absolute inset-x-0 top-9 h-[6px] bg-brand-band" />
      {ticks.map((t, i) => (
        <span key={t} className="ruler-tick absolute top-0 -translate-x-1/2 text-[11px] tabular-nums text-[#6d6d6d]" style={{ left: `${pct(t)}%`, "--d": `${i * 60}ms` } as CSSProperties}>
          {t}
          <span className="mx-auto mt-[22px] block h-3 w-px bg-navy/20" />
        </span>
      ))}
      <span className="ruler-seg absolute top-[30px] flex h-5 items-center bg-navy px-2 text-[11px] font-semibold text-white" style={{ left: `${pct("09:00")}%`, width: `${pct("12:30") - pct("09:00")}%`, "--d": "350ms" } as CSSProperties}>Demo Day</span>
      <span className="ruler-tick absolute top-[56px] text-[11px] text-[#6d6d6d]" style={{ left: `${pct("12:30")}%`, "--d": "700ms" } as CSSProperties}>Lunch and networking</span>
      {THU_SLOTS.map((t, i) => {
        const [a, b] = t.time.split("–").map((v) => v.trim());
        return <span key={t.id} className="ruler-seg absolute top-[30px] flex h-5 items-center bg-yellow px-2 text-[11px] font-semibold text-navy ring-1 ring-navy/10" style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%`, "--d": `${800 + i * 140}ms` } as CSSProperties}>{t.label}</span>;
      })}
      {at !== null && (
        <span className="pointer-events-none absolute top-[22px] bottom-0 w-px bg-navy" style={{ left: `${f}%` }}>
          <span className={`absolute top-[52px] whitespace-nowrap rounded-[3px] bg-navy px-2.5 py-1.5 text-xs text-white shadow-[3px_3px_0_0_#ffe300] ${f > 70 ? "right-2" : "left-2"}`}>
            <b className="tabular-nums text-yellow">{fmt(at)}</b> <span className="ml-1">{what}</span>
          </span>
        </span>
      )}
    </div>
  );
}

function Landing() {
  useScrollMotion();
  const [at, setAt] = useState<number | null>(null);
  const hot = at === null ? null : whatsOn(at)[0];
  return (
    <div className="min-h-screen">
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px]">
        <div id="scroll-progress" className="h-full origin-left scale-x-0 bg-brand-band" />
      </div>
      {/* HERO — black ground of the KV cover; the startups as nodes */}
      <section id="top" className="relative isolate overflow-hidden bg-navy text-white">
        <header className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="min-w-0">
            <Wordmark light />
          </a>
          <nav className="-mx-1.5 flex items-center gap-0 text-[12.5px] font-semibold min-[380px]:text-[13px] sm:text-sm md:mx-0 md:gap-2">
            <a href="#rsvp" className="nav-link">RSVP</a>
            <a href="#startups" className="nav-link">Startups</a>
            <a href="#about" className="nav-link">About</a>
            <a href="/lounge" className="nav-link whitespace-nowrap">Networking Lounge</a>
            <span className="ml-auto md:ml-1"><ContactOrganizer /></span>
          </nav>
        </header>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20 lg:pb-28 lg:pt-16">
          <div>
            <p className="hero-in text-sm text-white/60">19–20 November 2026 · Singapore FinTech Festival week</p>
            <h1 className="mt-6" aria-label="FIN:NECT Global Demoday Singapore 2026">
              <span aria-hidden className="hero-in block [--i:1]">
                <FinnectLogo className="h-[clamp(2.8rem,8.4vw,5.6rem)] w-auto text-white" />
              </span>
              <span aria-hidden className="hero-in mt-4 block max-w-[13ch] text-[clamp(2rem,5.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-tight text-white/45 [--i:2]">
                Global Demoday Singapore 2026
              </span>
            </h1>
            <p className="hero-in mt-8 max-w-[34rem] text-[1.0625rem] leading-relaxed text-white/75 [--i:3]">
              Twelve Korean fintechs in Singapore with the Korea Fintech Support Center's FIN:NECT programme, sponsored
              by KakaoBank. See the Demo Day on Thursday morning, then meet the ones that fit your business at a 1:1 on
              Thursday afternoon or Friday.
            </p>
            <div className="hero-in mt-9 flex flex-wrap gap-3 [--i:4]">
              <Link to="/book" search={{ day: "7" }} className="btn-node">Request to join the Demo Day</Link>
              {ONE_ON_ONE_OPEN && (
                <Link to="/book" search={{ day: "5" }} className="btn-node-ghost">Book a 1:1 meeting</Link>
              )}
            </div>
          </div>
          <div className="hero-in flex justify-center [--i:2] lg:justify-end">
            <div id="hero-board" className="flex w-full justify-center will-change-transform lg:justify-end">
              <NodeBoard />
            </div>
          </div>
        </div>
        <div aria-hidden className="h-2 bg-brand-band" />
      </section>

      {/* THE DAY — one ruler, two sessions */}
      <section id="rsvp" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 data-reveal="wipe" className="text-3xl font-bold text-navy md:text-[2.6rem] md:leading-tight">{EVENT_DATE.replace(" 2026", "")}</h2>
          <p data-reveal="rise" className="max-w-sm text-[15px] text-[#6d6d6d] [--d:400ms]">Come for the Demo Day, a 1:1 or both. The Demo Day is closed-door and host-approved; the 1:1 meetings are booked directly.</p>
        </div>

        <div className="mt-12"><DayRuler at={at} onScrub={setAt} /></div>

        <div className="mt-4 grid gap-10 md:mt-8 md:grid-cols-2 md:gap-14">
          <article data-reveal="session" data-hot={hot === "am" || undefined} className="session flex flex-col pt-6 [--bar:var(--navy)]">
            <p className="text-sm font-semibold text-[#6d6d6d]">Morning, with Tenity</p>
            <h3 className="mt-1 text-2xl font-bold text-navy">Demo Day <span className="tabular-nums text-[#6d6d6d]">{EVENT_TIME}</span></h3>
            <ol className="mt-5 divide-y divide-navy/10 border-y border-navy/10">
              {DEMO_AGENDA.map(([t, item], i) => (
                <li key={t} className={`agenda-row grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 text-sm ${within(at, t) ? "is-now" : ""}`} style={{ "--i": i } as CSSProperties}>
                  <span className="tabular-nums text-[#6d6d6d]">{t}</span>
                  <span className="text-navy">{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-5">
              <Place venue={EVENT_VENUE} address={EVENT_ADDRESS} map={EVENT_MAP_URL} />
              <Link to="/book" search={{ day: "7" }} className="btn-node mt-7">Request to join the Demo Day</Link>
            </div>
          </article>

          <article data-reveal="session" data-hot={hot === "pm" || undefined} className="session flex flex-col pt-6 [--bar:var(--yellow)] [--d:150ms]">
            <p className="text-sm font-semibold text-[#6d6d6d]">Afternoon</p>
            <h3 className="mt-1 text-2xl font-bold text-navy">1:1 business meetings <span className="tabular-nums text-[#6d6d6d]">{MEETUP_TIME}</span></h3>
            <ol className="mt-5 divide-y divide-navy/10 border-y border-navy/10">
              {THU_SLOTS.map((t, i) => (
                <li key={t.id} className={`agenda-row grid grid-cols-[7.5rem_1fr] items-center gap-3 py-2.5 text-sm ${within(at, t.time) ? "is-now" : ""}`} style={{ "--i": i } as CSSProperties}>
                  <span className="tabular-nums text-[#6d6d6d]">{t.time}</span>
                  <span className="flex items-center gap-2 text-navy"><span aria-hidden className="h-2.5 w-2.5 bg-yellow ring-1 ring-navy/15" />{t.label}: a startup of your choice</span>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-5">
              <Place venue={MEETUP_VENUE} address={MEETUP_ADDRESS} map={MEETUP_MAP_URL} />
              {ONE_ON_ONE_OPEN ? (
                <Link to="/book" search={{ day: "5", on: "thu" }} className="btn-node-dark mt-7">Book a Thursday 1:1</Link>
              ) : (
                <p className="mt-7 text-sm text-[#6d6d6d]">Booking opens soon.</p>
              )}
            </div>
          </article>
        </div>

        {/* FRIDAY — a second day of 1:1s (morning and afternoon), set under Thursday */}
        <div className="mt-16 grid gap-10 border-t border-navy/15 pt-12 md:mt-20 md:grid-cols-2 md:gap-14">
          <div>
            <h2 data-reveal="wipe" className="text-3xl font-bold text-navy md:text-[2.6rem] md:leading-tight">{meetupDay("fri").date.replace(" 2026", "")}</h2>
            <p data-reveal="rise" className="mt-4 max-w-sm text-[15px] text-[#6d6d6d] [--d:300ms]">
              A second day of 1:1 meetings, morning and afternoon, for anyone who can't make Thursday and for two
              startups who are only meeting guests on Friday.
            </p>
          </div>
          <article data-reveal="session" className="session flex flex-col pt-6 [--bar:var(--yellow)]">
            <p className="text-sm font-semibold text-[#6d6d6d]">Morning &amp; afternoon</p>
            <h3 className="mt-1 text-2xl font-bold text-navy">1:1 business meetings <span className="text-[#6d6d6d]">{meetupDay("fri").time}</span></h3>
            <ol className="mt-5 divide-y divide-navy/10 border-y border-navy/10">
              {FRI_SLOTS.map((t, i) => (
                <li key={t.id} className="agenda-row grid grid-cols-[7.5rem_1fr] items-center gap-3 py-2.5 text-sm" style={{ "--i": i } as CSSProperties}>
                  <span className="tabular-nums text-[#6d6d6d]">{t.time}</span>
                  <span className="flex items-center gap-2 text-navy"><span aria-hidden className="h-2.5 w-2.5 bg-yellow ring-1 ring-navy/15" />{t.label}: a startup of your choice</span>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-5">
              <div><Place venue={meetupDay("fri").venue} address={meetupDay("fri").address} map={meetupDay("fri").mapUrl} /></div>
              {ONE_ON_ONE_OPEN ? (
                <Link to="/book" search={{ day: "5", on: "fri" }} className="btn-node-dark mt-7">Book a Friday 1:1</Link>
              ) : (
                <p className="mt-7 text-sm text-[#6d6d6d]">Booking opens soon.</p>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* STARTUPS — a directory, one row per company */}
      <section id="startups" className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 data-reveal="wipe" className="text-3xl font-bold text-navy md:text-[2.6rem]">The startups</h2>
            <NodePattern name="connect" className="hidden h-10 w-10 text-yellow sm:block" />
          </div>
          <ul className="mt-10 border-t border-navy/15">
            {companies.map((c) => {
              const [who, what] = PAIRS[c.slug] ?? ["", c.sector];
              return (
                <li key={c.slug} data-reveal="row" className="startup-row group grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-navy/15 py-6 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-center md:gap-8">
                  <Link to="/companies/$slug" params={{ slug: c.slug }} className="logo-tile flex h-14 w-full items-center justify-center self-start rounded-[3px] bg-white px-2.5 md:h-16 md:w-40 md:self-auto md:px-4 shadow-[0_1px_0_rgb(30_30_30/0.06)]" aria-label={c.name}>
                    {STARTUP_LOGOS[c.slug] ? (
                      <img src={STARTUP_LOGOS[c.slug]} alt="" className={`${SQUARE_MARKS.has(c.slug) ? "max-h-12" : "max-h-9"} max-w-full object-contain`} />
                    ) : (
                      <span className="text-lg font-bold text-navy">{c.name}</span>
                    )}
                  </Link>
                  <div className="row-body min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <Link to="/companies/$slug" params={{ slug: c.slug }} className="text-xl font-bold text-navy hover:underline">{c.name}</Link>
                      <span className="text-xs text-[#6d6d6d]">{c.sector}</span>
                    </div>
                    <p className="mt-1.5 text-[15px] leading-snug"><Pair who={who} what={what} /></p>
                    <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm leading-relaxed text-[#6d6d6d]">{c.tagline}</p>
                    <Sessions slug={c.slug} className="mt-3" />
                  </div>
                  <div className="row-actions col-span-2 flex gap-2 md:col-span-1 md:flex-col md:items-stretch">
                    <Link to="/companies/$slug" params={{ slug: c.slug }} className="btn-node-line">View profile</Link>
                    {ONE_ON_ONE_OPEN && (
                      <Link to="/book" search={{ day: "5", company: c.slug }} className="btn-node-dark">Book a 1:1</Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* JUDGES — hidden while the list in src/data/speakers.ts is empty */}
      {JUDGES.length > 0 && (
        <section id="judges" className="bg-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 md:py-24">
            <h2 className="text-3xl font-bold md:text-5xl">Who you'll meet</h2>
            <div className="mt-12 flex flex-wrap justify-center gap-10">
              {JUDGES.map((j) => (
                <div key={j.name} className="flex w-40 flex-col items-center text-center md:w-56">
                  <img src={j.photo} alt={j.name} loading="lazy" className="h-32 w-32 object-cover grayscale md:h-40 md:w-40" />
                  <div className="mt-4 text-lg font-bold text-yellow">{j.name}</div>
                  {j.title && <div className="mt-1 text-sm text-white/80">{j.title}</div>}
                  <div className="mt-0.5 text-sm font-semibold">{j.org}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT — host, sponsor, partners */}
      <section id="about" className="relative isolate overflow-hidden bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <h2 data-reveal="wipe" className="max-w-2xl text-2xl font-bold md:text-3xl">About FIN:NECT Global</h2>
          <p data-reveal="rise" className="mt-4 max-w-2xl leading-relaxed text-white/75 [--d:300ms]">
            A Korea Fintech Support Center programme that helps Korean fintech companies preparing for Singapore and
            global markets find local partners and investment. The cohort spends 17–21 November in Singapore during
            Singapore FinTech Festival week, with the Demo Day, 1:1 business meetings and visits to fintech institutions.
          </p>
          <div data-reveal="stagger" className="mt-12 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.35fr)]">
            <div>
              <p className="text-sm text-white/50">Hosted by</p>
              <a href={FCK_SITE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-12 items-center">
                <img src={fckLogoWhite} alt="Korea Fintech Support Center (Fintech Center Korea)" className="h-12 w-auto" />
              </a>
              <p className="mt-4 text-sm leading-relaxed text-white/70">Korea's public support centre for fintech companies, helping them grow at home and enter global markets.</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Sponsored by</p>
              <a href={KAKAOBANK_SITE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-12 items-center">
                <img src={kakaobankLogoWhite} alt="KakaoBank" className="h-8 w-auto" />
              </a>
              <p className="mt-4 text-sm leading-relaxed text-white/70">Korea's leading internet-only bank, sponsoring the FIN:NECT programme.</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Partners</p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <li><a href="https://www.mysc.co.kr" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center"><img src={myscLogoWhite} alt="MYSC" className="h-[22px] w-auto" /></a></li>
                <li><a href="https://www.lodestart.ai" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center"><img src={lodestartLogoWhite} alt="LodestarT" className="h-7 w-auto" /></a></li>
                <li><a href="https://www.tenity.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center"><img src={tenityLogoWhite} alt="Tenity" className="h-6 w-auto" /></a></li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-white/70">MYSC runs the FIN:NECT programme, LodestarT the Singapore programme and 1:1 meetings, and Tenity the Demo Day with investors at 80RR Fintech Hub.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6">
          <Wordmark />
          <div className="flex items-center gap-6">
            <img src={fckLogo} alt="Korea Fintech Support Center" className="h-8 w-auto" />
            <img src={kakaobankLogo} alt="KakaoBank" className="h-6 w-auto" />
          </div>
          <div>
            <a href={`mailto:${ORGANIZER_EMAIL}`} className="font-semibold text-navy underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{ORGANIZER_EMAIL}</a>
          </div>
          <div className="w-full border-t border-border pt-6 text-xs">
            © {EVENT_NAME}. {CREDITS}.
          </div>
        </div>
      </footer>
    </div>
  );
}
