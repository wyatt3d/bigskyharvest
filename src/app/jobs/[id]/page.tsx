import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createApplication } from "@/app/(actions)/applications";
import type { Job, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ applied?: string; error?: string }>;
}) {
  const { id } = await params;
  const { applied, error } = await searchParams;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!job) notFound();
  const j = job as Job;

  const { data: farmer } = await supabase
    .from("profiles")
    .select("id, full_name, city, state")
    .eq("id", j.farmer_id)
    .maybeSingle();
  const f = farmer as Pick<Profile, "id" | "full_name" | "city" | "state"> | null;

  const { data: { user } } = await supabase.auth.getUser();

  let alreadyApplied = false;
  if (user) {
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", j.id)
      .eq("worker_id", user.id)
      .maybeSingle();
    alreadyApplied = !!existing;
  }

  const isOwner = user?.id === j.farmer_id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to jobs
      </Link>

      <div className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{j.title}</h1>
          {j.status !== "open" && <Badge variant="destructive">{j.status}</Badge>}
        </div>
        <p className="text-muted-foreground mt-1">
          {j.city}, {j.state}
          {f && <> · Posted by {f.full_name}</>}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {j.wage_text && <Badge>{j.wage_text}</Badge>}
          {j.housing_provided && <Badge variant="secondary">Housing provided</Badge>}
          {j.meals_provided && <Badge variant="secondary">Meals provided</Badge>}
          {j.start_date && (
            <Badge variant="outline">
              Start: {new Date(j.start_date).toLocaleDateString()}
            </Badge>
          )}
          {j.end_date && (
            <Badge variant="outline">
              End: {new Date(j.end_date).toLocaleDateString()}
            </Badge>
          )}
        </div>

        <div className="prose prose-sm max-w-none mt-6 whitespace-pre-wrap">
          {j.description}
        </div>

        {j.equipment && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm">Equipment / experience</h3>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{j.equipment}</p>
          </div>
        )}
      </div>

      <hr className="my-8" />

      {isOwner ? (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            This is your job posting. Manage applicants from your{" "}
            <Link href="/dashboard" className="underline">dashboard</Link>.
          </CardContent>
        </Card>
      ) : applied || alreadyApplied ? (
        <Card>
          <CardContent className="p-4">
            <p className="font-medium">Application sent.</p>
            <p className="text-sm text-muted-foreground mt-1">
              The farmer will reach out if it&rsquo;s a fit. Check your dashboard for updates.
            </p>
          </CardContent>
        </Card>
      ) : j.status !== "open" ? (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            This position is no longer accepting applications.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Apply for this job</h2>
            {error && (
              <p className="text-sm text-destructive mb-3">{decodeURIComponent(error)}</p>
            )}
            {!user ? (
              <Link href={`/login?next=/jobs/${j.id}`}>
                <Button>Sign in to apply</Button>
              </Link>
            ) : (
              <form action={createApplication} className="space-y-4">
                <input type="hidden" name="job_id" value={j.id} />
                <div className="space-y-1.5">
                  <Label htmlFor="message">Why are you a fit?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell the farmer about your experience, availability, and why this gig sounds like a good time."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="worker_phone">Phone</Label>
                    <Input id="worker_phone" name="worker_phone" type="tel" placeholder="(406) 555-0100" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="worker_email">Email</Label>
                    <Input
                      id="worker_email"
                      name="worker_email"
                      type="email"
                      defaultValue={user.email ?? ""}
                    />
                  </div>
                </div>
                <Button type="submit">Send application</Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
