import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Wordmark } from "@/components/Wordmark";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { companies, getCompanyBySlug, type Company } from "@/data/companies";
import { HIGHLIGHTS } from "@/data/profileHighlights";
import { useScrollMotion } from "@/lib/useScrollMotion";
import { EVENT_DATE, EVENT_VENUE, ONE_ON_ONE_OPEN, EVENT_NAME, CREDITS, companySessions } from "@/data/timeslots";
import { Sessions } from "@/components/Sessions";
import { STARTUP_LOGOS } from "@/data/companyImages";
import { Pair, PAIRS } from "@/components/Pair";

export const Route = createFileRoute("/companies/$slug")({
  component: CompanyOnePager,
  loader: ({ params }) => {
    const company = getCompanyBySlug(params.slug);
    if (!company) throw notFound();
    return company;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${EVENT_NAME}` },
          { name: "description", content: loaderData.tagline },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold text-navy">Company not found</h1>
        <Link to="/" hash="startups" className="btn-node-dark mt-6">
          All startups
        </Link>
      </div>
    </div>
  ),
});

// Profile, in reading order: the pitch in one screen (who it's for, three
// numbers, the ask), then problem → fix, how it works (tabs), traction,
// who should meet them, and the team. The full one-pager text sits under
// the editorial headlines so nothing MYSC supplied is lost.

function Points({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className={`flex gap-3 text-[15px] leading-relaxed ${dark ? "text-white/80" : "text-navy/80"}`}>
          <span aria-hidden className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 ${dark ? "bg-yellow" : "bg-navy"}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function HowItWorks({ company }: { company: Company }) {
  const tabs = [
    { id: "features", label: "Key features", items: company.keyFeatures },
    { id: "model", label: "Business model", items: company.businessModel },
    { id: "for", label: "Who it's for", items: company.targetAudience },
  ].filter((t) => t.items.length);
  const [on, setOn] = useState(0);
  if (!tabs.length) return null;
  const move = (d: number) => setOn((i) => (i + d + tabs.length) % tabs.length);
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <h2 data-reveal="wipe" className="text-3xl font-bold text-navy md:text-4xl">How it works</h2>
      <div data-reveal="rise" className="mt-8">
        <div
          role="tablist"
          aria-label="How it works"
          className="flex flex-wrap gap-2"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") move(1);
            if (e.key === "ArrowLeft") move(-1);
          }}
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === on}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === on ? 0 : -1}
              onClick={() => setOn(i)}
              className={`tab-node ${i === on ? "is-on" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tabs.map((t, i) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            hidden={i !== on}
            className="tab-panel mt-6 grid gap-4 md:grid-cols-3"
          >
            {t.items.map((item, k) => (
              <div key={k} className="feature-card" style={{ "--i": k } as CSSProperties}>
                <span aria-hidden className="block h-3 w-3 bg-yellow ring-1 ring-navy/15" />
                <p className="mt-4 text-[15px] leading-relaxed text-navy/85">{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// Compact bar that takes over once the hero has scrolled away.
function StickyBar({ company, show, bookSearch }: { company: Company; show: boolean; bookSearch: Record<string, string> }) {
  const logo = STARTUP_LOGOS[company.slug];
  const pair = PAIRS[company.slug];
  return (
    <div aria-hidden={!show} className={`sticky-bar fixed inset-x-0 top-0 z-40 bg-navy/95 text-white backdrop-blur ${show ? "is-on" : ""}`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        {logo && (
          <span className="inline-flex h-8 w-20 shrink-0 items-center justify-center rounded-[2px] bg-white px-1.5">
            <img src={logo} alt="" className="max-h-6 max-w-full object-contain" />
          </span>
        )}
        <span className="min-w-0 truncate font-bold">{company.name}</span>
        {pair && <span className="hidden min-w-0 truncate text-sm lg:block"><Pair who={pair[0]} what={pair[1]} dark /></span>}
        <Link to="/book" search={bookSearch} tabIndex={show ? 0 : -1} className="btn-node ml-auto !px-3.5 !py-2 text-sm !shadow-none">
          Book a 1:1
        </Link>
      </div>
    </div>
  );
}

function CompanyOnePager() {
  const company = Route.useLoaderData();
  return <Profile key={company.slug} company={company} />;
}

function Profile({ company }: { company: Company }) {
  useScrollMotion([company.slug]);
  const logo = STARTUP_LOGOS[company.slug];
  const onePager = company.onepager ?? null;
  const irDeck = company.irdeck ?? null;
  // Only cohort companies take 1:1 bookings.
  const hasMeetups = ONE_ON_ONE_OPEN && company.track === "track1";
  const bookLabel = hasMeetups ? "Book a 1:1 meeting" : "RSVP for the Demo Day";
  const bookSearch: Record<string, string> = hasMeetups ? { day: "5", company: company.slug } : { day: "7" };
  const pair = PAIRS[company.slug];
  const hl = HIGHLIGHTS[company.slug];
  const site = company.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const idx = companies.findIndex((c) => c.slug === company.slug);
  const next = companies[(idx + 1) % companies.length];
  const prev = companies[(idx - 1 + companies.length) % companies.length];
  // Traction lines already shown as hero numbers are still listed in full below.
  const snapshot = company.businessSnapshot.filter((l) => !/^USD figures converted/.test(l));

  const heroRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px]">
        <div id="scroll-progress" className="h-full origin-left scale-x-0 bg-brand-band" />
      </div>
      <StickyBar company={company} show={stuck} bookSearch={bookSearch} />

      {/* HERO — the pitch in one screen */}
      <section ref={heroRef} className="relative isolate overflow-hidden bg-navy text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center">
            <Wordmark light compact />
          </Link>
          <nav className="flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Link to="/companies/$slug" params={{ slug: prev.slug }} className="nav-link" aria-label={`Previous startup: ${prev.name}`}>←</Link>
            <span className="tabular-nums text-white/40">{idx + 1} / {companies.length}</span>
            <Link to="/companies/$slug" params={{ slug: next.slug }} className="nav-link" aria-label={`Next startup: ${next.name}`}>→</Link>
            <Link to="/" hash="startups" className="nav-link ml-2">All startups</Link>
          </nav>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16 lg:pb-20 lg:pt-12">
          <div>
            <div className="hero-in flex h-20 w-48 items-center justify-center rounded-[3px] bg-white px-5 shadow-[6px_6px_0_0_#ffe300] md:h-24 md:w-56">
              {logo ? (
                <img src={logo} alt={`${company.name} logo`} className="max-h-12 max-w-full object-contain md:max-h-14" />
              ) : (
                <span className="text-xl font-extrabold tracking-tight text-navy">{company.name}</span>
              )}
            </div>
            <p className="hero-in mt-8 text-sm text-white/55 [--i:1]">{company.sector} · {company.stage}</p>
            <h1 className="hero-in mt-2 text-[clamp(2.4rem,6vw,4.25rem)] font-extrabold leading-[1.02] tracking-tight [--i:1]">{company.displayName}</h1>
            {pair && <p className="hero-in mt-4 text-lg md:text-xl [--i:2]"><Pair who={pair[0]} what={pair[1]} dark /></p>}
            <p className="hero-in mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-white/75 [--i:3]">{company.tagline}</p>
            <div className="hero-in mt-8 flex flex-wrap gap-3 [--i:4]">
              <Link to="/book" search={bookSearch} className="btn-node">{bookLabel}</Link>
              {onePager && <a href={onePager} target="_blank" rel="noopener noreferrer" className="btn-node-ghost">One-pager (PDF)</a>}
              {irDeck && <a href={irDeck} target="_blank" rel="noopener noreferrer" className="btn-node-ghost">IR deck (PDF)</a>}
              {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn-node-ghost">Website</a>}
            </div>
            {!onePager && !irDeck && <p className="mt-4 text-sm text-white/50">The one-pager will be posted here soon.</p>}
            <div className="hero-in mt-8 border-t border-white/15 pt-5 [--i:5]">
              <p className="text-sm text-white/50">Meet them at</p>
              <Sessions slug={company.slug} dark className="mt-2 text-sm" />
            </div>
          </div>

          {hl && (
            <dl className="stat-stair grid gap-3">
              {hl.stats.map(([v, l], i) => (
                <div key={l} className="stat-node" style={{ "--i": i } as CSSProperties}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-extrabold leading-none tracking-tight text-navy">{v}</dd>
                  <dd className="mt-2 text-sm leading-snug text-navy/70">{l}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div aria-hidden className="h-2 bg-brand-band" />
      </section>

      {/* PROBLEM → FIX */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:gap-6">
          <div data-reveal="rise">
            <h2 className="text-sm font-bold text-[#6d6d6d]">The problem</h2>
            {hl && <p className="mt-3 text-2xl font-bold leading-snug text-[#6d6d6d] md:text-[1.75rem]">{hl.problem}</p>}
            <div className="mt-6 border-t border-navy/15 pt-6"><Points items={company.problem} /></div>
          </div>
          <div aria-hidden data-reveal="rise" className="hidden pt-12 [--d:200ms] md:block">
            <span className="fix-arrow" />
          </div>
          <div data-reveal="rise" className="[--d:350ms]">
            <h2 className="text-sm font-bold text-navy">What {company.name} does</h2>
            {hl && <p className="mt-3 text-2xl font-bold leading-snug text-navy md:text-[1.75rem]"><span className="mark-yellow">{hl.fix}</span></p>}
            <div className="mt-6 border-t border-navy/15 pt-6"><Points items={company.solution} /></div>
          </div>
        </div>
      </section>

      <div className="bg-secondary"><HowItWorks company={company} /></div>

      {/* TRACTION */}
      {snapshot.length > 0 && (
        <section className="bg-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <h2 data-reveal="wipe" className="text-3xl font-bold md:text-4xl">Traction</h2>
            <ol data-reveal="list" className="mt-10 grid gap-x-12 sm:grid-cols-2">
              {snapshot.map((item, i) => (
                <li key={i} className="flex gap-4 border-t border-white/15 py-5" style={{ "--i": i } as CSSProperties}>
                  <span aria-hidden className="mt-1.5 h-3 w-3 shrink-0 bg-yellow" />
                  <span className="text-[15px] leading-relaxed text-white/85">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* WHO SHOULD MEET THEM */}
      {company.seekingOpportunities.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <h2 data-reveal="wipe" className="text-3xl font-bold text-navy md:text-4xl">Meet them if you are…</h2>
          <ul data-reveal="list" className={`mt-10 grid gap-4 ${company.seekingOpportunities.length === 4 ? "md:grid-cols-2" : company.seekingOpportunities.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {company.seekingOpportunities.map((item, i) => (
              <li key={i} style={{ "--i": i } as CSSProperties}>
                <Link to="/book" search={bookSearch} className="ask-card group flex h-full flex-col">
                  <span className="text-lg font-bold leading-snug text-navy">{hl?.asks[i] ?? `Opportunity ${i + 1}`}</span>
                  <span className="mt-3 text-sm leading-relaxed text-[#6d6d6d]">{item}</span>
                  <span className="mt-auto pt-6 text-sm font-bold text-navy">
                    <span className="ask-cta">Book a 1:1</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TEAM */}
      {company.team.length > 0 && (
        <section className="border-t border-navy/10 bg-secondary">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <h2 data-reveal="wipe" className="text-3xl font-bold text-navy md:text-4xl">Who you'll meet</h2>
            <ul data-reveal="list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {company.team.map((member, i) => (
                <li key={member.name} className="bg-white p-5" style={{ "--i": i } as CSSProperties}>
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center bg-navy text-sm font-bold text-yellow">
                      {member.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-bold text-navy">{member.name}</div>
                      <div className="text-sm text-[#6d6d6d]">{member.role}</div>
                    </div>
                  </div>
                  {member.bio.length > 0 && (
                    <ul className="mt-4 space-y-1 border-t border-navy/10 pt-4">
                      {member.bio.map((line, k) => (
                        <li key={k} className="text-[13px] leading-relaxed text-[#6d6d6d]">{line}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {(site || company.email || company.phone) && (
              <p className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy">
                {site && <a href={company.website} target="_blank" rel="noopener noreferrer" className="underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{site}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{company.email}</a>}
                {company.phone && <span>{company.phone}</span>}
              </p>
            )}
          </div>
        </section>
      )}

      {/* CLOSE — book, or keep browsing */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Meet {company.name} in Singapore</h2>
            <p className="mt-2 text-white/60">{hasMeetups ? `Private 1:1 meeting · ${companySessions(company.slug).includes("thu") ? "Thu 19 Nov afternoon or Fri 20 Nov" : "Fri 20 Nov"}` : `Demo Day · ${EVENT_DATE} · ${EVENT_VENUE}`}</p>
            <Link to="/book" search={bookSearch} className="btn-node mt-6">{bookLabel}</Link>
          </div>
          <Link to="/companies/$slug" params={{ slug: next.slug }} className="next-card group flex items-center gap-5 border border-white/15 p-5">
            {STARTUP_LOGOS[next.slug] && (
              <span className="inline-flex h-16 w-32 shrink-0 items-center justify-center rounded-[3px] bg-white px-3">
                <img src={STARTUP_LOGOS[next.slug]} alt="" className="max-h-10 max-w-full object-contain" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block text-sm text-white/50">Next startup</span>
              <span className="block text-xl font-bold">{next.name}</span>
              {PAIRS[next.slug] && <span className="mt-1 block text-sm text-white/70">{PAIRS[next.slug][1]}</span>}
            </span>
            <span aria-hidden className="next-arrow ml-auto" />
          </Link>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
          <Wordmark />
          <div className="text-xs text-muted-foreground">© {EVENT_NAME}. {CREDITS}.</div>
        </div>
      </footer>
    </div>
  );
}
