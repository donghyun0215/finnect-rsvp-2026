import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/Wordmark";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { companies, MEETUP_COMPANIES } from "@/data/companies";
import {
  EVENT_DATE,
  EVENT_DAY_SHORT,
  DEMO_AGENDA,
  EVENT_TIME,
  EVENT_VENUE,
  EVENT_ADDRESS,
  EVENT_MAP_URL,
  PROGRAM,
  TIMESLOTS,
  getSlotInfo,
  isSlotOffered,
  ONE_ON_ONE_OPEN,
  EVENT_NAME, MEETUP_DATES_SHORT, MEETUP_DAYS, meetupDay, slotName, companySessions } from "@/data/timeslots";
import { STARTUP_LOGOS } from "@/data/companyImages";
import { supabase } from "@/lib/supabase-client";
import {
  createRsvp,
  lookupRsvpByEmail,
  lookupBookingsByEmail,
  selfCancelBooking,
  type RsvpInput,
  type MyBooking,
} from "@/lib/booking.server";
import { BusyLabel, LoadingNote } from "@/components/Spinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const searchSchema = z.object({
  company: z.string().optional(),
  // Which day the guest is registering for. The home page's two CTAs land
  // here with 5 or 7; the tab on this page switches it. Two days, two
  // separate sign-ups — a second submit for the other day must not wipe
  // the first, so submit merges with the existing RSVP (see handleSubmit).
  // TanStack parses ?day=5 as a number, so coerce before the enum check.
  day: z.preprocess((v) => (v == null ? v : String(v)), z.enum(["5", "7"])).optional(),
  // Kept so home-page links with ?on=thu|fri stay valid; both afternoons
  // now sit on one board, so it no longer changes the view.
  on: z.enum(["thu", "fri"]).optional(),
});

export const Route = createFileRoute("/book")({
  component: RsvpPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: `RSVP — ${EVENT_NAME}` }],
  }),
});

type BookedKey = `${string}__${string}`;
const key = (companySlug: string, timeslotId: string): BookedKey => `${companySlug}__${timeslotId}`;

const INTEREST_OPTIONS = [
  "Pilot / trial opportunity",
  "Investment",
  "Distribution / partnership",
  "General interest",
];

interface FormState {
  fullName: string;
  organisation: string;
  jobTitle: string;
  email: string;
  phone: string;
  primaryInterest: string;
  notes: string;
  additionalAttendees: string;
  contactUrl: string;
  showInLounge: boolean;
}

const emptyForm: FormState = {
  fullName: "",
  organisation: "",
  jobTitle: "",
  email: "",
  phone: "",
  primaryInterest: "",
  notes: "",
  additionalAttendees: "",
  contactUrl: "",
  showInLounge: true,
};

function RsvpPage() {
  const { company: preselectSlug, day: dayParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  // Company deep-links come from startup cards → they are 1:1 requests.
  const day: "5" | "7" = dayParam ?? (preselectSlug ? "5" : "7");
  const setDay = (d: "5" | "7") => navigate({ search: (prev) => ({ ...prev, day: d }), replace: true });

  // availability
  const [booked, setBooked] = useState<Set<BookedKey>>(new Set());
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState<Record<string, string>>({}); // timeslotId -> companySlug

  // rsvp form
  const [attend, setAttend] = useState({ showcase: false, lunch: false, meetups: false });
  // Day 5 = 1:1 only, always on; Day 7 = showcase/dinner checkboxes, 1:1 off.
  // Day 5 = 1:1 only; Day 7 = the whole demo day (pitches + networking), no
  // per-session choice — RSVP means you're coming for the afternoon.
  useEffect(() => {
    setAttend((a) =>
      day === "5" ? { ...a, meetups: true } : { showcase: true, lunch: true, meetups: false },
    );
  }, [day]);
  const [selections, setSelections] = useState<Record<string, string | null>>(
    () => Object.fromEntries(TIMESLOTS.map((t) => [t.id, null])),
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    attend: typeof attend;
    bookings: { timeslotId: string; companySlug: string; ok: boolean; message?: string }[];
    email: string;
    emailSent: boolean;
  } | null>(null);
  // Success is shown as a modal — the old inline green banner sat above the
  // fold and people didn't notice it.
  const [successOpen, setSuccessOpen] = useState(false);

  // lookup / self-manage
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupResults, setLookupResults] = useState<MyBooking[] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [selfCancelling, setSelfCancelling] = useState<string | null>(null);

  const refreshAvailability = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("booked_slots").select("company_id, timeslot_id");
    if (!error && data) {
      const serverBooked = new Set(data.map((row) => key(row.company_id, row.timeslot_id)));
      setBooked(serverBooked);
      setMyBookings((prev) => {
        const next: Record<string, string> = {};
        let changed = false;
        for (const [timeslotId, companySlug] of Object.entries(prev)) {
          if (serverBooked.has(key(companySlug, timeslotId))) next[timeslotId] = companySlug;
          else changed = true;
        }
        if (changed) {
          try {
            localStorage.setItem("kimst-my-bookings", JSON.stringify(next));
          } catch {
            // ignore
          }
        }
        return changed ? next : prev;
      });
    }
    setLoading(false);
  };

  const syncMyBookingsFromServer = async (email: string) => {
    const rows = await lookupBookingsByEmail({ data: { email } });
    const next: Record<string, string> = {};
    for (const b of rows) next[b.timeslot_id] = b.company_id;
    setMyBookings(next);
    try {
      localStorage.setItem("kimst-my-bookings", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshAvailability();
    try {
      const storedEmail = localStorage.getItem("kimst-my-email");
      if (storedEmail) {
        setLookupEmail(storedEmail);
        syncMyBookingsFromServer(storedEmail);
      } else {
        const stored = localStorage.getItem("kimst-my-bookings");
        if (stored) setMyBookings(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live availability
  useEffect(() => {
    const channel = supabase
      .channel("book-availability")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        refreshAvailability();
      })
      .subscribe();
    const poll = setInterval(refreshAvailability, 30000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preselect from ?company=
  useEffect(() => {
    if (!loading && preselectSlug && MEETUP_COMPANIES.some((c) => c.slug === preselectSlug)) {
      setAttend((a) => ({ ...a, meetups: true }));
      setSelections((prev) => {
        const openSlot = TIMESLOTS.find(
          (t) =>
            isSlotOffered(preselectSlug, t.id) &&
            !booked.has(key(preselectSlug, t.id)) &&
            !myBookings[t.id] &&
            !prev[t.id],
        );
        if (!openSlot) return prev;
        return { ...prev, [openSlot.id]: preselectSlug };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectSlug, loading]);

  function toggleSelection(timeslotId: string, companySlug: string) {
    setSelections((prev) => ({
      ...prev,
      [timeslotId]: prev[timeslotId] === companySlug ? null : companySlug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.primaryInterest) {
      setFormError("Please choose what brings you here.");
      return;
    }


    const meetupSelections = attend.meetups
      ? TIMESLOTS.filter((t) => selections[t.id] && !myBookings[t.id]).map((t) => ({
          timeslotId: t.id,
          companySlug: selections[t.id] as string,
        }))
      : [];
    if (ONE_ON_ONE_OPEN && attend.meetups && meetupSelections.length === 0 && Object.keys(myBookings).length === 0) {
      setFormError("Please pick at least one startup for your 1:1 meetups (or untick that session).");
      return;
    }

    setSubmitting(true);
    // Merge with any existing RSVP for this email so registering for one
    // day doesn't erase the other day's choices.
    let existing: Awaited<ReturnType<typeof lookupRsvpByEmail>> = null;
    try {
      existing = await lookupRsvpByEmail({ data: { email: form.email.trim() } });
    } catch (err) {
      console.error("lookupRsvpByEmail failed:", err);
      setSubmitting(false);
      setFormError("We couldn't reach the server. Please check your connection and try again.");
      return;
    }
    const merged =
      day === "5"
        ? { showcase: existing?.attend_showcase ?? false, lunch: existing?.attend_lunch ?? false, meetups: true }
        : { showcase: attend.showcase, lunch: attend.lunch, meetups: existing?.attend_meetups ?? false };
    const payload: RsvpInput = {
      fullName: form.fullName.trim(),
      organisation: form.organisation.trim(),
      jobTitle: form.jobTitle.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      primaryInterest: form.primaryInterest,
      notes: form.notes.trim() || undefined,
      additionalAttendees: merged.meetups ? form.additionalAttendees.trim() || undefined : undefined,
      contactUrl: form.contactUrl.trim() || undefined,
      showInLounge: form.showInLounge,
      attendShowcase: merged.showcase,
      attendLunch: merged.lunch,
      attendMeetups: merged.meetups,
      meetupSelections,
    };
    let result: Awaited<ReturnType<typeof createRsvp>>;
    try {
      result = await createRsvp({ data: payload });
    } catch (err) {
      console.error("createRsvp failed:", err);
      setSubmitting(false);
      setFormError("We couldn't reach the server. Please check your connection and try again.");
      return;
    }
    setSubmitting(false);

    if (!result.rsvpOk) {
      setFormError(result.message ?? "Something went wrong. Please try again.");
      return;
    }

    try {
      localStorage.setItem("kimst-my-email", payload.email.toLowerCase());
    } catch {
      // ignore
    }
    setLookupEmail(payload.email);
    setLookupResults(null);
    setSubmitted({
      attend: { ...attend },
      bookings: result.bookingResults,
      email: payload.email,
      emailSent: Boolean(result.emailSent),
    });
    setSuccessOpen(true);
    setSelections(Object.fromEntries(TIMESLOTS.map((t) => [t.id, null])));
    await refreshAvailability();
    await syncMyBookingsFromServer(payload.email);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const email = lookupEmail.trim();
    if (!email) return;
    setLookupLoading(true);
    try {
      setLookupResults(await lookupBookingsByEmail({ data: { email } }));
    } catch {
      alert("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSelfCancel(b: MyBooking) {
    const c = companies.find((x) => x.slug === b.company_id);
    const info = getSlotInfo(b.timeslot_id);
    if (
      !confirm(
        `Cancel your ${info.label} (${info.time}) meeting with ${c?.name ?? b.company_id}?\n\nThis frees the slot for someone else and cannot be undone.`,
      )
    )
      return;
    setSelfCancelling(b.id);
    const res = await selfCancelBooking({ data: { email: lookupEmail, id: b.id } }).catch(() => ({ ok: false as const }));
    setSelfCancelling(null);
    if (res.ok) {
      setLookupResults((prev) => (prev ? prev.filter((x) => x.id !== b.id) : prev));
      const updated = { ...myBookings };
      if (updated[b.timeslot_id] === b.company_id) {
        delete updated[b.timeslot_id];
        setMyBookings(updated);
        try {
          localStorage.setItem("kimst-my-bookings", JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      await refreshAvailability();
    } else {
      alert("Could not cancel this booking. Please refresh and try again.");
    }
  }

  const myBookingCount = Object.keys(myBookings).length;
  const pickedSlots = TIMESLOTS.filter((t) => selections[t.id] && !myBookings[t.id]);
  const scheduleCount = pickedSlots.length + myBookingCount;
  const thuSlots = TIMESLOTS.filter((t) => t.day === "thu");
  const friSlots = TIMESLOTS.filter((t) => t.day === "fri");

  // Crosshair for the picker: the row and round under the pointer.
  const [hover, setHover] = useState<{ slug: string; slot: string } | null>(null);

  // Mobile "continue" bar shows while the details form is off-screen.
  const detailsRef = useRef<HTMLElement>(null);
  const [detailsInView, setDetailsInView] = useState(false);
  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDetailsInView(e.isIntersecting), { rootMargin: "0px 0px -30% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [day]);
  const goToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => detailsRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }), 500);
  };

  const field = "fn-field mt-1.5";

  const showBar = day === "5" && ONE_ON_ONE_OPEN && pickedSlots.length > 0 && !detailsInView;

  return (
    <div className={`min-h-screen bg-background ${showBar ? "max-lg:pb-20" : ""}`}>
      {/* HERO — same black ground and nav as the home page */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="min-w-0">
            <Wordmark light compact />
          </Link>
          <nav className="flex shrink-0 items-center text-[13px] font-semibold sm:text-sm">
            <Link to="/" hash="startups" className="nav-link">Startups</Link>
            <Link to="/lounge" className="nav-link whitespace-nowrap">Networking Lounge</Link>
          </nav>
        </header>

        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pb-16 md:pt-12">
          <h1 className="hero-in max-w-3xl text-[clamp(2.1rem,5.6vw,3.9rem)] font-extrabold leading-[1.02] tracking-tight">
            {day === "5" ? "Pick your 1:1 meetings" : "RSVP for the Demo Day"}
          </h1>
          <p className="hero-in mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-white/70 [--i:1]">
            {day === "5"
              ? "Private meetings with the startups of your choice, on Thursday and Friday afternoon. One startup per round; book as many rounds as you like."
              : "IR pitches from Korean fintechs, then their meetings with investors, run with Tenity on Thursday morning."}
          </p>

          {/* The two sign-ups, as the home page's two sessions */}
          <div role="tablist" aria-label="What are you registering for?" className="hero-in mt-9 grid gap-3 sm:grid-cols-2 [--i:2]">
            {([
              ["7", "Demo Day", `${EVENT_DAY_SHORT} · ${EVENT_TIME}`, EVENT_VENUE],
              ["5", "1:1 business meetings", `${MEETUP_DATES_SHORT} · afternoons`, `${TIMESLOTS.length} rounds · ${MEETUP_COMPANIES.length} startups`],
            ] as const).map(([d, title, when, where]) => {
              const on = day === d;
              return (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setDay(d)}
                  className={`mode-tile group text-left ${on ? "is-on" : ""}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-lg font-bold">{title}</span>
                    <span aria-hidden className="mode-dot" />
                  </span>
                  <span className="mt-1 block text-sm tabular-nums text-white/70">{when}</span>
                  <span className="block text-sm text-white/45">{where}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div aria-hidden className="h-2 bg-brand-band" />
      </section>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* SUCCESS MODAL */}
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent className="w-[calc(100%-2rem)] max-w-md gap-0 overflow-hidden rounded-[3px] border-0 p-0 sm:rounded-[3px]">
            {submitted && (
              <>
                <div className="bg-navy px-6 pb-6 pt-7 text-white">
                  <span aria-hidden className="flex h-11 w-11 items-center justify-center bg-yellow text-xl font-bold text-navy shadow-[3px_3px_0_0_#00ccff]">✓</span>
                  <DialogHeader className="mt-5 space-y-1 text-left">
                    <DialogTitle className="text-2xl font-extrabold text-white">
                      {submitted.bookings.some((b) => !b.ok) ? "Almost there" : "You're registered"}
                    </DialogTitle>
                    <DialogDescription className="text-white/65">
                      {submitted.bookings.some((b) => !b.ok)
                        ? "Your RSVP is saved, but some picks were taken. Details below."
                        : day === "5" ? "See you in Singapore." : `See you on ${EVENT_DATE.replace(" 2026", "")}.`}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <ul className="divide-y divide-border px-6">
                  {(submitted.attend.showcase || submitted.attend.lunch) && (
                    <li className="flex items-baseline gap-4 py-3.5 text-sm">
                      <span className="w-24 shrink-0 tabular-nums text-muted-foreground">{EVENT_DAY_SHORT}</span>
                      <span className="font-semibold text-navy">Demo Day · {EVENT_TIME}</span>
                    </li>
                  )}
                  {submitted.bookings.map((b) => {
                    const c = companies.find((x) => x.slug === b.companySlug);
                    const t = TIMESLOTS.find((x) => x.id === b.timeslotId);
                    return (
                      <li key={`m-${b.timeslotId}-${b.companySlug}`} className="flex items-baseline gap-4 py-3.5 text-sm">
                        <span className="w-24 shrink-0 tabular-nums text-muted-foreground">{t ? `${meetupDay(t.day).short.split(" ")[0]} ${t.label.replace("Round ", "R")}` : ""}</span>
                        <span className={b.ok ? "font-semibold text-navy" : "text-destructive line-through"}>{c?.name}</span>
                        {!b.ok && <span className="ml-auto shrink-0 text-xs text-destructive">{b.message ?? "Taken"}</span>}
                      </li>
                    );
                  })}
                  {submitted.attend.meetups && submitted.bookings.length === 0 && (
                    <li className="py-3.5 text-sm text-navy">1:1 meetings ({MEETUP_DATES_SHORT}): the organisers will be in touch.</li>
                  )}
                </ul>
                <p className="mx-6 mt-2 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                  {submitted.emailSent ? (
                    <>We've emailed your schedule to <strong className="break-all text-navy">{submitted.email}</strong>. Not there in a few minutes? Check spam or promotions.</>
                  ) : (
                    <>Your registration is saved. Check or cancel your meetings any time at the bottom of this page.</>
                  )}
                </p>
                <div className="p-6">
                  <button type="button" onClick={() => setSuccessOpen(false)} className="btn-node w-full justify-center">Done</button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Failed picks stay visible on the page after the modal is closed */}
        {submitted && !successOpen && submitted.bookings.some((b) => !b.ok) && (
          <div className="mt-10 border-l-4 border-destructive bg-[#fff4ef] p-5 text-navy">
            <p className="font-bold">Some picks couldn't be booked. The rest of your RSVP is confirmed.</p>
            <ul className="mt-2 space-y-1 text-sm">
              {submitted.bookings.filter((b) => !b.ok).map((b) => {
                const c = companies.find((x) => x.slug === b.companySlug);
                const t = TIMESLOTS.find((x) => x.id === b.timeslotId);
                return (
                  <li key={`${b.timeslotId}-${b.companySlug}`}>
                    {t ? slotName(t) : ""}: {c?.name} ({b.message} Pick another startup below and submit again.)
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {day === "7" ? (
            /* DEMO DAY — the morning, as on the home page */
            <section className="grid gap-10 py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-20">
              <div>
                <h2 className="text-3xl font-bold text-navy md:text-4xl">{EVENT_DATE.replace(" 2026", "")}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Doors open at 09:00. Each attendee registers separately, so colleagues need their own RSVP.
                </p>
                <p className="mt-6 text-sm text-navy">
                  {EVENT_MAP_URL ? (
                    <a href={EVENT_MAP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{EVENT_VENUE}</a>
                  ) : <span className="font-semibold">{EVENT_VENUE}</span>}
                  <span className="block text-muted-foreground">{EVENT_ADDRESS}</span>
                </p>
              </div>
              <div className="border-t-4 border-navy pt-5">
                <p className="text-sm font-semibold text-muted-foreground">Morning, with Tenity</p>
                <ol className="mt-3 divide-y divide-navy/10 border-y border-navy/10">
                  {DEMO_AGENDA.map(([time, label]) => (
                    <li key={time} className="grid grid-cols-[7.5rem_1fr] gap-3 py-3 text-[15px]">
                      <span className="tabular-nums text-muted-foreground">{time}</span>
                      <span className="text-navy">{label}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm text-muted-foreground">
                  Want private meetings too?{" "}
                  <button type="button" onClick={() => setDay("5")} className="font-semibold text-navy underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">
                    Book 1:1s on Thursday or Friday afternoon
                  </button>
                </p>
              </div>
            </section>
          ) : (
            /* 1:1 PICKER — both afternoons on one board */
            <section className="py-14 md:py-20" aria-labelledby="pick-title">
              <div className="flex items-start gap-4">
                <span aria-hidden className="step-node">1</span>
                <div>
                  <h2 id="pick-title" className="text-3xl font-bold text-navy md:text-4xl">Pick your startups</h2>
                  <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
                    One startup per round. Tap a square to pick it, tap again to clear.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
                <div className="min-w-0">
                  {!ONE_ON_ONE_OPEN ? (
                    <p className="border-l-4 border-yellow bg-secondary p-5 text-sm text-navy">
                      Booking opens soon. Register below and the organisers will match you with the startups that fit your goals.
                    </p>
                  ) : (
                    <div className="pick-board" role="grid" aria-label="1:1 meeting rounds" aria-busy={loading} onMouseLeave={() => setHover(null)}>
                      {/* day headers */}
                      <div role="row" className="pick-row pick-head">
                        <span role="columnheader" className="pick-name text-xs text-muted-foreground">
                          {loading ? <LoadingNote text="Checking availability…" className="text-xs font-semibold text-navy" /> : `${MEETUP_COMPANIES.length} startups`}
                        </span>
                        {MEETUP_DAYS.map((d) => (
                          <span key={d.id} role="columnheader" className={`pick-day ${d.id === "fri" ? "is-fri" : ""}`}>
                            <span className="block font-bold text-navy">{d.short}</span>
                            <span className="block truncate text-[11px] tabular-nums text-muted-foreground">{d.id === "fri" ? "Time TBC" : d.time}</span>
                          </span>
                        ))}
                      </div>
                      {/* round headers */}
                      <div role="row" className="pick-row pick-rounds">
                        <span className="pick-name" />
                        {[thuSlots, friSlots].map((slots, g) => (
                          <span key={g} className="pick-group">
                            {slots.map((t) => (
                              <span key={t.id} role="columnheader" className={`pick-round ${hover?.slot === t.id ? "is-hot" : ""}`}>
                                <span className="font-bold text-navy">{t.label.replace("Round ", "R")}</span>
                                <span className="hidden text-[10px] tabular-nums text-muted-foreground lg:block">{t.day === "thu" ? t.time.split("–")[0].trim() : "TBC"}</span>
                              </span>
                            ))}
                          </span>
                        ))}
                      </div>

                      {MEETUP_COMPANIES.map((c) => {
                        const logo = STARTUP_LOGOS[c.slug];
                        const friOnly = !companySessions(c.slug).includes("thu");
                        return (
                          <div key={c.slug} role="row" className={`pick-row ${hover?.slug === c.slug ? "is-hot" : ""}`}>
                            <Link to="/companies/$slug" params={{ slug: c.slug }} target="_blank" className="pick-name group flex items-center gap-3" title={`${c.name}: open profile`}>
                              <span className="pick-logo hidden sm:inline-flex">
                                {logo ? <img src={logo} alt="" className="max-h-6 max-w-full object-contain" /> : <span className="text-[10px] font-extrabold leading-none text-navy">{c.name}</span>}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[13px] font-semibold leading-tight text-navy group-hover:underline sm:text-sm">{c.name}</span>
                                <span className="hidden truncate text-xs text-muted-foreground sm:block">{c.sector}</span>
                              </span>
                            </Link>
                            {[thuSlots, friSlots].map((slots, g) =>
                              g === 0 && friOnly ? (
                                <span key={g} className="pick-group">
                                  <span className="pick-closed">Friday only</span>
                                </span>
                              ) : (
                                <span key={g} className="pick-group">
                                  {slots.map((t) => {
                                    const isBooked = booked.has(key(c.slug, t.id));
                                    const isMine = myBookings[t.id] === c.slug;
                                    const iHaveThisRound = Boolean(myBookings[t.id]) && !isMine;
                                    const isSelected = selections[t.id] === c.slug;
                                    const state = isMine ? "is-mine" : isBooked ? "is-full" : isSelected ? "is-picked" : iHaveThisRound ? "is-blocked" : "";
                                    const when = `${meetupDay(t.day).short}, ${t.label}${t.day === "thu" ? `, ${t.time}` : ""}`;
                                    return (
                                      <span key={t.id} role="gridcell" className={`pick-cell ${hover?.slot === t.id ? "is-hot" : ""}`}>
                                        <button
                                          type="button"
                                          disabled={loading || isBooked || isMine || iHaveThisRound}
                                          aria-pressed={isSelected}
                                          aria-label={`${c.name}, ${when}${isMine ? ", booked by you" : isBooked ? ", taken" : iHaveThisRound ? ", you already have a meeting in this round" : ""}`}
                                          title={isMine ? "Booked" : isBooked ? "Taken" : iHaveThisRound ? "You already have a meeting in this round" : `${c.name} · ${when}`}
                                          onMouseEnter={() => setHover({ slug: c.slug, slot: t.id })}
                                          onFocus={() => setHover({ slug: c.slug, slot: t.id })}
                                          onClick={() => toggleSelection(t.id, c.slug)}
                                          className={`pick ${state}`}
                                        >
                                          {(isSelected || isMine) && <span aria-hidden>✓</span>}
                                        </button>
                                      </span>
                                    );
                                  })}
                                </span>
                              ),
                            )}
                          </div>
                        );
                      })}

                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground" aria-label="Legend">
                        <li className="flex items-center gap-2"><span aria-hidden className="pick pick-legend" />Open</li>
                        <li className="flex items-center gap-2"><span aria-hidden className="pick pick-legend is-picked" />Your pick</li>
                        <li className="flex items-center gap-2"><span aria-hidden className="pick pick-legend is-mine" />Booked by you</li>
                        <li className="flex items-center gap-2"><span aria-hidden className="pick pick-legend is-full" />Taken</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* YOUR SCHEDULE — fills in as you pick */}
                {ONE_ON_ONE_OPEN && (
                  <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Your schedule" aria-live="polite">
                    <div className="border-t-4 border-yellow bg-navy p-5 text-white">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-bold">Your schedule</h3>
                        <span className="text-sm tabular-nums text-white/60">{scheduleCount} / {TIMESLOTS.length}</span>
                      </div>
                      {MEETUP_DAYS.map((d) => (
                        <div key={d.id} className="mt-5">
                          <p className="text-xs text-white/50">{d.short} · {d.id === "fri" ? "time TBC" : d.time}</p>
                          <ol className="mt-2 space-y-1.5">
                            {TIMESLOTS.filter((t) => t.day === d.id).map((t) => {
                              const mine = myBookings[t.id];
                              const pick = mine ?? selections[t.id];
                              const c = pick ? companies.find((x) => x.slug === pick) : undefined;
                              return (
                                <li key={t.id} className={`sched-slot ${c ? "is-filled" : ""}`}>
                                  <span className="w-7 shrink-0 text-xs font-bold tabular-nums text-white/50">{t.label.replace("Round ", "R")}</span>
                                  {c ? (
                                    <>
                                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{c.name}</span>
                                      {mine ? (
                                        <span className="shrink-0 text-xs font-semibold text-yellow">Booked</span>
                                      ) : (
                                        <button type="button" onClick={() => toggleSelection(t.id, c.slug)} className="sched-x" aria-label={`Remove ${c.name} from ${slotName(t)}`}>×</button>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-sm text-white/35">Open</span>
                                  )}
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      ))}
                      <button type="button" onClick={goToDetails} disabled={scheduleCount === 0} className="btn-node mt-6 w-full justify-center disabled:pointer-events-none disabled:opacity-40">
                        {pickedSlots.length ? `Continue with ${pickedSlots.length} ${pickedSlots.length === 1 ? "meeting" : "meetings"}` : "Pick a startup to continue"}
                      </button>
                      <p className="mt-3 text-xs leading-relaxed text-white/45">Friday's round times follow the morning's institution visits. We'll email them once they're set.</p>
                    </div>
                  </aside>
                )}
              </div>
            </section>
          )}

          {/* DETAILS */}
          <section ref={detailsRef} id="details" className="scroll-mt-6 border-t border-border py-14 md:py-20" aria-labelledby="details-title">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
              <div className="min-w-0">
                <div className="flex items-start gap-4">
                  {day === "5" && <span aria-hidden className="step-node">2</span>}
                  <div>
                    <h2 id="details-title" className="text-3xl font-bold text-navy md:text-4xl">Your details</h2>
                    <p className="mt-2 text-[15px] text-muted-foreground">Already registered? Use the same email and we'll update your RSVP.</p>
                  </div>
                </div>

                <div className="mt-10 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  {([
                    ["fullName", "Full name", "text", "", "name"],
                    ["organisation", "Organisation", "text", "", "organization"],
                    ["jobTitle", "Job title", "text", "", "organization-title"],
                    ["email", "Email", "email", "", "email"],
                    ["phone", "Phone", "tel", "+65 XXXX XXXX", "tel"],
                  ] as const).map(([k, label, type, ph, ac]) => (
                    <label key={k} className="block">
                      <span className="text-sm font-semibold text-navy">{label}</span>
                      <input
                        required
                        type={type}
                        autoComplete={ac}
                        placeholder={ph}
                        value={form[k]}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                        className={field}
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="text-sm font-semibold text-navy">LinkedIn or website <span className="font-normal text-muted-foreground">(optional)</span></span>
                    <input
                      value={form.contactUrl}
                      onChange={(e) => setForm({ ...form, contactUrl: e.target.value })}
                      placeholder="linkedin.com/in/yourname"
                      className={field}
                    />
                  </label>
                </div>

                <fieldset className="mt-8">
                  <legend className="text-sm font-semibold text-navy">What brings you here?</legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((opt) => (
                      <label key={opt} className={`chip-node ${form.primaryInterest === opt ? "is-on" : ""}`}>
                        <input
                          type="radio"
                          name="primaryInterest"
                          value={opt}
                          required
                          checked={form.primaryInterest === opt}
                          onChange={() => setForm({ ...form, primaryInterest: opt })}
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {attend.meetups && (
                  <label className="mt-8 block">
                    <span className="text-sm font-semibold text-navy">Colleagues joining your 1:1s <span className="font-normal text-muted-foreground">(optional)</span></span>
                    <input
                      value={form.additionalAttendees}
                      onChange={(e) => setForm({ ...form, additionalAttendees: e.target.value })}
                      placeholder="Jane Tan (Co-founder), David Lim (Marketing)"
                      className={field}
                    />
                    <span className="mt-1.5 block text-xs text-muted-foreground">Meetings are booked per organisation; we'll print badges for the names here.</span>
                  </label>
                )}

                <label className="mt-8 block">
                  <span className="text-sm font-semibold text-navy">Notes or questions <span className="font-normal text-muted-foreground">(optional)</span></span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="Dietary requirements, questions, anything we should know"
                    className={`${field} h-auto py-2.5`}
                  />
                </label>

                <label className="lounge-toggle mt-8">
                  <input type="checkbox" checked={form.showInLounge} onChange={(e) => setForm({ ...form, showInLounge: e.target.checked })} className="peer sr-only" />
                  <span aria-hidden className="lounge-switch" />
                  <span>
                    <span className="block text-sm font-semibold text-navy">Show me in the Networking Lounge</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">Your name, organisation and title, visible to fellow attendees only. Email and phone are never shown.</span>
                  </span>
                </label>
              </div>

              {/* CONFIRM — sticks beside the form on desktop */}
              <div className="lg:sticky lg:top-6 lg:self-start">
                <div className="border-t-4 border-navy bg-secondary p-5">
                  <h3 className="text-lg font-bold text-navy">Confirm</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-navy">
                    {day === "7" ? (
                      <li className="flex gap-2"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 bg-yellow ring-1 ring-navy/20" />Demo Day · {EVENT_DAY_SHORT} · {EVENT_TIME}</li>
                    ) : scheduleCount === 0 ? (
                      <li className="text-muted-foreground">No meetings picked yet.</li>
                    ) : (
                      TIMESLOTS.filter((t) => myBookings[t.id] || selections[t.id]).map((t) => (
                        <li key={t.id} className="flex gap-2">
                          <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 bg-yellow ring-1 ring-navy/20" />
                          <span className="min-w-0">
                            <span className="text-muted-foreground">{meetupDay(t.day).short.split(" ")[0]} {t.label.replace("Round ", "R")}</span>{" "}
                            {companies.find((x) => x.slug === (myBookings[t.id] ?? selections[t.id]))?.name}
                            {myBookings[t.id] && <span className="text-muted-foreground"> (booked)</span>}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                  {formError && <p role="alert" className="mt-4 border-l-4 border-destructive bg-white px-3 py-2 text-sm text-navy">{formError}</p>}
                  <button type="submit" disabled={submitting} className="btn-node mt-5 w-full justify-center disabled:opacity-60">
                    <BusyLabel busy={submitting} text="Confirming…">Confirm my RSVP</BusyLabel>
                  </button>
                  <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                    The organisers use your details only to run this event, in line with Singapore's PDPA.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* CHECK / MANAGE — #manage is linked from the confirmation email */}
      <section id="manage" className="scroll-mt-6 bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-16">
          <div>
            <h2 className="text-2xl font-bold text-navy md:text-3xl">Already booked?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Enter your email to see your 1:1 meetings on any device, or cancel one so someone else can take it.
            </p>
          </div>
          <div>
            <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={lookupEmail}
                onChange={(e) => {
                  setLookupEmail(e.target.value);
                  setLookupResults(null);
                }}
                placeholder="your@email.com"
                aria-label="Email used to register"
                className="fn-field sm:flex-1"
              />
              <button type="submit" disabled={lookupLoading} className="btn-node-dark shrink-0 justify-center disabled:opacity-60">
                <BusyLabel busy={lookupLoading} text="Checking…">Find my meetings</BusyLabel>
              </button>
            </form>

            {lookupResults !== null && (
              <div className="mt-6">
                {lookupResults.length === 0 ? (
                  <p className="border border-dashed border-navy/20 p-5 text-sm text-muted-foreground">
                    No meetings found for this email. The lookup matches the exact address used on the form.
                  </p>
                ) : (
                  <ul className="divide-y divide-navy/10 border-y border-navy/10 bg-white">
                    {lookupResults.map((b) => {
                      const c = companies.find((x) => x.slug === b.company_id);
                      const info = getSlotInfo(b.timeslot_id);
                      return (
                        <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
                          <span className="w-36 shrink-0 text-sm tabular-nums text-muted-foreground">{info.label.replace("1:1 ", "")}<span className="block text-xs">{info.time}</span></span>
                          <span className="min-w-0 flex-1">
                            {c ? (
                              <Link to="/companies/$slug" params={{ slug: c.slug }} className="font-bold text-navy underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">{c.name}</Link>
                            ) : <span className="font-bold text-navy">{b.company_id}</span>}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelfCancel(b)}
                            disabled={selfCancelling === b.id}
                            className="btn-node-line !border-destructive/40 !py-2 !text-destructive hover:!border-destructive disabled:opacity-50"
                          >
                            <BusyLabel busy={selfCancelling === b.id} text="Cancelling…">Cancel</BusyLabel>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
          <Wordmark />
          <a href="mailto:support@lodestart.ai" className="text-sm font-semibold text-navy underline decoration-yellow decoration-2 underline-offset-4 hover:decoration-navy">support@lodestart.ai</a>
        </div>
      </footer>

      {/* Phones: keep the next step in reach while picking */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-yellow bg-navy px-4 py-3 text-white lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <span className="min-w-0 flex-1 text-sm">
              <b className="tabular-nums">{pickedSlots.length}</b> {pickedSlots.length === 1 ? "meeting" : "meetings"} picked
              <span className="block truncate text-xs text-white/55">
                {pickedSlots.map((t) => companies.find((x) => x.slug === selections[t.id])?.name).join(", ")}
              </span>
            </span>
            <button type="button" onClick={goToDetails} className="btn-node shrink-0 !px-4 !py-2.5 text-sm">Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}
