export interface Timeslot {
  id: string;
  label: string;
  time: string;
}

// ── FIN:NECT Global Singapore 2026 (Korea Fintech Support Center) ──
// Everything event-specific lives in this file, so a confirmed venue or time
// is a one-line change. Source: "[마스터파일] 핀테크지원센터_현지프로그램"
// (26_세부 일정표, read 12 Oct), the ops table and the LodestarT × MYSC ops
// meeting deck (12 Oct: Tenity run of show, 80RR venue). Programme
// 17–21 Nov during Singapore FinTech Festival week; the public day is Thu
// 19 Nov: Demo Day with Tenity in the morning, 1:1 meetings after lunch.
export const SITE_URL = "https://finnect-rsvp-2026.vercel.app";
// ponytail: host + sponsor only for now (KISED lesson); MYSC / LodestarT
// were listed as co-organisers on the 2025 page — add back if the centre wants.
export const CREDITS = "Hosted by the Korea Fintech Support Center · Sponsored by KakaoBank";

export const EVENT_NAME = "FIN:NECT Global Singapore 2026";
export const EVENT_NAME_SHORT = "FIN:NECT";
export const EVENT_NAME_LINE1 = "FIN:NECT Global Singapore 2026";
export const EVENT_NAME_LINE2 = "Fintech Demo Day";

export const EVENT_DATE = "Thursday, 19 November 2026";
export const EVENT_DAY_SHORT = "Thu 19 Nov";
export const EVENT_TIME = "09:00 – 12:30";
// Run with Tenity; contract signed, run of show agreed (ops deck, 12 Oct).
export const EVENT_VENUE = "80RR Fintech Hub SG";
export const EVENT_ADDRESS = "80 Robinson Road, #08-01, Singapore 068898";
export const EVENT_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=80+Robinson+Road+Singapore+068898";

// Public 1:1 self-booking, same model as KIMST/CMK.
export const ONE_ON_ONE_OPEN = true;

// 1:1 meetings Thu 19 Nov afternoon: rounds start 14:30 / 15:30 / 16:30
// (ops table). ponytail: 40 min each like CMK until the length is confirmed;
// how the afternoon B2B meetings are set up is still open (ops deck, 12 Oct).
// IDs are stable references stored in bookings — change labels/times
// freely, never the ids.
export const TIMESLOTS: Timeslot[] = [
  { id: "slot1", label: "Round 1", time: "14:30 – 15:10" },
  { id: "slot2", label: "Round 2", time: "15:30 – 16:10" },
  { id: "slot3", label: "Round 3", time: "16:30 – 17:10" },
];
export const MEETUP_TIME = "14:30 – 17:10";
export const MEETUP_DATE = "Thursday, 19 November 2026";
export const MEETUP_DAY_SHORT = "Thu 19 Nov";
export const MEETUP_VENUE = "Venue to be announced";
export const MEETUP_ADDRESS = "Singapore";
export const MEETUP_MAP_URL = "";

// Kept for API compatibility with the booking engine; every company offers
// every round.
export const ROUND3_COMPANY_SLUGS: string[] = [];
export function isSlotOffered(_companySlug: string, _timeslotId: string): boolean {
  return true;
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
    title: "Networking after the Demo Day",
    time: "From 12:30",
    description: "Networking with the founders, investors and local partners near the venue (details to follow).",
  },
  {
    id: "meetups",
    title: "1:1 Business Meetings",
    time: `${MEETUP_DAY_SHORT} · ${MEETUP_TIME}`,
    description: "Private meetings with the startups of your choice, the same afternoon.",
  },
];

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
  slotIndex[t.id] = { label: `1:1 ${t.label}`, time: t.time, context: `Business Meetings · ${MEETUP_DATE}` };
}

export function getSlotInfo(id: string): SlotInfo {
  return slotIndex[id] ?? { label: id, time: "", context: "" };
}
