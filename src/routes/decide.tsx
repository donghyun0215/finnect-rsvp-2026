// One-tap Demo Day decisions from the host's notification email.
// The email links land here; nothing changes until the button is pressed
// (mail scanners open links on their own). Signed links only — see
// signDecision in booking.server.ts.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { BusyLabel } from "@/components/Spinner";
import { applyDecision, peekDecision } from "@/lib/booking.server";

type Search = { id?: string; d?: string; s?: string };

export const Route = createFileRoute("/decide")({
  validateSearch: (q: Record<string, unknown>): Search => ({
    id: typeof q.id === "string" ? q.id : undefined,
    d: typeof q.d === "string" ? q.d : undefined,
    s: typeof q.s === "string" ? q.s : undefined,
  }),
  head: () => ({ meta: [{ title: "Demo Day request" }, { name: "robots", content: "noindex" }] }),
  component: Decide,
});

type Guest = { name: string; organisation: string; jobTitle: string; status: "pending" | "approved" | "declined" };

function Decide() {
  const { id = "", d = "", s = "" } = Route.useSearch();
  const approve = d === "approved";
  const [guest, setGuest] = useState<Guest | null>(null);
  const [state, setState] = useState<"loading" | "invalid" | "ready" | "busy" | "done" | "error">("loading");
  const [note, setNote] = useState("");

  useEffect(() => {
    peekDecision({ data: { id, d, s } })
      .then((r) => {
        if (!r.ok) return setState("invalid");
        setGuest(r);
        setState("ready");
      })
      .catch(() => setState("invalid"));
  }, [id, d, s]);

  async function confirm() {
    setState("busy");
    try {
      const r = await applyDecision({ data: { id, d, s } });
      if (!r.ok) {
        setNote(r.message ?? "Couldn't save the decision.");
        setState("error");
        return;
      }
      setNote(r.emailSent ? "The guest has been emailed." : "Saved. The email to the guest didn't go out, so please let them know.");
      setGuest((g) => (g ? { ...g, status: approve ? "approved" : "declined" } : g));
      setState("done");
    } catch {
      setNote("Couldn't save the decision. Please try again.");
      setState("error");
    }
  }

  const already = guest && guest.status !== "pending" && state === "ready";
  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-navy px-4 py-4 sm:px-6">
        <Wordmark light compact />
      </header>
      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="border-t-4 border-navy bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground">Demo Day request</p>
          {state === "loading" && <p className="mt-4 text-navy">Loading…</p>}
          {state === "invalid" && <p className="mt-4 text-navy">This link isn't valid or has been changed. Please use the admin page instead.</p>}
          {guest && state !== "invalid" && (
            <>
              <h1 className="mt-2 text-2xl font-extrabold text-navy">{guest.name}</h1>
              <p className="text-sm text-muted-foreground">
                {guest.jobTitle}, {guest.organisation}
              </p>
              {already && (
                <p className="mt-5 text-sm text-navy">
                  Already <strong>{guest.status}</strong>. {approve === (guest.status === "approved") ? "Nothing to do." : "You can change it below."}
                </p>
              )}
              {(state === "ready" || state === "busy" || state === "error") && !(already && approve === (guest.status === "approved")) && (
                <button
                  type="button"
                  onClick={() => void confirm()}
                  disabled={state === "busy"}
                  className={`mt-6 w-full justify-center ${approve ? "btn-node" : "btn-node-line"} disabled:opacity-60`}
                >
                  <BusyLabel busy={state === "busy"} text={approve ? "Approving…" : "Declining…"}>
                    {approve ? "Approve and email the guest" : "Decline and email the guest"}
                  </BusyLabel>
                </button>
              )}
              {state === "done" && (
                <p className="mt-6 text-navy">
                  <strong>{approve ? "Approved." : "Declined."}</strong> {note}
                </p>
              )}
              {state === "error" && <p className="mt-3 text-sm text-destructive">{note}</p>}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
