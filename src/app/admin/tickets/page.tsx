import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveTicket, reopenTicket } from "@/app/(actions)/admin-tickets";

export const dynamic = "force-dynamic";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default async function TicketsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "open" } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const allowed = adminEmails();
  if (!user || !allowed.includes((user.email ?? "").toLowerCase())) {
    notFound();
  }

  // Use admin client so the page sees all tickets (RLS would otherwise hide them)
  const admin = createAdminClient();
  const { data: tickets } = await admin
    .from("tickets")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Trouble tickets</h1>
          <p className="text-sm text-muted-foreground">
            {tickets?.length ?? 0} {status}
          </p>
        </div>
        <div className="flex gap-1 text-sm">
          {(["open", "needs_review", "resolved"] as const).map((s) => (
            <a
              key={s}
              href={`?status=${s}`}
              className={`px-3 py-1.5 rounded border ${status === s ? "bg-foreground text-background" : "hover:bg-secondary"}`}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {tickets && tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium whitespace-pre-wrap">{t.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="font-mono">{t.page_url}</span> ·{" "}
                      {new Date(t.created_at).toLocaleString()} ·{" "}
                      {t.reporter_email ?? "anon"}
                      {t.viewport_w && t.viewport_h && <> · {t.viewport_w}×{t.viewport_h}</>}
                    </p>
                    {t.element_selector && (
                      <pre className="text-xs bg-secondary/50 rounded p-2 mt-2 overflow-x-auto font-mono">
                        {t.element_selector}
                      </pre>
                    )}
                    {t.element_html && (
                      <details className="text-xs mt-1">
                        <summary className="cursor-pointer text-muted-foreground">Element HTML</summary>
                        <pre className="bg-secondary/50 rounded p-2 mt-1 overflow-x-auto font-mono whitespace-pre-wrap">{t.element_html}</pre>
                      </details>
                    )}
                    {t.resolved_note && (
                      <div className="mt-3 text-xs rounded-md border border-amber-200 bg-amber-50/70 text-amber-900 px-2.5 py-1.5">
                        <span className="font-semibold">Bot:</span> {t.resolved_note}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col gap-2 items-end">
                    <Badge variant={t.status === "open" ? "default" : t.status === "needs_review" ? "destructive" : "secondary"}>{t.status}</Badge>
                    {t.status === "open" ? (
                      <form action={resolveTicket}>
                        <input type="hidden" name="id" value={t.id} />
                        <Button size="sm" variant="outline" type="submit">Mark resolved</Button>
                      </form>
                    ) : (
                      <form action={reopenTicket}>
                        <input type="hidden" name="id" value={t.id} />
                        <Button size="sm" variant="ghost" type="submit">Reopen</Button>
                      </form>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground">
          No {status} tickets.
        </div>
      )}
    </div>
  );
}
