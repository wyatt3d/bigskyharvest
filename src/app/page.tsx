import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { label: "All", q: "", icon: "✦" },
  { label: "Wheat", q: "wheat", icon: "🌾" },
  { label: "Cattle", q: "cattle", icon: "🐂" },
  { label: "Hay", q: "hay", icon: "🌿" },
  { label: "Calving", q: "calving", icon: "🐄" },
  { label: "Orchard", q: "orchard", icon: "🍎" },
  { label: "Ranch", q: "ranch", icon: "🚜" },
];

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
      <section className="relative isolate overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950/80 -z-10" />

        <div className="mx-auto max-w-7xl px-6 pt-24 md:pt-32 pb-12 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Built in Montana · For the U.S.
            </div>
            <h1 className="mt-5 text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
              The way America hires its harvest.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/85 max-w-2xl">
              Connecting farms and ranches with seasonal workers ready to live
              and work the land. List a job in three minutes — or take a season
              you&rsquo;ll talk about for the rest of your life.
            </p>
          </div>

          {/* Frosted-glass action card */}
          <div className="mt-10 max-w-4xl">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-3 md:p-4 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                <Link
                  href="/jobs"
                  className="group flex items-center gap-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors p-4 border border-white/10"
                >
                  <div className="h-11 w-11 shrink-0 rounded-full bg-amber-400/20 backdrop-blur border border-amber-300/30 flex items-center justify-center">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60">I&rsquo;m looking for work</p>
                    <p className="text-base font-semibold">Browse {openCount ?? ""} open positions →</p>
                  </div>
                </Link>
                <Link
                  href="/jobs/new"
                  className="group flex items-center gap-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 transition-colors p-4 border border-amber-300/30"
                >
                  <div className="h-11 w-11 shrink-0 rounded-full bg-amber-950/15 border border-amber-950/20 flex items-center justify-center">
                    <span className="text-xl">🚜</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-amber-950/70">I need hands</p>
                    <p className="text-base font-semibold">Post a job — free →</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.label}
                href={c.q ? `/jobs?q=${c.q}` : "/jobs"}
                className="inline-flex items-center gap-1.5 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 text-sm transition-colors"
              >
                <span aria-hidden>{c.icon}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust strip — frosted band at bottom of hero */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 backdrop-blur-xl bg-white/10 border-t border-white/15">
            <div className="mx-auto max-w-7xl px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm text-white/90">
              <Trust k="Free" v="for workers, always" />
              <Trust k="Free" v="to post jobs" />
              <Trust k="No résumés" v="just real conversations" />
              <Trust k="MT-first" v="rolling out nationally" />
            </div>
          </div>
          <div className="h-24" />
        </div>
      </section>

      {/* FEATURED JOBS */}
      {recent && recent.length > 0 && (
        <section className="border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Open this season</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">Live the land.</h2>
                <p className="text-stone-600 mt-2">Real jobs from real farms across Montana.</p>
              </div>
              <Link href="/jobs" className="text-sm font-semibold hover:text-amber-700">
                View all {openCount ?? ""} →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(recent as Job[]).map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS — TWO COLUMN */}
      <section className="border-b border-stone-200 bg-stone-100/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <SideCard
              tag="For hosts"
              h="A full crew, without the cold calls."
              steps={[
                { t: "List the work", d: "Title, dates, pay, housing, what they'll operate. Five questions, three minutes." },
                { t: "Receive applicants", d: "Qualified workers reach out within days. With names and phone numbers." },
                { t: "Hire who fits", d: "Call the ones that match. The platform stays out of the way." },
              ]}
              cta={{ label: "Host a job", href: "/jobs/new" }}
            />
            <SideCard
              tag="For workers"
              h="Real work, real places, real seasons."
              steps={[
                { t: "Build a profile", d: "Skills, availability, experience. No résumé." },
                { t: "Browse the land", d: "Combine, hay, calving, cattle, orchard. Filter by region or season." },
                { t: "Apply, take the call", d: "One click sends your contact. Pack your truck. Earn money. Sleep well." },
              ]}
              cta={{ label: "Browse jobs", href: "/jobs" }}
              tinted
            />
          </div>
        </div>
      </section>

      {/* LABOR GAP */}
      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-5">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">The labor gap</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 max-w-md">
                The fields are ready. The hands aren&rsquo;t showing up.
              </h2>
              <p className="text-stone-600 mt-4 max-w-md">
                Western farms face the tightest labor market in a generation.
                Meanwhile, a generation of city workers would trade their inbox
                for an open cab and a thermos. We built the bridge.
              </p>
            </div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatTile n="57.5" unit="yrs" label="Average U.S. farmer age" src="USDA Census of Agriculture" />
              <StatTile n="~50%" unit="" label="of farms reporting unfilled seasonal labor" src="USDA & industry surveys" />
              <StatTile n="$3B+" unit="" label="estimated annual U.S. revenue lost to unharvested crops" src="Multiple economic studies" />
            </div>
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="border-b border-stone-200 bg-stone-100/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Our pricing</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">Free during launch. Honest forever.</h2>
              <p className="text-stone-600 mt-4 max-w-md">
                Posting and applying are free today, and free for workers always.
                If we ever charge farms, it will be a flat per-job fee announced
                60 days in advance — and only after the platform has measurably
                cut your time-to-hire.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                <CheckLi>Unlimited postings and applications</CheckLi>
                <CheckLi>No ads on listings, ever</CheckLi>
                <CheckLi>No data sales, no résumé scoring</CheckLi>
                <CheckLi>Cancel a posting in one click</CheckLi>
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-stone-200 rounded-3xl p-7 shadow-sm">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Our commitment</p>
              <div className="mt-3 space-y-6">
                <div>
                  <p className="font-semibold text-lg">To hosts</p>
                  <p className="text-stone-600 mt-1.5">
                    Post a job. If you don&rsquo;t receive three qualified applicants
                    within 14 days, our team hand-sources candidates at no cost.
                  </p>
                </div>
                <div className="border-t border-stone-200 pt-6">
                  <p className="font-semibold text-lg">To workers</p>
                  <p className="text-stone-600 mt-1.5">
                    If a farm cancels after you&rsquo;ve travelled, we&rsquo;ll cover
                    reasonable return travel or place you in a comparable open role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">Why this exists</p>
              <h2 className="text-3xl font-bold tracking-tight mt-2">
                Two groups who should know each other.
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 text-lg leading-relaxed text-stone-700">
              <p>
                A 4,000-acre wheat operation in central Montana can&rsquo;t run on
                YouTube tutorials. A 28-year-old in Atlanta won&rsquo;t keep doing
                6 a.m. Zoom standups for the next forty years.
              </p>
              <p>
                Both of these people exist. They don&rsquo;t know each other.
                <span className="text-stone-900 font-semibold"> They should.</span>
              </p>
              <p className="text-sm text-stone-500 pt-2">— Brian &amp; Wyatt, founders</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          className="object-cover opacity-30 -z-10"
        />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
            The harvest window is short.
          </h2>
          <p className="text-stone-300 mt-5 text-lg max-w-2xl mx-auto">
            Whether you&rsquo;re hiring or chasing the summer of your life, the
            first step takes three minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Link href="/jobs/new">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-full">
                Post a job
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white rounded-full">
                Find work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Trust({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-semibold">{k}</p>
      <p className="text-white/70">{v}</p>
    </div>
  );
}

function StatTile({ n, unit, label, src }: { n: string; unit?: string; label: string; src?: string }) {
  return (
    <div className="rounded-2xl bg-stone-100/60 backdrop-blur border border-stone-200 p-5">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">{n}</span>
        {unit && <span className="text-base font-medium text-stone-500">{unit}</span>}
      </div>
      <p className="text-sm font-medium text-stone-700 mt-2">{label}</p>
      {src && <p className="text-xs text-stone-500 mt-1">{src}</p>}
    </div>
  );
}

function SideCard({
  tag,
  h,
  steps,
  cta,
  tinted,
}: {
  tag: string;
  h: string;
  steps: { t: string; d: string }[];
  cta: { label: string; href: string };
  tinted?: boolean;
}) {
  const surface = tinted
    ? "bg-amber-50/60 ring-1 ring-amber-200/70 shadow-sm"
    : "bg-background ring-1 ring-stone-200 shadow-sm";
  return (
    <div className={`rounded-3xl p-7 md:p-9 ${surface}`}>
      <p className="text-xs font-semibold tracking-wider uppercase text-amber-700">{tag}</p>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2 text-stone-900">{h}</h2>
      <ol className="mt-6 space-y-5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4">
            <div className="shrink-0 h-8 w-8 rounded-full font-semibold flex items-center justify-center text-sm bg-amber-100 text-amber-900">
              {i + 1}
            </div>
            <div>
              <p className="font-semibold text-stone-900">{s.t}</p>
              <p className="text-sm mt-0.5 text-stone-600">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link href={cta.href} className="inline-block mt-7">
        <Button className="rounded-full">
          {cta.label} →
        </Button>
      </Link>
    </div>
  );
}

function CheckLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12 15.3 5.3a1 1 0 011.4 0z" clipRule="evenodd" />
      </svg>
      <span className="text-stone-700">{children}</span>
    </li>
  );
}
