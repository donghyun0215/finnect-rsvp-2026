// Who each startup serves : what it gives them. The colon is the brand's own
// device (FIN:NECT), so each pairing is set with it. Wording condensed from
// each company's one-pager (or IR deck where the one-pager is pending).
export const PAIRS: Record<string, [who: string, what: string]> = {
  "276holdings": ["SME suppliers", "order-to-cash trade finance"],
  devd: ["Tenants & landlords", "rent paid by card"],
  marinachain: ["Shipowners", "emissions compliance on autopilot"],
  bigtechplus: ["Banks & homeowners", "verified property collateral"],
  sionic: ["Enterprises", "no-code AI agents"],
  aizen: ["EV riders & lenders", "bankable credit from EV data"],
  canopy: ["Employees", "earned wages on demand"],
  crosshub: ["International visitors", "ID-linked travel payments"],
};

// A "who : what" pairing with the brand colon as two yellow nodes.
export function Pair({ who, what, dark = false }: { who: string; what: string; dark?: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
      <span className={dark ? "text-white/60" : "text-[#6d6d6d]"}>{who}</span>
      <span aria-hidden className="colon inline-flex flex-col gap-[3px] self-center"><i /><i /></span>
      <span className="sr-only">:</span>
      <span className={`font-semibold ${dark ? "text-white" : "text-navy"}`}>{what}</span>
    </span>
  );
}
