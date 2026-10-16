import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Wordmark } from "@/components/Wordmark";
import { getCompanyBySlug } from "@/data/companies";
import { EVENT_DATE, EVENT_VENUE, ONE_ON_ONE_OPEN, MEETUP_DATE, EVENT_NAME, CREDITS } from "@/data/timeslots";
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

// Profile as a spec sheet: one ruled row per section, label left, points
// right. Empty sections are skipped: profiles fill in as one-pagers arrive.
function Row({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-3 border-t border-navy/15 py-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
      <h2 className="text-sm font-bold text-navy">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-navy/85">
            <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 bg-navy" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanyOnePager() {
  const company = Route.useLoaderData();
  const logo = STARTUP_LOGOS[company.slug];
  const onePager = company.onepager ?? null;
  const irDeck = company.irdeck ?? null;
  // Only cohort companies take 1:1 bookings.
  const hasMeetups = ONE_ON_ONE_OPEN && company.track === "track1";
  const bookLabel = hasMeetups ? "Book a 1:1 meeting" : "RSVP for the Demo Day";
  const bookSearch = hasMeetups ? { day: "5" as const, company: company.slug } : { day: "7" as const };
  const pair = PAIRS[company.slug];
  const site = company.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-navy text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center">
            <Wordmark light compact />
          </Link>
          <Link to="/" hash="startups" className="nav-link shrink-0 text-sm font-semibold">
            All startups
          </Link>
        </header>

        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pb-16 md:pt-12">
          <div className="grid gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-10">
            {logo && (
              <div className="flex h-24 w-full max-w-[15rem] items-center justify-center rounded-[3px] bg-white px-6 shadow-[6px_6px_0_0_#ffe300] md:h-32 md:w-60">
                <img src={logo} alt={`${company.name} logo`} className="max-h-14 max-w-full object-contain md:max-h-[4.5rem]" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-white/55">{company.sector} · {company.stage}</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">{company.displayName}</h1>
              {pair && <p className="mt-4 text-base md:text-lg"><Pair who={pair[0]} what={pair[1]} dark /></p>}
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-[1.0625rem] leading-relaxed text-white/80">{company.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" search={bookSearch} className="btn-node">{bookLabel}</Link>
            {onePager && (
              <a href={onePager} target="_blank" rel="noopener noreferrer" className="btn-node-ghost">One-pager (PDF)</a>
            )}
            {irDeck && (
              <a href={irDeck} target="_blank" rel="noopener noreferrer" className="btn-node-ghost">IR deck (PDF)</a>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn-node-ghost">Website</a>
            )}
          </div>
          {!onePager && !irDeck && <p className="mt-4 text-sm text-white/50">The one-pager will be posted here soon.</p>}
        </div>
        <div aria-hidden className="h-2 bg-brand-band" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Row title="Problem" items={company.problem} />
        <Row title="Solution" items={company.solution} />
        <Row title="Key features" items={company.keyFeatures} />
        <Row title="Who it's for" items={company.targetAudience} />
        <Row title="Business model" items={company.businessModel} />
        <Row title="Looking for in Singapore" items={company.seekingOpportunities} />
        <div className="border-t border-navy/15" />
      </section>

      {company.businessSnapshot.length > 0 && (
        <section className="bg-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
            <h2 className="text-2xl font-bold">Traction</h2>
            <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {company.businessSnapshot.map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-white/85">
                  <span aria-hidden className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 bg-yellow" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
        {company.team.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-navy">Who you'll meet</h2>
            <ul className="mt-6 grid gap-x-10 border-t border-navy/15 sm:grid-cols-2 lg:grid-cols-3">
              {company.team.map((member) => (
                <li key={member.name} className="border-b border-navy/15 py-5">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] bg-yellow text-sm font-bold text-navy">
                      {member.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-bold text-navy">{member.name}</div>
                      <div className="text-sm text-[#6d6d6d]">{member.role}</div>
                    </div>
                  </div>
                  {member.bio.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {member.bio.map((line, i) => (
                        <li key={i} className="text-[13px] leading-relaxed text-[#6d6d6d]">{line}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        {(site || company.email || company.phone) && (
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy">
            {site && <a href={company.website} target="_blank" rel="noopener noreferrer" className="underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{site}</a>}
            {company.email && <a href={`mailto:${company.email}`} className="underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{company.email}</a>}
            {company.phone && <span>{company.phone}</span>}
          </p>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-5 bg-secondary px-6 py-6">
          <div>
            <div className="text-lg font-bold text-navy">Meet {company.name} in Singapore</div>
            <div className="mt-0.5 text-sm text-[#6d6d6d]">
              {hasMeetups ? `Private 1:1 meeting · ${MEETUP_DATE}` : `Demo Day · ${EVENT_DATE} · ${EVENT_VENUE}`}
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/book" search={bookSearch} className="btn-node-dark">{bookLabel}</Link>
            <Link to="/" hash="startups" className="btn-node-line">All startups</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
          <Wordmark />
          <div className="text-xs text-muted-foreground">© {EVENT_NAME}. {CREDITS}.</div>
        </div>
      </footer>
    </div>
  );
}
