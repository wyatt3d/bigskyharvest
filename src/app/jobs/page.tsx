import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/job-card";
import { US_STATES, type Job } from "@/lib/types";

export const dynamic = "force-dynamic";

type Search = { state?: string };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { state } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (state) query = query.eq("state", state.toUpperCase());

  const { data: jobs } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Harvest jobs</h1>
          <p className="text-sm text-muted-foreground">
            {jobs?.length ?? 0} open {jobs?.length === 1 ? "position" : "positions"}
            {state ? ` in ${state.toUpperCase()}` : ""}
          </p>
        </div>
        <form className="flex items-center gap-2 text-sm">
          <label htmlFor="state" className="text-muted-foreground">State:</label>
          <select
            id="state"
            name="state"
            defaultValue={state ?? ""}
            className="border rounded px-2 py-1 bg-background"
          >
            <option value="">All</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="text-muted-foreground hover:text-foreground">
            Filter
          </button>
        </form>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(jobs as Job[]).map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No open jobs yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Are you a farmer or rancher? <Link href="/jobs/new" className="underline">Post a job</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
