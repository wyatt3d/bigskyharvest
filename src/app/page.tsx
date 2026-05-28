import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    .limit(3);

  const { count: openCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  return (
    <div>
      {/* HERO — dream outcome + stakes */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Built for Montana. Open to America.
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4 max-w-4xl">
            Your wheat is ready. Your combine isn&rsquo;t.
            <span className="block text-muted-foreground mt-2">
              And your kid moved to Bozeman.
            </span>
          </h1>
          <p className="text-lg md:text-xl mt-6 max-w-3xl">
            Three thousand miles east, a 28-year-old just decided he&rsquo;d trade
            six months of his life to drive a Case IH for one summer.
            He doesn&rsquo;t know you exist. <strong>BigSkyHarvest is the tunnel between you.</strong>
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/jobs/new">
              <Button size="lg">Post a job — 3 minutes, free</Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline">
                Find harvest work {openCount ? `(${openCount} open)` : ""}
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost">Try the demo →</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            $0 to post. $0 to apply. $0 forever for both sides.
          </p>
        </div>
      </section>

      {/* THE MATH IS BAD */}
      <section className="border-b bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">Look — the math is bad.</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div>
              <p className="text-4xl font-bold">56%</p>
              <p className="text-sm text-muted-foreground mt-1">
                of US farms report they can&rsquo;t fill seasonal positions. The number is worse in MT.
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold">1 in 3</p>
              <p className="text-sm text-muted-foreground mt-1">
                family farms will not have a successor in the next decade.
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold">4.2M+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Americans have &ldquo;live on a working farm for a summer&rdquo; on their bucket list.
                Most don&rsquo;t know how to start.
              </p>
            </div>
          </div>
          <p className="mt-8 text-lg max-w-3xl">
            <strong>The pipe between these two groups doesn&rsquo;t exist.</strong>{" "}
            Indeed is built for cubicle jobs. Craigslist is a dumpster fire.
            Word of mouth has run out of mouths. So we built the pipe.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — FARMER */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            For farmers &amp; ranchers
          </p>
          <h2 className="text-3xl font-bold tracking-tight mt-2">
            Here&rsquo;s exactly what happens when you post a job.
          </h2>
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Step n="1" t="You post (3 min)" d="Title, pay, dates, housing, what they'll drive. Five questions. We wrote them. You answer." />
            <Step n="2" t="They find you (24-72 hr)" d="Real applicants show up in your dashboard. With phone numbers. Not bots." />
            <Step n="3" t="One phone call" d="You call the best one. You like them or you don't. If yes, you hire. If no, the next one's already there." />
            <Step n="4" t="Your harvest happens" d="On time. With a crew. Without you making 200 cold calls in May." />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/jobs/new">
              <Button size="lg">Post a job →</Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">Watch the flow on a demo account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — WORKER */}
      <section className="border-b bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            For seasonal workers
          </p>
          <h2 className="text-3xl font-bold tracking-tight mt-2">
            You&rsquo;ve told the story at dinner parties for years. Now go live it.
          </h2>
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Step n="1" t="Tell us who you are" d="What you've driven. What you'll learn. When you're free. Two minutes." />
            <Step n="2" t="Browse real gigs" d="Combine operators. Swathers. Calving hands. Cattle drives. With pay, housing, dates." />
            <Step n="3" t="Apply, one click" d="The farmer gets your phone number and a paragraph from you. No résumé. No bullshit." />
            <Step n="4" t="Take the call" d="Pack your truck. Spend the best summer of your life. Earn money. Eat well. Sleep hard." />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/jobs">
              <Button size="lg">Find a job →</Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">Try the demo →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* THE DEAL */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">What it costs.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-4xl font-bold">$0</p>
                <p className="font-medium mt-2">to post a job.</p>
                <p className="text-sm text-muted-foreground mt-1">Unlimited. Forever.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-4xl font-bold">$0</p>
                <p className="font-medium mt-2">to apply for a job.</p>
                <p className="text-sm text-muted-foreground mt-1">Unlimited. Forever.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-4xl font-bold">$0</p>
                <p className="font-medium mt-2">forever, until we&rsquo;ve earned the right to charge.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No ads. No selling your data. If we ever charge, it&rsquo;ll be a flat fee — and only after we&rsquo;ve saved you at least 10× that.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="border-b bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight">Our promises.</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="p-6">
                <p className="font-semibold">To farmers:</p>
                <p className="mt-2">
                  Post a job. If you don&rsquo;t get at least <strong>3 serious applicants in 14 days</strong>,
                  we&rsquo;ll personally hand-source candidates for you. Yes, we mean it.
                  Email <a className="underline" href="mailto:brian@bigskyharvest.com">brian@bigskyharvest.com</a>{" "}
                  and tell us your job ID.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="font-semibold">To workers:</p>
                <p className="mt-2">
                  Sign up free. Apply free. If a farmer ghosts you after you&rsquo;ve travelled,
                  tell us. We&rsquo;ll get the farm owner on the phone — or cover your gas money home.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      {recent && recent.length > 0 && (
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-3xl font-bold tracking-tight">Open right now.</h2>
              <Link href="/jobs" className="text-sm font-medium hover:underline">
                See all →
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {(recent as Job[]).map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        </section>
      )}

      {/* FOUNDER NOTE */}
      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Why this exists
          </p>
          <p className="text-xl mt-3 leading-relaxed">
            A 4,000-acre wheat operation can&rsquo;t run on YouTube tutorials.
            A 26-year-old marketing manager in Atlanta can&rsquo;t keep doing 6am Zoom standups
            for the next 40 years.
          </p>
          <p className="text-xl mt-4 leading-relaxed">
            Both of these people exist. They don&rsquo;t know each other.
            <strong> They should.</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-6">— Brian &amp; Wyatt</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            The harvest doesn&rsquo;t wait.
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every day you don&rsquo;t list the job is a day you&rsquo;re still looking.
            Every day you don&rsquo;t list yourself is a day the summer slips by.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link href="/jobs/new"><Button size="lg">Post a job</Button></Link>
            <Link href="/jobs"><Button size="lg" variant="outline">Find work</Button></Link>
            <Link href="/demo"><Button size="lg" variant="ghost">Try the demo →</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-muted-foreground/60">{n}</div>
      <p className="font-semibold mt-1">{t}</p>
      <p className="text-sm text-muted-foreground mt-1">{d}</p>
    </div>
  );
}
