import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: recent } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(6);

  const { count: openCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  return (
    <div>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
          alt="Wheat field at sunset"
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 -z-10" />
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Built in Montana · Open to the U.S.
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-5 max-w-3xl text-balance">
            The hiring platform for American agriculture.
          </h1>
          <p className="text-lg md:text-xl mt-5 max-w-2xl text-white/85">
            BigSkyHarvest connects farms and ranches with seasonal workers ready
            to live and work the land. Post a job in three minutes — or browse{" "}
            {openCount ? <span className="font-semibold text-amber-300">{openCount} open positions</span> : "open positions"} across Montana.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/jobs/new">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-amber-950">Post a job — free</Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                Find harvest work
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Try the demo →
              </Button>
            </Link>
          </div>
          <p className="text-xs text-white/60 mt-4">
            Free for farmers. Free for workers. No ads, no résumés.
          </p>
        </div>
      </section>

      {/* THE LABOR GAP */}
      <section className="border-b bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">The labor gap</p>
              <h2 className="text-3xl font-bold tracking-tight mt-2">
                American agriculture is short on hands.
              </h2>
              <p className="text-muted-foreground mt-4">
                The seasonal labor shortage isn&rsquo;t a soft trend. It&rsquo;s the
                single biggest constraint on Western U.S. farms today —
                and growing every harvest.
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat n="57.5" unit="years" label="Average age of the U.S. farmer" sub="USDA Census of Agriculture" />
              <Stat n="~50%" unit="" label="of U.S. farms report unfilled seasonal labor" sub="USDA & industry surveys" />
              <Stat n="$3B+" unit="" label="estimated annual revenue lost to unharvested crops" sub="Multiple ag economic studies" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — TWO COLUMN */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">For farmers &amp; ranchers</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
                A full crew, without the cold calls.
              </h2>
              <ol className="mt-6 space-y-5">
                <StepRow n="1" t="Describe the work" d="Title, dates, pay, housing, what they'll operate. We wrote the questions. You answer five." />
                <StepRow n="2" t="Reach the right candidates" d="Your listing surfaces to workers actively looking for harvest, ranch, and seasonal ag roles." />
                <StepRow n="3" t="Interview and hire" d="Applicants come through with phone, email, and a short note. Call the ones that fit." />
              </ol>
              <Link href="/jobs/new" className="inline-block mt-7">
                <Button>Post a job</Button>
              </Link>
            </div>

            <div className="md:border-l md:pl-10">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">For seasonal workers</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
                Real work, real places, real seasons.
              </h2>
              <ol className="mt-6 space-y-5">
                <StepRow n="1" t="Build a quick profile" d="Skills, availability, equipment experience. Two minutes. No résumé." />
                <StepRow n="2" t="Browse open positions" d="Combine operators, swathers, calving hands, ranch hands, cattle-drive crews." />
                <StepRow n="3" t="Apply directly" d="One click sends your contact and a short pitch to the farmer. Take the call." />
              </ol>
              <Link href="/jobs" className="inline-block mt-7">
                <Button variant="outline">Browse jobs</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      {recent && recent.length > 0 && (
        <section className="border-b bg-stone-50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Currently hiring</p>
                <h2 className="text-3xl font-bold tracking-tight mt-2">Open positions</h2>
              </div>
              <Link href="/jobs" className="text-sm font-medium hover:underline">
                View all {openCount ?? ""} →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(recent as Job[]).map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        </section>
      )}

      {/* PRICING + GUARANTEE */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Pricing</p>
              <h2 className="text-3xl font-bold tracking-tight mt-2">Free during launch.</h2>
              <p className="text-muted-foreground mt-4 max-w-md">
                Posting a job is free. Applying for a job is free. We&rsquo;ll never
                charge workers. If we charge farmers in the future, it will
                be a flat per-job fee — announced 60 days in advance, capped,
                and only after the platform has measurably reduced your time-to-hire.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <CheckLi>Unlimited job postings</CheckLi>
                <CheckLi>Unlimited applications</CheckLi>
                <CheckLi>No ads, no data sales</CheckLi>
                <CheckLi>No résumés, no scoring algorithms</CheckLi>
              </ul>
            </div>

            <div className="border rounded-lg p-6 bg-stone-50">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Our commitment</p>
              <div className="mt-3 space-y-5">
                <div>
                  <p className="font-semibold">To farmers</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Post a job. If you don&rsquo;t receive at least three qualified
                    applicants within 14 days, our team will hand-source
                    candidates for you at no cost.
                  </p>
                </div>
                <div className="border-t pt-5">
                  <p className="font-semibold">To workers</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    If a farmer cancels on you after you&rsquo;ve traveled, we&rsquo;ll
                    cover reasonable return travel or place you in a comparable
                    open role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="border-b bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Why this exists</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
                Two groups who should know each other.
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 text-lg leading-relaxed">
              <p>
                A 4,000-acre wheat operation in central Montana can&rsquo;t run on
                YouTube tutorials. A 28-year-old in Atlanta won&rsquo;t keep doing
                6 a.m. Zoom standups for the next forty years.
              </p>
              <p>
                Both of these people exist. They don&rsquo;t know each other.{" "}
                <span className="font-semibold">They should.</span>
              </p>
              <p className="text-sm text-muted-foreground pt-2">— Brian &amp; Wyatt, founders</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              The harvest window is short.
            </h2>
            <p className="text-stone-300 mt-4 text-lg max-w-md">
              Whether you&rsquo;re hiring or looking for the summer of your life,
              the first step takes three minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/jobs/new">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-amber-950">Post a job</Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                Find work
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Try the demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, unit, label, sub }: { n: string; unit?: string; label: string; sub?: string }) {
  return (
    <div className="border bg-background rounded-lg p-5">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl md:text-5xl font-bold tracking-tight">{n}</span>
        {unit && <span className="text-lg font-medium text-muted-foreground">{unit}</span>}
      </div>
      <p className="text-sm font-medium mt-2">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function StepRow({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="flex gap-4">
      <div className="shrink-0 h-8 w-8 rounded-full bg-amber-100 text-amber-900 font-semibold flex items-center justify-center text-sm">
        {n}
      </div>
      <div>
        <p className="font-semibold">{t}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{d}</p>
      </div>
    </li>
  );
}

function CheckLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12 15.3 5.3a1 1 0 011.4 0z" clipRule="evenodd" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
