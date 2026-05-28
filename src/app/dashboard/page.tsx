import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateApplicationStatus } from "@/app/(actions)/applications";
import { updateJobStatus } from "@/app/(actions)/jobs";
import type { Application, Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");

  if (profile.role === "farmer") {
    return <FarmerDashboard userId={user.id} />;
  }
  return <WorkerDashboard userId={user.id} />;
}

async function FarmerDashboard({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("farmer_id", userId)
    .order("created_at", { ascending: false });

  const jobList = (jobs ?? []) as Job[];
  const jobIds = jobList.map((j) => j.id);

  const { data: apps } = jobIds.length
    ? await supabase
        .from("applications")
        .select("*")
        .in("job_id", jobIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const appList = (apps ?? []) as Application[];
  const appsByJob = new Map<string, Application[]>();
  for (const a of appList) {
    const list = appsByJob.get(a.job_id) ?? [];
    list.push(a);
    appsByJob.set(a.job_id, list);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Your jobs &amp; applicants</h1>
          <p className="text-sm text-muted-foreground">{jobList.length} job{jobList.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/jobs/new">
          <Button>Post a new job</Button>
        </Link>
      </div>

      {jobList.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground">No jobs posted yet.</p>
          <Link href="/jobs/new" className="text-sm underline mt-2 inline-block">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {jobList.map((j) => {
            const jobApps = appsByJob.get(j.id) ?? [];
            return (
              <Card key={j.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link href={`/jobs/${j.id}`} className="font-semibold hover:underline">
                        {j.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {j.city}, {j.state} · {jobApps.length} applicant{jobApps.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={j.status === "open" ? "default" : "secondary"}>{j.status}</Badge>
                      {j.status === "open" && (
                        <form action={updateJobStatus}>
                          <input type="hidden" name="id" value={j.id} />
                          <input type="hidden" name="status" value="filled" />
                          <Button variant="outline" size="sm" type="submit">Mark filled</Button>
                        </form>
                      )}
                    </div>
                  </div>

                  {jobApps.length > 0 && (
                    <div className="mt-4 divide-y border-t pt-2">
                      {jobApps.map((a) => (
                        <ApplicantRow key={a.id} app={a} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function ApplicantRow({ app }: { app: Application }) {
  const supabase = await createClient();
  const { data: worker } = await supabase
    .from("profiles")
    .select("full_name, city, state, bio")
    .eq("id", app.worker_id)
    .maybeSingle();

  return (
    <div className="py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">{worker?.full_name ?? "Worker"}</p>
          <p className="text-xs text-muted-foreground">
            {worker?.city && worker?.state ? `${worker.city}, ${worker.state} · ` : ""}
            Applied {new Date(app.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{app.status}</Badge>
          {app.status === "new" && (
            <form action={updateApplicationStatus}>
              <input type="hidden" name="id" value={app.id} />
              <input type="hidden" name="status" value="contacted" />
              <Button variant="ghost" size="sm" type="submit">Mark contacted</Button>
            </form>
          )}
        </div>
      </div>
      {app.message && (
        <p className="text-sm mt-2 whitespace-pre-wrap">{app.message}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {app.worker_phone && <>📞 {app.worker_phone} </>}
        {app.worker_email && <>✉ {app.worker_email}</>}
      </p>
    </div>
  );
}

async function WorkerDashboard({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data: apps } = await supabase
    .from("applications")
    .select("*")
    .eq("worker_id", userId)
    .order("created_at", { ascending: false });

  const appList = (apps ?? []) as Application[];
  const jobIds = appList.map((a) => a.job_id);
  const { data: jobs } = jobIds.length
    ? await supabase.from("jobs").select("*").in("id", jobIds)
    : { data: [] };
  const jobById = new Map<string, Job>();
  for (const j of (jobs ?? []) as Job[]) jobById.set(j.id, j);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your applications</h1>
          <p className="text-sm text-muted-foreground">{appList.length} sent</p>
        </div>
        <Link href="/jobs">
          <Button variant="outline">Browse jobs</Button>
        </Link>
      </div>

      {appList.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground">You haven&rsquo;t applied to anything yet.</p>
          <Link href="/jobs" className="text-sm underline mt-2 inline-block">
            Find harvest work
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appList.map((a) => {
            const j = jobById.get(a.job_id);
            return (
              <Card key={a.id}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div>
                    {j ? (
                      <Link href={`/jobs/${j.id}`} className="font-semibold hover:underline">
                        {j.title}
                      </Link>
                    ) : (
                      <span className="font-semibold">Job removed</span>
                    )}
                    {j && (
                      <p className="text-sm text-muted-foreground">{j.city}, {j.state}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Sent {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{a.status}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
