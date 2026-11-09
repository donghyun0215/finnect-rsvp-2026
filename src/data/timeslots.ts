export type MeetupDayId = "thu" | "fri";

export interface Timeslot {
  id: string;
  label: string;
  time: string;
  day: MeetupDayId;
}

// ── FIN:NECT Global Demoday Singapore 2026 (Korea Fintech Center) ──
// Everything event-specific lives in this file, so a confirmed venue or time
// is a one-line change. Source: "[마스터파일] 핀테크지원센터_현지프로그램"
// (26_세부 일정표, read 12 Oct), the ops table and the LodestarT × MYSC ops
// meeting deck (12 Oct: Tenity run of show, 80RR venue). Programme
// 17–21 Nov during Singapore FinTech Festival week; the public day is Thu
// 19 Nov: Demo Day with Tenity in the morning, 1:1 meetings after lunch.
export const SITE_URL = "https://finnect-rsvp-2026.vercel.app";
// ponytail: host + sponsor only for now (KISED lesson); MYSC / LodestarT
// were listed as co-organisers on the 2025 page — add back if the centre wants.
export const CREDITS = "Hosted by the Korea Fintech Center · Sponsored by KakaoBank";

// Title as MYSC set it (20 Oct): FIN:NECT logo + "Global Demoday Singapore 2026".
export const EVENT_NAME = "FIN:NECT Global Demoday Singapore 2026";
export const EVENT_NAME_SHORT = "FIN:NECT";
export const EVENT_NAME_LINE1 = "FIN:NECT Global Demoday Singapore 2026";
export const EVENT_NAME_LINE2 = "Fintech Demo Day";

export const EVENT_DATE = "Thursday, 19 November 2026";
export const EVENT_DAY_SHORT = "Thu 19 Nov";
export const EVENT_TIME = "09:00 – 12:30";
// Run with Tenity. Venue moved by Tenity from 80RR Fintech Hub SG to the
// OGBC Innovation Hub (Tammy, 6 Nov; map link from Tammy).
export const EVENT_VENUE = "OGBC Innovation Hub";
export const EVENT_ADDRESS = "PLUS, 20 Cecil Street, Singapore 049705";
export const EVENT_MAP_URL = "https://maps.app.goo.gl/rypzSxJFLBD3yDyBA";

// Public 1:1 self-booking, same model as KIMST/CMK.
export const ONE_ON_ONE_OPEN = true;

// 1:1 meetings on two afternoons.
// Thu 19 Nov: rounds start 14:30 / 15:30 / 16:30 (ops table). ponytail: 40
// min each like CMK until the length is confirmed.
// Fri 20 Nov: added at MYSC's request (20 Oct). Five rounds from 31 Oct
// (MYSC): 10:30 / 11:20 / 14:30 / 15:20 / 16:10, 40 min each. slot4–6 keep
// their ids (now the afternoon rounds), slot7–8 are the new morning rounds.
// IDs are stable references stored in bookings — change labels/times
// freely, never the ids.
// 1 Nov (Tammy): all 1:1s on one day, Friday 20 Nov. The Thursday rounds
// (slot1–3) are gone; no bookings had been made in them.
// 6 Nov (Tammy): four afternoon rounds from 13:40 (the morning is taken by
// other programme items); venue TBC (moved off the Wyndham, being sourced).
// slot7 (10:30) dropped and slot8 moved to 13:40 — no bookings in either.
export const TIMESLOTS: Timeslot[] = [
  { id: "slot8", label: "Round 1", time: "13:40 – 14:20", day: "fri" },
  { id: "slot4", label: "Round 2", time: "14:30 – 15:10", day: "fri" },
  { id: "slot5", label: "Round 3", time: "15:20 – 16:00", day: "fri" },
  { id: "slot6", label: "Round 4", time: "16:10 – 16:50", day: "fri" },
];

export interface MeetupDay {
  id: MeetupDayId;
  date: string;
  short: string;
  /** Meeting window (Thu: afternoon; Fri: morning and afternoon). */
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  /** Google Calendar `dates` value for the whole afternoon (SGT). */
  cal: string;
}

export const MEETUP_DAYS: MeetupDay[] = [
  {
    id: "fri",
    date: "Friday, 20 November 2026",
    short: "Fri 20 Nov",
    time: "13:40 – 16:50",
    // Master sheet 프로그램 일정표(11.09): Wyndham Hotel, Function Room.
    // (6 Nov it was briefly TBC.) Empty address/map would render venue only.
    venue: "Wyndham Singapore Hotel, Function Room",
    address: "5 Coleman Street, Singapore 179805",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Wyndham+Singapore+Hotel+5+Coleman+Street",
    cal: "20261120T134000/20261120T165000",
  },
];
export const meetupDay = (id: MeetupDayId): MeetupDay => MEETUP_DAYS.find((d) => d.id === id)!;
/** "Thu 19 Nov · Round 1" — rounds repeat across the two days, so always name the day. */
export const slotName = (t: Timeslot) => `${meetupDay(t.day).short} · ${t.label}`;

// The one 1:1 day (Friday 20 Nov), for older callers.
export const MEETUP_TIME = "13:40 – 16:50";
export const MEETUP_DATE = "Friday, 20 November 2026";
export const MEETUP_DAY_SHORT = "Fri 20 Nov";
export const MEETUP_VENUE = "Wyndham Singapore Hotel, Function Room";
export const MEETUP_ADDRESS = "5 Coleman Street, Singapore 179805";
export const MEETUP_MAP_URL = "https://www.google.com/maps/search/?api=1&query=Wyndham+Singapore+Hotel+5+Coleman+Street";
export const MEETUP_DATES = "Friday 20 November 2026";
export const MEETUP_DATES_SHORT = "Fri 20 Nov";

// Which of the three sessions each company is at (MYSC, 20 Oct): the
// 8 Demo Day companies, 지투시그마 and 앳원스 are at all three; 십일리터
// and 머니가드서비스 only on Friday afternoon. "demo" is informational (the
// Demo Day RSVP isn't per company); "thu"/"fri" gate the 1:1 rounds.
export type Session = "demo" | "thu" | "fri";
export const SESSION_LABELS: Record<Session, string> = {
  demo: "Demo Day, 19 Nov",
  thu: "1:1, 19 Nov",
  fri: "1:1, 20 Nov",
};
const FRIDAY_ONLY = new Set(["elevenliter", "moneyguard"]);
export function companySessions(companySlug: string): Session[] {
  // 1:1s are Friday-only for everyone since 1 Nov; "thu" no longer offered.
  return FRIDAY_ONLY.has(companySlug) ? ["fri"] : ["demo", "fri"];
}

// Kept for API compatibility with the booking engine.
export const ROUND3_COMPANY_SLUGS: string[] = [];
export function isSlotOffered(companySlug: string, timeslotId: string): boolean {
  const t = TIMESLOTS.find((x) => x.id === timeslotId);
  return Boolean(t) && companySessions(companySlug).includes(t!.day);
}

export interface ProgramBlock {
  id: "showcase" | "lunch" | "meetups";
  title: string;
  time: string;
  description: string;
}

// NOTE: ids map to RSVP columns (attend_showcase / attend_lunch /
// attend_meetups). "lunch" is the networking dinner — legacy column name.
export const PROGRAM: ProgramBlock[] = [
  {
    id: "showcase",
    title: "Pitches & VC meetings",
    time: "09:00 – 12:30",
    description: "IR pitches (5 min pitch, 5 min Q&A each), then three rounds of 20-minute VC 1:1 meetings, run with Tenity.",
  },
  {
    id: "lunch",
    title: "Networking lunch",
    time: "From 12:30",
    description: "A networking lunch with the founders, investors and local partners at The Westin Singapore (Lobby Lounge, Level 32).",
  },
  {
    id: "meetups",
    title: "1:1 Business Meetings",
    time: "Fri 20 Nov, 13:40 – 16:50",
    description: "Private meetings with the startups of your choice, on Friday afternoon, 20 November.",
  },
];

// Networking lunch after the Demo Day (master sheet 11.09: booked).
export const LUNCH_VENUE = "The Westin Singapore, Lobby Lounge (Level 32)";
export const LUNCH_ADDRESS = "12 Marina View, Asia Square Tower 2, Singapore 018961";
export const LUNCH_MAP_URL = "https://www.google.com/maps/search/?api=1&query=The+Westin+Singapore+12+Marina+View";

// Demo Day run of show (Tenity, agreed 29 Sep; ops deck 12 Oct).
export const DEMO_AGENDA: [time: string, item: string][] = [
  ["09:00 – 09:20", "Opening and introduction of the VCs / CVCs"],
  ["09:20 – 11:15", "IR pitching (5 min pitch, 5 min Q&A each)"],
  ["11:15 – 12:15", "VC 1:1 meetings (20 min × 3 rounds)"],
  ["12:15 – 12:30", "Open networking and close"],
];

// ── Legacy side-track exports (no side track on this event) ─────────
export const NULDAM_VENUE = "";
export const NULDAM_ADDRESS = "";
export const NULDAM_MAP_URL = "";
export interface NuldamTrack {
  id: "track1" | "track2";
  dateLabel: string;
  timeRange: string;
  slots: Timeslot[];
}
export const NULDAM_TRACKS: NuldamTrack[] = [];
export const NULDAM_COMPANY_SLUGS: Record<"track1" | "track2", string[]> = { track1: [], track2: [] };
export function isNuldamCompany(_slug: string): boolean {
  return false;
}

export interface SlotInfo {
  label: string;
  time: string;
  context: string;
}

const slotIndex: Record<string, SlotInfo> = {};
for (const t of TIMESLOTS) {
  slotIndex[t.id] = { label: `1:1 ${slotName(t)}`, time: t.time, context: `Business Meetings · ${meetupDay(t.day).date}` };
}

export function getSlotInfo(id: string): SlotInfo {
  return slotIndex[id] ?? { label: id, time: "", context: "" };
}
