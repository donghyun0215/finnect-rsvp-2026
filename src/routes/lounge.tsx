import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/Wordmark";
import { useMemo, useState, type CSSProperties } from "react";
import { FinnectSymbol, NodePattern, node } from "@/components/Brand";
import { Pair, PAIRS } from "@/components/Pair";
import { CREDITS, EVENT_NAME, EVENT_DAY_SHORT } from "@/data/timeslots";
import { companies } from "@/data/companies";
import { STARTUP_LOGOS } from "@/data/companyImages";
import {
  listLoungeProfiles,
  updateContactUrl,
  markLoungeCheckIn,
  listMyContacts,
  addLoungeContact,
  removeLoungeContact,
  saveLoungeContactInfo,
  addCustomContact,
  updateCustomContact,
  removeCustomContact,
  listTeamContacts,
  type TeamContactEntry,
  type LoungeProfile,
  type WalletEntry,
} from "@/lib/booking.server";
import { BusyLabel, LoadingNote } from "@/components/Spinner";
import { absUrl } from "@/lib/url";

// Unlisted attendee wall — QR (?key=) on event day, RSVP-email gate after.
// Not linked from any nav; noindex. PII beyond name/org/title never reaches
// this page (enforced server-side).
export const Route = createFileRoute("/lounge")({
  component: LoungePage,
  validateSearch: (s: Record<string, unknown>): { key?: string } =>
    typeof s.key === "string" && s.key ? { key: s.key } : {},
  head: () => ({
    meta: [
      { title: "Virtual Networking Lounge — FIN:NECT Global Demoday Singapore 2026" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: `Attendee networking lounge for the ${EVENT_NAME}.` },
    ],
  }),
});

// Interest = a node colour from the KV's cyan→green→yellow ramp; "General"
// stays a hollow node so the three asks read first. Values match the RSVP form.
const INTEREST_NODE: Record<string, string> = {
  Investment: "#ffe300",
  "Distribution / partnership": "#00ccff",
  "Pilot / trial opportunity": "#6fdb6a",
};
function nodeStyle(interest: string, dark: boolean): CSSProperties {
  const c = INTEREST_NODE[interest];
  return c
    ? { background: c }
    : { boxShadow: `inset 0 0 0 1.5px ${dark ? "rgb(255 255 255 / .55)" : "rgb(30 30 30 / .45)"}` };
}

// Charcoal palette (FIN:NECT 2026 KV black) — kept within one family so a
// full wall of avatars reads as one surface rather than a rainbow.
const AVATAR_COLORS = [
  "#1E1E1E", "#2B2B2B", "#383838", "#454545", "#525252", "#303030", "#3D3D3D", "#262626",
];

function avatarColor(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function contactLabel(url: string): string {
  if (/linkedin\.com/i.test(url)) return "LinkedIn";
  if (/open\.kakao\.com/i.test(url)) return "KakaoTalk";
  return "Website";
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}

function LockGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

// Gate art: the KV's "connect" checker. Twelve filled squares hold the
// startups, the centre one the FIN:NECT mark; yellow colon nodes sit where
// squares meet. Tiles drop in along the diagonals once, on load.
const SQUARE_MARKS = new Set(["276holdings", "bigtechplus", "atones"]);
function ConnectBoard() {
  const [hover, setHover] = useState<number | null>(null);
  let n = 0;
  const cells = Array.from({ length: 25 }, (_, k) => {
    const x = k % 5, y = Math.floor(k / 5);
    if ((x + y) % 2) return { x, y, kind: "empty" as const };
    if (x === 2 && y === 2) return { x, y, kind: "mark" as const };
    return { x, y, kind: "co" as const, c: companies[n++] };
  });
  const lit = hover === null ? null : companies[hover];
  const joins: string[] = [];
  for (let y = 1; y < 5; y++) for (let x = 1; x < 5; x++) joins.push(node(x, y));
  return (
    <div className="mx-auto w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[480px]" onMouseLeave={() => setHover(null)}>
      <div className="relative grid grid-cols-5" role="list" aria-label={`The ${companies.length} startups`}>
        {cells.map((cell, k) => {
          const d = { "--i": cell.x + cell.y } as CSSProperties;
          if (cell.kind === "empty") return <span key={k} aria-hidden className="aspect-square bg-white/[0.03]" />;
          if (cell.kind === "mark")
            return (
              <span key={k} aria-hidden className="cx-tile flex aspect-square items-center justify-center bg-white/[0.08]" style={d}>
                <FinnectSymbol className="w-1/2" />
              </span>
            );
          const c = cell.c;
          const i = companies.indexOf(c);
          return (
            <Link
              key={k}
              role="listitem"
              to="/companies/$slug"
              params={{ slug: c.slug }}
              aria-label={c.name}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`cx-tile flex aspect-square items-center justify-center bg-white p-[13%] ${hover === i ? "is-lit" : ""}`}
              style={d}
            >
              {STARTUP_LOGOS[c.slug] ? (
                <img src={STARTUP_LOGOS[c.slug]} alt="" className={`${SQUARE_MARKS.has(c.slug) ? "max-h-[78%]" : "max-h-[46%]"} max-w-full object-contain`} />
              ) : (
                <span className="text-center text-[11px] font-extrabold leading-tight text-navy sm:text-xs">{c.name}</span>
              )}
            </Link>
          );
        })}
        <svg viewBox="0 0 5 5" aria-hidden className="cx-joins pointer-events-none absolute inset-0 h-full w-full" fill="#ffe300">
          {joins.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </svg>
      </div>
      <div className="mt-6 min-h-[4.75rem] border-t border-white/15 pt-5" aria-live="polite">
        {lit ? (
          <>
            <div className="font-bold text-white">
              {lit.name} <span className="ml-1 text-xs font-medium text-white/45">{lit.sector}</span>
            </div>
            <p className="mt-1.5 text-[15px]">
              <Pair who={(PAIRS[lit.slug] ?? ["", lit.sector])[0]} what={(PAIRS[lit.slug] ?? ["", lit.sector])[1]} dark />
            </p>
          </>
        ) : (
          <>
            <div className="font-bold text-white">{companies.length} Korean fintechs on stage</div>
            <p className="mt-1.5 text-sm text-white/55">Point at a logo to see who it serves.</p>
          </>
        )}
      </div>
    </div>
  );
}

function LoungePage() {
  const { key } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [profiles, setProfiles] = useState<LoungeProfile[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [gateError, setGateError] = useState("");
  const [grantedEmail, setGrantedEmail] = useState<string | null>(null);

  const [selected, setSelected] = useState<LoungeProfile | null>(null);

  // browse controls
  const [query, setQuery] = useState("");
  const [interest, setInterest] = useState<string | null>(null);
  const [linkedOnly, setLinkedOnly] = useState(false);

  // contact mini-form
  const [showContactForm, setShowContactForm] = useState(false);
  const [cEmail, setCEmail] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cMsg, setCMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [cBusy, setCBusy] = useState(false);

  // My Contacts wallet ("내 명함집")
  const [view, setView] = useState<"all" | "mine" | "team">("all");
  const [teamEntries, setTeamEntries] = useState<TeamContactEntry[] | null>(null);
  const [wallet, setWallet] = useState<WalletEntry[] | null>(null);
  const [walletSelected, setWalletSelected] = useState<WalletEntry | null>(null);
  const [addTarget, setAddTarget] = useState<LoungeProfile | null>(null);
  const [customEditor, setCustomEditor] = useState<WalletEntry | "new" | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const isTeam = Boolean(grantedEmail?.toLowerCase().endsWith("@lodestart.ai"));

  const refreshTeam = async (ownerEmail: string) => {
    const res = await listTeamContacts({ data: { email: ownerEmail } });
    if (res.ok) setTeamEntries(res.entries);
  };

  const refreshWallet = async (ownerEmail: string) => {
    const res = await listMyContacts({ data: { email: ownerEmail } });
    if (res.ok) {
      setWallet(res.entries);
      setAddedIds(new Set(res.entries.map((e) => e.rsvp_id).filter((id): id is string => Boolean(id))));
    }
  };

  // Any registered RSVP email enters, any time: the lounge URL is not
  // advertised to general attendees before the event (reminder emails omit
  // it), so a date lock only added friction for the startups and staff who
  // already hold the QR. Owner's call, 26 Aug.
  //
  // Entering through the on-site QR (key) now ALSO requires the email — the
  // entrance desk hands out badges only after seeing the lounge open, and
  // key+email together is what marks real attendance in the DB. Email-only
  // remote entry never checks anyone in.
  const load = async (auth: { key?: string; email?: string }) => {
    setLoading(true);
    setGateError("");
    const res = await listLoungeProfiles({ data: auth });
    setLoading(false);
    if (res.ok) {
      setProfiles(res.profiles);
      if (auth.email) {
        setGrantedEmail(auth.email);
        setCEmail((v) => v || auth.email!);
        void refreshWallet(auth.email);
        void markLoungeCheckIn({ data: { key: auth.key, email: auth.email } });
      }
    } else {
      setProfiles(null);
      setGateError(
        auth.key
          ? "No RSVP found with this email — please RSVP first, then come back in."
          : "No RSVP found with this email — please RSVP first, then come back in.",
      );
    }
  };

  // A QR scan lands here holding a key, but we deliberately do not enter
  // automatically — the visitor gets a beat to read the notice and tap in.

  const submitContact = async () => {
    if (!cEmail.trim() || cBusy) return;
    setCBusy(true);
    setCMsg(null);
    const res = await updateContactUrl({ data: { email: cEmail.trim(), contactUrl: cUrl } });
    setCBusy(false);
    setCMsg(res.ok ? { ok: true, text: "Saved. Your card is updated." } : { ok: false, text: res.message ?? "Something went wrong." });
    if (res.ok) {
      void load(key ? { key } : grantedEmail ? { email: grantedEmail } : { email: cEmail.trim() });
    }
  };

  // "Who's here" composition — counts by interest, ordered by size.
  const groups = useMemo(() => {
    if (!profiles) return [];
    const m = new Map<string, number>();
    for (const p of profiles) {
      const k = p.primary_interest || "General interest";
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [profiles]);

  const linkedCount = useMemo(() => profiles?.filter((p) => p.contact_url).length ?? 0, [profiles]);

  const shown = useMemo(() => {
    if (!profiles) return [];
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      if (interest && (p.primary_interest || "General interest") !== interest) return false;
      if (linkedOnly && !p.contact_url) return false;
      if (!q) return true;
      return `${p.full_name} ${p.organisation} ${p.job_title}`.toLowerCase().includes(q);
    });
  }, [profiles, query, interest, linkedOnly]);

  const filtersOn = Boolean(query.trim() || interest || linkedOnly);
  const clearFilters = () => {
    setQuery("");
    setInterest(null);
    setLinkedOnly(false);
  };

  // The room in one picture: everyone, grouped by what they came for.
  const roomOrder = useMemo(() => {
    if (!profiles) return [];
    const rank = new Map(groups.map(([g], i) => [g, i]));
    return [...profiles].sort(
      (a, b) =>
        (rank.get(a.primary_interest || "General interest") ?? 9) -
        (rank.get(b.primary_interest || "General interest") ?? 9),
    );
  }, [profiles, groups]);

  const enter = () => email.trim() && void load(key ? { key, email: email.trim() } : { email: email.trim() });

  return (
    <div className="fn-square min-h-screen w-full overflow-x-hidden bg-secondary text-navy">
      <header className="sticky top-0 z-30 bg-navy">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center">
            <Wordmark light compact />
          </Link>
          <nav className="flex shrink-0 items-center gap-0.5 text-[13px] font-semibold sm:gap-2 sm:text-sm">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/" hash="startups" className="nav-link max-sm:hidden">
              Startups
            </Link>
            <Link to="/book" className="nav-link whitespace-nowrap">
              Event RSVP<span className="max-sm:hidden"> ({EVENT_DAY_SHORT})</span>
            </Link>
          </nav>
        </div>
      </header>

      {!profiles ? (
        <>
          {/* ── GATE ── */}
          <section className="bg-navy text-white">
            <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-20 lg:pb-28 lg:pt-20">
              <div>
                <p className="hero-in text-sm text-white/60">Virtual Networking Lounge, {EVENT_DAY_SHORT}</p>
                <h1 className="hero-in mt-6 text-[clamp(2.6rem,6.6vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight [--i:1]">
                  Find the people
                  <span className="block text-white/45">worth meeting.</span>
                </h1>
                <p className="hero-in mt-6 max-w-[46ch] text-[15px] leading-relaxed text-white/70 sm:text-base [--i:2]">
                  Everyone registered for the {EVENT_NAME}, sorted by what they are looking for.
                  Open a card to see who they are and connect.
                </p>

                <div className="hero-in mt-10 max-w-xl [--i:3]">
                  <label htmlFor="lounge-email" className="block text-sm font-semibold text-white">
                    {key ? "You're at the venue. Enter your RSVP email to check in." : "Enter with the email you RSVP'd with"}
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="lounge-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && enter()}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="min-w-0 flex-1 rounded-[3px] bg-white px-4 py-3.5 text-base text-navy placeholder:text-[#8a8a8a] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#00ccff] sm:text-[15px]"
                    />
                    <button type="button" disabled={loading} onClick={enter} className="btn-node disabled:opacity-60">
                      <BusyLabel busy={loading} text="Checking…">
                        Enter lounge
                      </BusyLabel>
                    </button>
                  </div>
                  {gateError && (
                    <p className="mt-3 text-sm leading-relaxed text-[#ffb4a8]">
                      {gateError}{" "}
                      <a href="/book" className="font-semibold text-white underline underline-offset-2">
                        RSVP here
                      </a>
                    </p>
                  )}
                  <p className="mt-4 flex items-center gap-2 text-xs text-white/50">
                    <LockGlyph className="h-3.5 w-3.5 shrink-0" />
                    Only registered attendees can open the list.
                  </p>
                </div>
              </div>

              <ConnectBoard />
            </div>
          </section>

          {/* ── NOTICE ── */}
          <section className="bg-background">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">What the lounge shows</h2>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
                To help people meet during the {EVENT_NAME}, each card shows a registered attendee's
                name, organisation, role and main business interest. Nothing else.
              </p>
              <dl className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
                {[
                  ["Attendees only", "The list is private. Only people who registered for the event can open it."],
                  ["No contact details", "Email addresses and phone numbers are never shown or shared here."],
                  [
                    "Your card, your call",
                    <>
                      Add or change your link inside the lounge. To be removed, write to{" "}
                      <a href="mailto:support@lodestart.ai" className="font-semibold text-navy underline underline-offset-2">
                        support@lodestart.ai
                      </a>
                      .
                    </>,
                  ],
                ].map(([t, d], i) => (
                  <div key={i} className="border-t-2 border-navy pt-5">
                    <dt className="flex items-center gap-2.5 font-bold">
                      <span aria-hidden className="h-2.5 w-2.5 bg-yellow" />
                      {t}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <footer className="bg-navy">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <Wordmark light />
              <span className="text-white/50">{CREDITS}</span>
              <a href="mailto:support@lodestart.ai" className="font-semibold text-yellow hover:underline">
                support@lodestart.ai
              </a>
            </div>
          </footer>
        </>
      ) : (
        <>
          {/* ── THE ROOM ── one square per person, grouped by interest */}
          <section className="bg-navy text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 lg:pb-14 lg:pt-14">
              <div>
                <p className="text-sm text-white/60">Virtual Networking Lounge</p>
                <h1 className="mt-3 flex items-end gap-4 font-extrabold tracking-tight">
                  <span className="text-[clamp(3.75rem,9vw,6rem)] leading-[0.85] tabular-nums text-yellow">{profiles.length}</span>
                  <span className="pb-1 text-2xl leading-[1.1] sm:text-[28px]">
                    people
                    <br />
                    in the room
                  </span>
                </h1>
              </div>

              <div>
                <div className="flex flex-wrap gap-[3px]" role="list" aria-label="Everyone in the lounge, grouped by interest">
                  {roomOrder.map((p, i) => {
                    const g = p.primary_interest || "General interest";
                    const dim = (interest && g !== interest) || (linkedOnly && !p.contact_url);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="listitem"
                        title={`${p.full_name}, ${p.organisation}`}
                        aria-label={`${p.full_name}, ${p.organisation}`}
                        onClick={() => setSelected(p)}
                        className={`waffle-dot h-3.5 w-3.5 sm:h-4 sm:w-4 ${dim ? "opacity-15" : ""}`}
                        style={{ "--i": i, ...nodeStyle(g, true) } as CSSProperties}
                      />
                    );
                  })}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {groups.map(([label, n]) => {
                    const active = interest === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setView("all");
                          setInterest(active ? null : label);
                        }}
                        className={`inline-flex items-center gap-2 rounded-[3px] border px-3 py-2 text-[13px] font-semibold transition ${
                          active ? "border-yellow bg-white/10 text-white" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        <span aria-hidden className="h-2.5 w-2.5 shrink-0" style={nodeStyle(label, true)} />
                        {label}
                        <span className="tabular-nums text-white/45">{n}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={linkedOnly}
                    onClick={() => {
                      setView("all");
                      setLinkedOnly((v) => !v);
                    }}
                    className={`inline-flex items-center gap-2 rounded-[3px] border px-3 py-2 text-[13px] font-semibold transition ${
                      linkedOnly ? "border-yellow bg-white/10 text-white" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    <LinkIcon className="h-3 w-3" />
                    Has a link
                    <span className="tabular-nums text-white/45">{linkedCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {grantedEmail && (
                <div className="flex self-start border border-navy" role="tablist">
                  {(
                    [
                      ["all", "Everyone"],
                      ["mine", `My Contacts${wallet?.length ? ` (${wallet.length})` : ""}`],
                      ...(isTeam ? [["team", "Team view"]] : []),
                    ] as ["all" | "mine" | "team", string][]
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      role="tab"
                      aria-selected={view === v}
                      onClick={() => {
                        setView(v);
                        if (v === "mine" && grantedEmail) void refreshWallet(grantedEmail);
                        if (v === "team" && grantedEmail) void refreshTeam(grantedEmail);
                      }}
                      className={`px-4 py-2.5 text-[13px] font-bold transition ${
                        view === v ? "bg-navy text-yellow" : "text-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {view === "all" && (
                <label className="relative block md:w-80">
                  <span className="sr-only">Search attendees</span>
                  <svg
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, company, role"
                    className="w-full rounded-[3px] border border-[#cfcfcf] bg-white py-2.5 pl-10 pr-3 text-base outline-none transition focus:border-navy sm:text-sm"
                  />
                </label>
              )}
            </div>

            {view === "team" && isTeam ? (
              <div className="mt-6">
                <TeamContactsWall entries={teamEntries} />
              </div>
            ) : view === "mine" && grantedEmail ? (
              <div className="mt-6">
                <MyContactsWall
                  wallet={wallet}
                  ownerEmail={grantedEmail}
                  onSelect={(e) => (e.rsvp_id ? setWalletSelected(e) : setCustomEditor(e))}
                  onAddCustom={() => setCustomEditor("new")}
                  onBrowseAll={() => setView("all")}
                />
              </div>
            ) : (
              <>
                <div className="mt-7 flex items-baseline justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    {filtersOn ? (
                      <>
                        <span className="font-bold text-navy">{shown.length}</span> of {profiles.length}
                        {interest && <>, {interest}</>}
                        {linkedOnly && <>, with a link</>}
                      </>
                    ) : (
                      <>Everyone, grouped as above</>
                    )}
                  </p>
                  {filtersOn && (
                    <button type="button" onClick={clearFilters} className="text-[13px] font-bold text-navy underline underline-offset-4 hover:no-underline">
                      Clear filters
                    </button>
                  )}
                </div>

                {shown.length === 0 ? (
                  <div className="mt-4 border border-dashed border-[#cfcfcf] bg-white px-6 py-14 text-center">
                    <p className="font-bold">No one matches that</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try a different name or company, or clear the filters.</p>
                    <button type="button" onClick={clearFilters} className="btn-node-line mt-5">
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 border-l border-t border-[#dcdcdc] sm:grid-cols-2 xl:grid-cols-3">
                    {(filtersOn ? shown : roomOrder).map((p) => {
                      const g = p.primary_interest || "General interest";
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelected(p)}
                          className="room-tile group flex min-h-[132px] sm:min-h-[150px] flex-col border-b border-r border-[#dcdcdc] bg-white p-5 text-left focus:outline-none focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00ccff]"
                        >
                          <div className="flex items-start gap-3.5">
                            <span className="room-av relative flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-[13px] font-bold text-white">
                              {initials(p.full_name)}
                              <span
                                aria-hidden
                                className="absolute -bottom-[3px] -right-[3px] h-3 w-3 ring-[3px] ring-white"
                                style={nodeStyle(g, false)}
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[15px] font-bold leading-tight">{p.full_name}</div>
                              <div className="mt-1 line-clamp-2 break-words text-[13px] leading-snug text-muted-foreground">{p.job_title}</div>
                              <div className="mt-1 truncate text-[13px] font-semibold text-navy/75">{p.organisation}</div>
                            </div>
                          </div>
                          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                            <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                              <span aria-hidden className="h-2 w-2 shrink-0" style={nodeStyle(g, false)} />
                              <span className="truncate">{g}</span>
                            </span>
                            {p.contact_url && (
                              <a
                                href={absUrl(p.contact_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-[3px] bg-navy px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-black hover:text-yellow"
                              >
                                <LinkIcon className="h-3 w-3" />
                                {contactLabel(p.contact_url)}
                              </a>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── my card ── */}
            <section className="mt-14 grid gap-6 border-t-2 border-navy pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">Add or update my link</h2>
                <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                  Add a LinkedIn profile, company page or open-chat link so people can reach you. No need to RSVP again.
                </p>
              </div>
              <div>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto]">
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="Email you RSVP'd with"
                    aria-label="Email you RSVP'd with"
                    className="min-w-0 rounded-[3px] border border-[#cfcfcf] bg-white px-3 py-2.5 text-base outline-none focus:border-navy sm:text-sm"
                  />
                  <input
                    value={cUrl}
                    onChange={(e) => setCUrl(e.target.value)}
                    placeholder="linkedin.com/in/yourname"
                    aria-label="Your link"
                    className="min-w-0 rounded-[3px] border border-[#cfcfcf] bg-white px-3 py-2.5 text-base outline-none focus:border-navy sm:text-sm"
                  />
                  <button type="button" disabled={cBusy || !cEmail.trim()} onClick={() => void submitContact()} className="btn-node-dark disabled:opacity-50">
                    <BusyLabel busy={cBusy} text="Saving…">
                      Save link
                    </BusyLabel>
                  </button>
                </div>
                {cMsg && <p className={`mt-2 text-sm ${cMsg.ok ? "text-[#2f7d32]" : "text-[#c62828]"}`}>{cMsg.text}</p>}
              </div>
            </section>

            <p className="mt-12 max-w-[80ch] text-xs leading-relaxed text-muted-foreground">
              Only registered attendees can see this list. Emails are shared only between confirmed 1:1 meeting partners,
              inside My Contacts. To update or remove your card, write to{" "}
              <a href="mailto:support@lodestart.ai" className="font-semibold text-navy underline underline-offset-2">
                support@lodestart.ai
              </a>
              .
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{CREDITS}</p>
          </main>
        </>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.full_name}
            className="sheet-rise max-h-[88dvh] w-full max-w-md overflow-y-auto bg-card sm:shadow-[8px_8px_0_0_#00ccff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden bg-navy px-6 pb-6 pt-7 text-white">
              <NodePattern name="connect" className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-white/[0.07]" />
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-3 top-3 p-1.5 text-white/60 transition hover:text-yellow"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <span className="relative flex h-16 w-16 items-center justify-center bg-yellow text-xl font-extrabold text-navy">
                {initials(selected.full_name)}
              </span>
              <div className="relative mt-4 text-xl font-bold leading-tight">{selected.full_name}</div>
              <div className="relative mt-1 text-sm text-white/60">{selected.job_title}</div>
            </div>
            <dl className="divide-y divide-border px-6">
              <div className="py-4">
                <dt className="text-xs text-muted-foreground">Organisation</dt>
                <dd className="mt-1 break-words font-semibold">{selected.organisation}</dd>
              </div>
              <div className="py-4">
                <dt className="text-xs text-muted-foreground">Looking for</dt>
                <dd className="mt-1 flex items-center gap-2 font-semibold">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0" style={nodeStyle(selected.primary_interest || "General interest", false)} />
                  {selected.primary_interest || "General interest"}
                </dd>
              </div>
            </dl>
            <div className="space-y-3 px-6 pb-6 pt-2">
              {selected.contact_url ? (
                <a href={absUrl(selected.contact_url)} target="_blank" rel="noopener noreferrer" className="btn-node w-full">
                  <LinkIcon className="h-4 w-4" />
                  Connect on {contactLabel(selected.contact_url)}
                </a>
              ) : (
                <p className="bg-secondary px-3 py-2.5 text-center text-sm text-muted-foreground">No contact link added yet</p>
              )}
              {grantedEmail && (
                <button
                  type="button"
                  disabled={addedIds.has(selected.id)}
                  onClick={() => setAddTarget(selected)}
                  className="btn-node-line w-full disabled:opacity-60"
                >
                  {addedIds.has(selected.id) ? "In My Contacts" : "Add to My Contacts"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {addTarget && grantedEmail && (
        <AddContactPopup
          profile={addTarget}
          onCancel={() => setAddTarget(null)}
          onAdd={async (note) => {
            const r = await addLoungeContact({
              data: { ownerEmail: grantedEmail, contactRsvpId: addTarget.id, note: note || undefined },
            });
            if (r.ok) {
              setAddedIds((s) => new Set(s).add(addTarget.id));
              void refreshWallet(grantedEmail);
            }
            setAddTarget(null);
          }}
        />
      )}

      {customEditor && grantedEmail && (
        <CustomContactModal
          entry={customEditor === "new" ? null : customEditor}
          ownerEmail={grantedEmail}
          onClose={() => setCustomEditor(null)}
          onDone={() => {
            setCustomEditor(null);
            void refreshWallet(grantedEmail);
          }}
        />
      )}

      {walletSelected && grantedEmail && (
        <WalletCardModal
          entry={walletSelected}
          ownerEmail={grantedEmail}
          onClose={() => setWalletSelected(null)}
          onChanged={() => void refreshWallet(grantedEmail)}
          onRemoved={() => {
            setWalletSelected(null);
            void refreshWallet(grantedEmail);
          }}
        />
      )}
    </div>
  );
}

// ── My Contacts ("내 명함집") ─────────────────────────────────────
// Personal follow-up wallet: 1:1 meeting partners appear automatically
// (computed from bookings server-side), everyone else is added by hand from
// the wall. Cards open a small editable template — email/phone the owner
// types here is private to them.

function MyContactsWall({
  wallet,
  ownerEmail,
  onSelect,
  onAddCustom,
  onBrowseAll,
}: {
  wallet: WalletEntry[] | null;
  ownerEmail: string;
  onSelect: (e: WalletEntry) => void;
  onAddCustom: () => void;
  onBrowseAll: () => void;
}) {
  // Multi-select → one email to everyone chosen. Opens the person's own
  // mail app via mailto: (no OAuth, no server, works on PC/Android/iOS);
  // recipients go in BCC so they never see each other. Web-Gmail/Outlook
  // and copy-to-clipboard fallbacks cover machines with no default client.
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const keyOf = (w: WalletEntry) => w.rsvp_id ?? w.entry_id ?? "";
  const emailOf = (w: WalletEntry) => w.meeting_email ?? w.saved_email ?? null;
  const togglePick = (w: WalletEntry) =>
    setPicked((s) => {
      const n = new Set(s);
      const k = keyOf(w);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  const exitSelect = () => {
    setSelecting(false);
    setPicked(new Set());
  };

  if (!wallet) {
    return <p className="mt-6 text-center text-sm text-muted-foreground"><LoadingNote text="Loading your contacts…" /></p>;
  }
  if (wallet.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="text-sm font-semibold text-navy">No contacts saved yet</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          People you meet in a 1:1 session appear here automatically. You can also add anyone from
          the attendee wall — open their card and tap “Add to My Contacts”.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={onBrowseAll}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-navy transition hover:bg-muted"
          >
            Browse attendees
          </button>
          <button
            type="button"
            onClick={onAddCustom}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            ＋ Add someone manually
          </button>
        </div>
      </div>
    );
  }
  const meetings = wallet.filter((w) => w.source === "meeting").length;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {wallet.length} saved{meetings ? ` · ${meetings} from your 1:1 meetings` : ""} · manually added cards are visible to you and the organizing team
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (selecting ? exitSelect() : setSelecting(true))}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
              selecting
                ? "bg-navy text-white hover:bg-navy/85"
                : "bg-navy text-white hover:bg-navy/85"
            }`}
          >
            {selecting ? (
              "Done selecting"
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                Send a group email
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onAddCustom}
            className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-muted"
          >
            ＋ Add someone
          </button>
        </div>
      </div>
      {selecting && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          <strong className="text-navy">Step 1:</strong> tap the cards you want to email. <strong className="text-navy">Step 2:</strong> hit the button at the bottom — your own mail app opens with everyone in BCC. Cards without an email are greyed out.
        </p>
      )}
      <div className="mt-4 grid grid-cols-1 border-l border-t border-[#dcdcdc] sm:grid-cols-2 xl:grid-cols-3">
        {wallet.map((w) => (
          <button
            key={w.rsvp_id ?? w.entry_id}
            type="button"
            onClick={() => (selecting ? togglePick(w) : onSelect(w))}
            className={`room-tile group flex min-h-[132px] sm:min-h-[150px] flex-col border-b border-r border-[#dcdcdc] bg-white p-5 text-left focus:outline-none focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00ccff] ${
              selecting && picked.has(keyOf(w)) ? "z-[1] outline outline-2 -outline-offset-2 outline-navy" : ""
            } ${selecting && !emailOf(w) ? "opacity-50" : ""}`}
          >
            {selecting && (
              <span
                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold ${
                  picked.has(keyOf(w)) ? "border-navy bg-yellow text-navy" : "border-[#cfcfcf] bg-background text-transparent"
                }`}
              >
                ✓
              </span>
            )}
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ring-2 ring-white"
                style={{ backgroundColor: avatarColor(w.full_name) }}
              >
                {initials(w.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-navy">{w.full_name}</div>
                <div className="line-clamp-2 break-words text-xs leading-snug text-muted-foreground">{w.job_title}</div>
                <div className="mt-0.5 truncate text-xs font-medium text-navy/60">{w.organisation}</div>
              </div>
            </div>
            {w.saved_note && (
              <p className="mt-2 line-clamp-1 text-[11px] italic text-muted-foreground">“{w.saved_note}”</p>
            )}
            <div className="mt-3 flex flex-1 items-end justify-between gap-2">
              {w.source === "meeting" ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  1:1 meeting
                </span>
              ) : w.rsvp_id ? (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-navy ring-1 ring-inset ring-border">
                  Saved
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  External
                </span>
              )}
              <span className="shrink-0 text-[10px] text-muted-foreground opacity-0 transition group-hover:opacity-100">
                Open →
              </span>
            </div>
          </button>
        ))}
      </div>
      {selecting && picked.size > 0 && (
        <BulkEmailBar
          entries={wallet.filter((w) => picked.has(keyOf(w)))}
          ownerEmail={ownerEmail}
          emailOf={emailOf}
          onDone={exitSelect}
        />
      )}
    </>
  );
}

// Sticky action bar for multi-select email. Builds mailto: with the owner
// in To (some clients drop a BCC-only compose) and everyone else in BCC.
// mailto URLs cap out around ~2,000 chars, so large picks are split into
// batches; web Gmail/Outlook links and a copy button cover PCs with no
// default mail client. Subject is prefilled with the event name for
// recipient context; body is left to the sender's own voice.
const BULK_SUBJECT = `Great meeting you at the ${EVENT_NAME}`;
const BULK_BATCH = 40;

function BulkEmailBar({
  entries,
  ownerEmail,
  emailOf,
  onDone,
}: {
  entries: WalletEntry[];
  ownerEmail: string;
  emailOf: (w: WalletEntry) => string | null;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const flashOpening = (label: string) => {
    setOpening(label);
    setTimeout(() => setOpening(null), 3500);
  };
  const emails = [...new Set(entries.map(emailOf).filter((e): e is string => Boolean(e)))];
  const missing = entries.length - emails.length;
  const batches: string[][] = [];
  for (let i = 0; i < emails.length; i += BULK_BATCH) batches.push(emails.slice(i, i + BULK_BATCH));
  const subj = encodeURIComponent(BULK_SUBJECT);

  const mailto = (list: string[]) =>
    list.length === 1
      ? `mailto:${list[0]}?subject=${subj}`
      : `mailto:${encodeURIComponent(ownerEmail)}?bcc=${encodeURIComponent(list.join(","))}&subject=${subj}`;
  const gmailWeb = (list: string[]) =>
    `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(list.join(","))}&su=${subj}`;
  const outlookWeb = (list: string[]) =>
    `https://outlook.office.com/mail/deeplink/compose?bcc=${encodeURIComponent(list.join(";"))}&subject=${subj}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — links still work */
    }
  };

  return (
    <>
      {opening && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-card px-6 py-4 shadow-xl">
            <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <div>
              <div className="text-sm font-bold text-navy">Opening {opening}…</div>
              <div className="text-[11px] text-muted-foreground">
                Recipients are in BCC. If nothing opens, use “Copy all emails” below.
              </div>
            </div>
          </div>
        </div>
      )}
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-[0_-8px_24px_rgba(10,33,99,0.08)] backdrop-blur sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-navy">
            <strong>{entries.length} selected</strong> · {emails.length} with email
            {missing > 0 && <span className="text-muted-foreground"> · {missing} without (skipped)</span>}
          </p>
          <button type="button" onClick={onDone} className="text-[11px] font-semibold text-muted-foreground hover:text-navy">
            Cancel
          </button>
        </div>
        {emails.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            None of the selected cards has an email yet. Open a card to add one, or pick 1:1 partners.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {batches.map((b, i) => (
                <a
                  key={i}
                  href={mailto(b)}
                  onClick={() => flashOpening("your email app")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  ✉ Open in my email app{batches.length > 1 ? ` (${i + 1}/${batches.length}, ${b.length})` : ` (${b.length})`}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span>No mail app on this device?</span>
              {batches.map((b, i) => (
                <span key={i} className="flex gap-3">
                  <a href={gmailWeb(b)} target="_blank" rel="noopener noreferrer" onClick={() => flashOpening("Gmail")} className="font-semibold text-primary hover:underline">
                    Gmail web{batches.length > 1 ? ` ${i + 1}` : ""}
                  </a>
                  <a href={outlookWeb(b)} target="_blank" rel="noopener noreferrer" onClick={() => flashOpening("Outlook")} className="font-semibold text-primary hover:underline">
                    Outlook web{batches.length > 1 ? ` ${i + 1}` : ""}
                  </a>
                </span>
              ))}
              <button type="button" onClick={() => void copy()} className="font-semibold text-primary hover:underline">
                {copied ? "Copied ✓" : "Copy all emails"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

function WalletCardModal({
  entry,
  ownerEmail,
  onClose,
  onChanged,
  onRemoved,
}: {
  entry: WalletEntry;
  ownerEmail: string;
  onClose: () => void;
  onChanged: () => void;
  onRemoved: () => void;
}) {
  const [wEmail, setWEmail] = useState(entry.saved_email ?? "");
  const [wPhone, setWPhone] = useState(entry.saved_phone ?? "");
  const [wNote, setWNote] = useState(entry.saved_note ?? "");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const res = await saveLoungeContactInfo({
      data: { ownerEmail, contactRsvpId: entry.rsvp_id as string, email: wEmail, phone: wPhone, note: wNote },
    });
    setBusy(false);
    setMsg(res.ok ? "Saved." : "Couldn't save — try again.");
    if (res.ok) onChanged();
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    setRemoving(true);
    const res = await removeLoungeContact({ data: { ownerEmail, contactRsvpId: entry.rsvp_id as string } }).catch(() => ({ ok: false as const }));
    setBusy(false);
    setRemoving(false);
    if (res.ok) onRemoved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full max-w-md overflow-y-auto sheet-rise bg-card sm:shadow-[8px_8px_0_0_#00ccff]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-navy px-6 pb-6 pt-7 text-white">
          <NodePattern name="connect" className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-white/[0.07]" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 p-1.5 text-white/60 transition hover:text-yellow"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <span className="relative flex h-16 w-16 items-center justify-center bg-yellow text-xl font-extrabold text-navy">
            {initials(entry.full_name)}
          </span>
          <div className="relative mt-4 text-xl font-bold leading-tight">{entry.full_name}</div>
          <div className="relative mt-1 text-sm text-white/60">
            {entry.job_title}, {entry.organisation}
          </div>
          {entry.source === "meeting" && (
            <span className="relative mt-3 inline-flex items-center gap-2 text-xs font-semibold text-yellow">
              <span aria-hidden className="h-2 w-2 bg-yellow" />
              Met in a 1:1 meeting
            </span>
          )}
        </div>
        <div className="space-y-3 px-6 py-5">
          {entry.meeting_email && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
              <a
                href={`mailto:${entry.meeting_email}`}
                className="mt-0.5 block break-all text-sm font-semibold text-primary hover:underline"
              >
                {entry.meeting_email}
              </a>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                Shared because you two had a confirmed 1:1 meeting.
              </p>
            </div>
          )}
          {entry.contact_url && (
            <a
              href={absUrl(entry.contact_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-navy/85"
            >
              <LinkIcon className="h-4 w-4" />
              Connect on {contactLabel(entry.contact_url)}
            </a>
          )}

          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              My notes — only I can see these
            </div>
            <div className="mt-2 space-y-2">
              <input
                type="email"
                value={wEmail}
                onChange={(e) => setWEmail(e.target.value)}
                placeholder={entry.meeting_email ? "Alternative email (optional)" : "Their email (optional)"}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
              />
              <input
                type="tel"
                value={wPhone}
                onChange={(e) => setWPhone(e.target.value)}
                placeholder="Their phone (optional)"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
              />
              <textarea
                value={wNote}
                onChange={(e) => setWNote(e.target.value)}
                rows={2}
                placeholder="Note — where you met, follow-up ideas… (optional)"
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save()}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  <BusyLabel busy={busy && !removing} text="Saving…">Save</BusyLabel>
                </button>
                {msg && <span className="text-[11px] text-muted-foreground">{msg}</span>}
              </div>
            </div>
          </div>

          {entry.source === "manual" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove()}
              className="w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-rose-600"
            >
              <BusyLabel busy={removing} text="Removing…">Remove from My Contacts</BusyLabel>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact add-to-contacts popup: one optional free-text note ("where we
// met" — Nuldam, Seafood Expo, an intro, anything), then Add. Tammy asked
// for free text over a venue dropdown, and saving must work with the note
// left empty (30 Aug).
function AddContactPopup({
  profile,
  onAdd,
  onCancel,
}: {
  profile: LoungeProfile;
  onAdd: (note: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    await onAdd(note.trim());
  };
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm sheet-rise bg-card p-5 sm:shadow-[8px_8px_0_0_#00ccff]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: avatarColor(profile.full_name) }}
          >
            {initials(profile.full_name)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-navy">Add {profile.full_name}</div>
            <div className="truncate text-xs text-muted-foreground">{profile.organisation}</div>
          </div>
        </div>
        <label className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Note <span className="font-normal normal-case">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          autoFocus
          placeholder="Where did you meet? e.g. 1:1 meetup, site visit, introduced by…"
          className="mt-1 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
        />
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-navy transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <BusyLabel busy={busy} text="Adding…">Add to My Contacts</BusyLabel>
          </button>
        </div>
      </div>
    </div>
  );
}

// Create/edit modal for external cards — people who aren't in the RSVP
// list at all (Nuldam guests, Seafood Expo, personal intros). Only name is
// required. These exist solely inside the owner's wallet; the public wall
// renders from rsvps and never shows them.
function CustomContactModal({
  entry,
  ownerEmail,
  onClose,
  onDone,
}: {
  entry: WalletEntry | null;
  ownerEmail: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(entry?.full_name ?? "");
  const [org, setOrg] = useState(entry?.organisation ?? "");
  const [title, setTitle] = useState(entry?.job_title ?? "");
  const [cEmail, setCEmail] = useState(entry?.saved_email ?? "");
  const [cPhone, setCPhone] = useState(entry?.saved_phone ?? "");
  const [cNote, setCNote] = useState(entry?.saved_note ?? "");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    setErr(null);
    const payload = {
      ownerEmail,
      name,
      org: org || undefined,
      title: title || undefined,
      email: cEmail || undefined,
      phone: cPhone || undefined,
      note: cNote || undefined,
    };
    const res = entry?.entry_id
      ? await updateCustomContact({ data: { ...payload, entryId: entry.entry_id } })
      : await addCustomContact({ data: payload });
    setBusy(false);
    if (res.ok) onDone();
    else setErr("Couldn't save — try again.");
  };

  const remove = async () => {
    if (busy || !entry?.entry_id) return;
    setBusy(true);
    setRemoving(true);
    const res = await removeCustomContact({ data: { ownerEmail, entryId: entry.entry_id } }).catch(() => ({ ok: false as const }));
    setBusy(false);
    setRemoving(false);
    if (res.ok) onDone();
  };

  const field =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full max-w-sm overflow-y-auto sheet-rise bg-card p-5 sm:shadow-[8px_8px_0_0_#00ccff]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm font-bold text-navy">{entry ? "Edit contact" : "Add someone manually"}</div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          For people you met outside the attendee list — meetups, site visits, anywhere. Saved in
          your wallet and visible to the organizing team.
        </p>
        <div className="mt-4 space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (required)" autoFocus className={field} />
          <input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organisation (optional)" className={field} />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title (optional)" className={field} />
          <input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="Email (optional)" className={field} />
          <input type="tel" value={cPhone} onChange={(e) => setCPhone(e.target.value)} placeholder="Phone (optional)" className={field} />
          <textarea
            value={cNote}
            onChange={(e) => setCNote(e.target.value)}
            rows={2}
            placeholder="Note — where you met, follow-up ideas… (optional)"
            className={`${field} resize-none`}
          />
        </div>
        {err && <p className="mt-2 text-[11px] text-rose-600">{err}</p>}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-navy transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy || !name.trim()}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <BusyLabel busy={busy && !removing} text="Saving…">{entry ? "Save changes" : "Add contact"}</BusyLabel>
          </button>
        </div>
        {entry?.entry_id && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void remove()}
            className="mt-2 w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-rose-600"
          >
            <BusyLabel busy={removing} text="Removing…">Remove from My Contacts</BusyLabel>
          </button>
        )}
      </div>
    </div>
  );
}

// Organizer-only read view: every manually saved card across all wallets,
// newest first, with owner attribution. Gated server-side to @lodestart.ai
// RSVP emails.
function TeamContactsWall({ entries }: { entries: TeamContactEntry[] | null }) {
  if (!entries) {
    return <p className="mt-6 text-center text-sm text-muted-foreground"><LoadingNote text="Loading team view…" /></p>;
  }
  if (entries.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
        <p className="text-sm font-semibold text-navy">No manually added contacts yet</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          When attendees save cards by hand — attendee-wall adds or external people — they'll show
          up here with who saved them.
        </p>
      </div>
    );
  }
  const externals = entries.filter((e) => e.is_external).length;
  return (
    <>
      <p className="text-xs text-muted-foreground">
        {entries.length} manually saved across all attendees{externals ? ` · ${externals} external` : ""} · organizer view
      </p>
      <div className="mt-4 grid grid-cols-1 border-l border-t border-[#dcdcdc] sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((e, i) => (
          <div key={i} className="flex min-h-[150px] flex-col border-b border-r border-[#dcdcdc] bg-white p-5">
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ring-2 ring-white"
                style={{ backgroundColor: avatarColor(e.full_name) }}
              >
                {initials(e.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-navy">{e.full_name}</div>
                {e.job_title && (
                  <div className="line-clamp-2 break-words text-xs leading-snug text-muted-foreground">{e.job_title}</div>
                )}
                {e.organisation && <div className="mt-0.5 truncate text-xs font-medium text-navy/60">{e.organisation}</div>}
              </div>
              {e.is_external ? (
                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  External
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-navy ring-1 ring-inset ring-border">
                  Attendee
                </span>
              )}
            </div>
            {(e.contact_email || e.contact_phone) && (
              <div className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                {e.contact_email && <div className="break-all">✉ {e.contact_email}</div>}
                {e.contact_phone && <div>☎ {e.contact_phone}</div>}
              </div>
            )}
            {e.note && <p className="mt-2 line-clamp-2 text-[11px] italic text-muted-foreground">“{e.note}”</p>}
            <div className="mt-3 border-t border-border pt-2 text-[10px] text-muted-foreground">
              Saved by <span className="font-semibold text-navy/70">{e.owner_email}</span> ·{" "}
              {new Date(e.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
