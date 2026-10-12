import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import { Wordmark } from "@/components/Wordmark";
import { JUDGES } from "@/data/speakers";
import { companies } from "@/data/companies";
import { STARTUP_IMAGES, STARTUP_LOGOS } from "@/data/companyImages";
import {
  EVENT_ADDRESS,
  EVENT_DATE,
  EVENT_DAY_SHORT,
  EVENT_MAP_URL,
  EVENT_NAME,
  EVENT_TIME,
  EVENT_VENUE,
  CREDITS,
  MEETUP_ADDRESS,
  MEETUP_DAY_SHORT,
  MEETUP_MAP_URL,
  MEETUP_TIME,
  MEETUP_VENUE,
  ONE_ON_ONE_OPEN,
} from "@/data/timeslots";

export const Route = createFileRoute("/")({
  component: Landing,
});

const ORGANIZER_EMAIL = "support@lodestart.ai";
const FCK_SITE = "https://www.fintech.or.kr";
const KAKAOBANK_SITE = "https://www.kakaobank.com";

// The page's one idea: who each startup serves, and what it gives them.
// Wording condensed from each company's own English service overview.
const LEDGER: Record<string, [from: string, to: string]> = {
  "276holdings": ["SME suppliers", "settle-now, pay-later finance"],
  devd: ["Tenants & landlords", "rent paid by card"],
  marinachain: ["Shipping companies", "maritime carbon & finance data"],
  bigtechplus: ["Homeowners & lenders", "verified property collateral"],
  sionic: ["Financial institutions", "no-code AI agents"],
  aizen: ["Lenders & mobility platforms", "AI credit data"],
  canopy: ["Employees", "payroll-based financial wellness"],
  crosshub: ["Payment providers", "voice-AI authentication"],
};

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
        className="rounded-full border border-navy/25 px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy/5 sm:px-4 sm:py-2 sm:text-sm"
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

// Scroll reveal: marks [data-reveal] elements visible as they enter.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Pointer parallax for the hero art and scroll parallax for the dome:
// writes --mx/--my (−1..1) and --sy (px) on #top; CSS does the moving.
function useHeroParallax() {
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, mx = 0, my = 0;
    const paint = () => {
      hero.style.setProperty("--mx", mx.toFixed(3));
      hero.style.setProperty("--my", my.toFixed(3));
      hero.style.setProperty("--sy", `${Math.min(scrollY, 900) * 0.25}px`);
      raf = 0;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const onMove = (e: PointerEvent) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; queue(); };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", queue, { passive: true });
    return () => { removeEventListener("pointermove", onMove); removeEventListener("scroll", queue); cancelAnimationFrame(raf); };
  }, []);
}

// 3D tilt + light sheen for [data-tilt] cards, magnetic pull for [data-magnet].
function useTiltAndMagnet() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(hover: none)").matches) return;
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt],[data-magnet]");
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      if (t.hasAttribute("data-tilt")) {
        t.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`); t.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        t.style.setProperty("--px", `${((x + 0.5) * 100).toFixed(1)}%`); t.style.setProperty("--py", `${((y + 0.5) * 100).toFixed(1)}%`);
      } else {
        t.style.setProperty("--tx", `${(x * 14).toFixed(1)}px`); t.style.setProperty("--ty", `${(y * 10).toFixed(1)}px`);
      }
    };
    const onLeave = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt],[data-magnet]");
      if (t) ["--rx", "--ry", "--tx", "--ty"].forEach((v) => t.style.removeProperty(v));
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerout", onLeave, { passive: true });
    return () => { removeEventListener("pointermove", onMove); removeEventListener("pointerout", onLeave); };
  }, []);
}

// Hero art: the 2025 banner's gold faceted triangles. Each is a little
// pyramid of three facets in light, mid and deep gold.
// Placed in the margins and below the copy so they never sit on text
// (viewBox units; the SVG is cropped xMaxYMid at desktop width).
const FACETS: { x: number; y: number; s: number; r: number; slow?: boolean; p: string }[] = [
  { x: 6, y: 112, s: 0.42, r: 64, p: "parallax-2" },
  { x: 762, y: 92, s: 0.42, r: 96, slow: true, p: "parallax-3" },
  { x: 742, y: 300, s: 0.62, r: -28, p: "parallax-1" },
  { x: 96, y: 500, s: 0.7, r: 38, slow: true, p: "parallax-3" },
  { x: 470, y: 505, s: 1.05, r: -12, p: "parallax-1" },
]
function Facets() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-paper">
      <svg viewBox="0 0 800 640" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 h-full w-full max-md:opacity-30">
        {FACETS.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.r}) scale(${f.s})`} className={f.p}>
            <g className={`facet ${f.slow ? "facet-slow" : ""}`}>
              <polygon points="0,0 120,34 58,48" fill="#F4D45A" />
              <polygon points="120,34 58,48 70,118" fill="#D9A908" />
              <polygon points="0,0 58,48 70,118" fill="#E8BE1E" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Landing() {
  useReveal();
  useHeroParallax();
  useTiltAndMagnet();
  return (
    <div className="min-h-screen">
      {/* HERO — the 2025 banner lockup, then the ledger */}
      <section id="top" className="relative isolate overflow-hidden text-navy">
        <Facets />
        {/* Phones: wordmark row, then the menu row (four items never fit
            beside the wordmark at 390px); from md they share one line. */}
        <header className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="min-w-0">
            <Wordmark />
          </a>
          <nav className="-mx-2 flex items-center gap-1 text-sm font-semibold md:mx-0 md:gap-2">
            <a href="#startups" className="rounded-full px-2 py-1.5 text-navy/75 hover:text-navy md:px-3 md:py-2">Startups</a>
            {JUDGES.length > 0 && <a href="#judges" className="rounded-full px-2 py-1.5 text-navy/75 hover:text-navy md:px-3 md:py-2">Judges</a>}
            <a href="#about" className="rounded-full px-2 py-1.5 text-navy/75 hover:text-navy md:px-3 md:py-2">About</a>
            <a href="/lounge" className="rounded-full px-2 py-1.5 text-navy/75 hover:text-navy md:px-3 md:py-2">Lounge</a>
            <span className="ml-auto md:ml-1"><ContactOrganizer /></span>
          </nav>
        </header>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-32 pt-8 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pb-44 lg:pt-14">
          <div className="lg:pt-4">
            <p className="hero-in text-sm font-semibold text-gold">Fintech Demo Day · {EVENT_DAY_SHORT} 2026 · Singapore FinTech Festival week</p>
            {/* The banner lockup: FIN:NECT / Global / Singapore */}
            <h1 className="mt-5 font-display text-navy" aria-label="FIN:NECT Global Singapore">
              <span aria-hidden className="hero-word-clip block">
                <span className="hero-word text-[clamp(3.2rem,9vw,5.6rem)] font-extrabold leading-[1.02] tracking-tight" style={{ "--i": 0 } as CSSProperties}>
                  {/* .hero-word is inline-block, so the flex row lives inside it */}
                  <span className="inline-flex">
                    FIN
                    <span className="mx-[0.05em] inline-flex flex-col gap-[0.24em] pt-[0.3em] [&>span]:h-[0.16em] [&>span]:w-[0.16em]">
                      <span className="colon-dot" />
                      <span className="colon-dot" />
                    </span>
                    NECT
                  </span>
                </span>
              </span>
              <span aria-hidden className="hero-word-clip block">
                <span className="hero-word block text-[clamp(2.2rem,6vw,3.7rem)] font-semibold leading-[1.1] tracking-[0.42em] text-yellow" style={{ "--i": 1 } as CSSProperties}>
                  Global
                </span>
              </span>
              <span aria-hidden className="hero-word-clip block">
                <span className="hero-word block text-[clamp(2.2rem,6vw,3.7rem)] font-semibold leading-[1.1] tracking-tight" style={{ "--i": 2 } as CSSProperties}>
                  Singapore
                </span>
              </span>
            </h1>
            <p className="hero-in [--i:5] mt-6 max-w-md text-[1.0625rem] leading-relaxed text-muted-foreground">
              Korean fintechs selected by the Korea Fintech Support Center and sponsored by KakaoBank, in Singapore to
              meet investors, financial institutions and partners. Watch them pitch in the morning, then sit down with
              the ones that fit.
            </p>
            <div className="hero-in [--i:6] mt-8 flex flex-wrap gap-3">
              <Link to="/book" search={{ day: "7" }} data-magnet className="btn-hero magnet rounded-full px-6 py-3.5 text-sm font-semibold">
                RSVP for the Demo Day
              </Link>
              {ONE_ON_ONE_OPEN && (
                <Link to="/book" search={{ day: "5" }} data-magnet className="btn-outline-dark magnet rounded-full px-6 py-3.5 text-sm font-semibold">
                  Book a 1:1 meeting
                </Link>
              )}
            </div>
          </div>

          <ol className="ledger border-t border-navy/15 lg:mt-6" aria-label="Who each startup serves">
            {companies.map((c, i) => {
              const [from, to] = LEDGER[c.slug] ?? ["", c.sector];
              return (
                <li key={c.slug} style={{ "--d": `${120 + i * 70}ms` } as CSSProperties} className="ledger-row border-b border-navy/15">
                  <Link
                    to="/companies/$slug"
                    params={{ slug: c.slug }}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-3 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)_7rem] sm:py-3.5"
                  >
                    <span className="text-[15px] text-muted-foreground sm:text-base">{from}</span>
                    <span className="ledger-arrow hidden h-px self-center bg-yellow sm:block" aria-hidden />
                    <span className="col-start-1 text-lg font-semibold leading-snug text-navy sm:col-start-auto sm:text-xl">
                      <span className="sm:hidden" aria-hidden>→ </span>
                      {to}
                    </span>
                    <span className="col-start-2 row-span-2 row-start-1 self-center text-right text-xs font-semibold text-gold transition group-hover:text-navy sm:col-start-auto sm:row-auto sm:text-sm">
                      {c.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Cohort marquee: the names (logos once supplied) glide across the foot of the hero */}
        <div className="marquee relative border-t border-navy/10 bg-white/60 py-5" aria-hidden>
          <div className="marquee-track">
            {[...companies, ...companies].map((c, i) => (
              <span key={`${c.slug}-${i}`} className="mx-6 inline-flex shrink-0 items-center gap-6 font-display text-2xl font-semibold text-navy/70">
                {STARTUP_LOGOS[c.slug] ? (
                  <span className="inline-flex h-12 w-36 items-center justify-center rounded-lg bg-white/95 px-4">
                    <img src={STARTUP_LOGOS[c.slug]} alt="" className="max-h-7 max-w-full object-contain" />
                  </span>
                ) : (
                  c.name
                )}
                <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN — two days. One big line per card says what matters (day + time);
          everything else is small. Details repeat on the RSVP page. */}
      <section id="rsvp" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <h2 data-reveal className="max-w-xl text-3xl font-bold text-navy md:text-4xl">{EVENT_DATE.replace(" 2026", "")}</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          For investors, financial institutions and ecosystem partners. Join the morning, the afternoon or both.
        </p>

        <div data-reveal className="mt-10 grid gap-px rounded-2xl border border-border bg-border shadow-[var(--shadow-card)] [perspective:1200px] md:grid-cols-2">
          <article data-tilt className="tilt flex flex-col bg-card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-muted-foreground">Morning · Demo Day</h3>
            <p className="mt-2 font-display text-[clamp(1.9rem,4.2vw,2.75rem)] font-bold leading-none tracking-tight text-navy">
              {EVENT_TIME}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              IR pitches, then three rounds of 20-minute VC 1:1 meetings, run with Tenity.
            </p>
            <div className="mt-4">
              <Place venue={EVENT_VENUE} address={EVENT_ADDRESS} map={EVENT_MAP_URL} />
            </div>
            <div className="mt-auto pt-7">
              <Link to="/book" search={{ day: "7" }} className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                RSVP for the Demo Day
              </Link>
            </div>
          </article>

          <article data-tilt className="tilt flex flex-col bg-card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-muted-foreground">Afternoon · 1:1 business meetings</h3>
            <p className="mt-2 font-display text-[clamp(1.9rem,4.2vw,2.75rem)] font-bold leading-none tracking-tight text-navy">
              {MEETUP_TIME}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Three rounds with the startups you pick, after lunch.
            </p>
            <div className="mt-4">
              <Place venue={MEETUP_VENUE} address={MEETUP_ADDRESS} map={MEETUP_MAP_URL} />
            </div>
            <div className="mt-auto pt-7">
              {ONE_ON_ONE_OPEN ? (
                <Link to="/book" search={{ day: "5" }} className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Book a 1:1 meeting
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">Booking opens soon.</span>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* STARTUPS */}
      <section id="startups" className="border-t border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <h2 data-reveal className="text-3xl font-bold text-navy md:text-4xl">The startups</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Open a profile for more, or book a 1:1 straight away.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 [perspective:1200px] sm:gap-4 lg:grid-cols-4">
            {companies.map((c, i) => (
              <article key={c.slug} data-reveal style={{ "--rd": `${(i % 4) * 70}ms` } as CSSProperties} data-tilt className="card-startup tilt group flex flex-col overflow-hidden rounded-xl">
                <Link to="/companies/$slug" params={{ slug: c.slug }} className="relative block aspect-[3/2] overflow-hidden bg-hero-gradient">
                  {STARTUP_IMAGES[c.slug] ? (
                    <img
                      src={STARTUP_IMAGES[c.slug]}
                      alt={`${c.name}: ${c.sector}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    // No product photo yet: the "serves" line from the hero, set large.
                    <>
                      <span aria-hidden className="dotgrid absolute inset-0" />
                      <span className="absolute inset-0 flex items-end p-3 font-display text-lg font-semibold leading-tight text-white sm:p-4 sm:text-xl">
                        {LEDGER[c.slug]?.[1] ?? c.sector}
                      </span>
                    </>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                  <Link to="/companies/$slug" params={{ slug: c.slug }} className="flex h-8 items-center" title={c.name}>
                    {STARTUP_LOGOS[c.slug] ? (
                      <img src={STARTUP_LOGOS[c.slug]} alt={c.name} className="max-h-7 max-w-[120px] object-contain object-left sm:max-h-8 sm:max-w-[150px]" />
                    ) : (
                      <span className="font-display text-lg font-bold text-navy">{c.name}</span>
                    )}
                  </Link>
                  <div className="text-xs font-semibold text-primary">{c.sector}</div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{c.tagline}</p>
                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <Link
                      to="/companies/$slug"
                      params={{ slug: c.slug }}
                      className="rounded-full border border-primary px-3 py-2 text-center text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      View profile
                    </Link>
                    {ONE_ON_ONE_OPEN && (
                      <Link
                        to="/book"
                        search={{ day: "5", company: c.slug }}
                        className="rounded-full bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Book a 1:1 meeting
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JUDGES — hidden while the list in src/data/speakers.ts is empty.
          Same shape as the CMK site: centred, greyscale portraits. */}
      {JUDGES.length > 0 && (
        <section id="judges" className="relative isolate overflow-hidden bg-hero-gradient text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 md:py-24">
            <p data-reveal className="text-sm font-semibold text-yellow">Demo Day · {EVENT_DAY_SHORT}</p>
            <h2 data-reveal className="mt-2 text-3xl font-bold md:text-5xl">Who You'll Meet</h2>
            <div className="mt-12 grid grid-cols-2 justify-items-center gap-x-6 gap-y-10 md:grid-cols-4">
              {JUDGES.map((j, i) => (
                <div key={j.name} data-reveal style={{ "--rd": `${i * 90}ms` } as CSSProperties} className="group flex flex-col items-center text-center">
                  <img
                    src={j.photo}
                    alt={j.name}
                    loading="lazy"
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-white/90 grayscale transition duration-500 group-hover:scale-105 group-hover:ring-yellow md:h-40 md:w-40"
                  />
                  <div className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-yellow">{j.name}</div>
                  {j.title && <div className="mt-1 max-w-[15rem] text-sm leading-snug text-white/85">{j.title}</div>}
                  <div className="mt-0.5 max-w-[15rem] text-balance text-sm font-semibold leading-snug">{j.org}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOST + SPONSOR — names only until logos are supplied */}
      <section id="about" className="relative isolate overflow-hidden bg-hero-gradient text-white">
        <div aria-hidden className="dotgrid pointer-events-none absolute inset-0 -z-10" />
        <div data-reveal className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="max-w-2xl text-2xl font-bold md:text-3xl">About FIN:NECT Global</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
            A Korea Fintech Support Center programme that helps Korean fintech companies preparing for Singapore and
            global markets find local partners and investment. The cohort spends 17–21 November in Singapore during
            Singapore FinTech Festival week, with the Demo Day, 1:1 business meetings and visits to fintech institutions.
          </p>

          <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-lichen">Hosted by</p>
              <a href={FCK_SITE} target="_blank" rel="noopener noreferrer" className="mt-3 block font-display text-xl font-bold leading-snug hover:text-yellow">
                Korea Fintech Support Center
              </a>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Korea's public support centre for fintech companies, running programmes that help them grow at home
                and enter global markets.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-lichen">Sponsored by</p>
              <a href={KAKAOBANK_SITE} target="_blank" rel="noopener noreferrer" className="mt-3 block font-display text-xl font-bold leading-snug hover:text-yellow">
                KakaoBank
              </a>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Korea's leading internet-only bank, sponsoring the FIN:NECT programme.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6">
          <Wordmark />
          <div>
            <a href={`mailto:${ORGANIZER_EMAIL}`} className="font-semibold text-primary hover:underline">{ORGANIZER_EMAIL}</a>
          </div>
          <div className="w-full border-t border-border pt-6 text-xs">
            © {EVENT_NAME}. {CREDITS}.
          </div>
        </div>
      </footer>
    </div>
  );
}
