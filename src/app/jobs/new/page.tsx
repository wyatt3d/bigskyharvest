import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createJob } from "@/app/(actions)/jobs";
import { US_STATES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/jobs/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, city, state")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding?next=/jobs/new");
  if (profile.role !== "farmer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Posting requires a farmer account</h1>
        <p className="text-muted-foreground mt-2">
          Your account is set up as a worker. Reach out to support if this is wrong.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Post a harvest job</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Tell folks what you need, when, and what they&rsquo;ll get out of it.
        Be specific — gigs with housing and clear dates fill faster.
      </p>

      {error && <p className="text-sm text-destructive mb-4">{decodeURIComponent(error)}</p>}

      <form action={createJob} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Job title *</Label>
          <Input id="title" name="title" required placeholder="Combine operator — wheat harvest" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            required
            placeholder="What's the gig, what's the operation like, what does a typical day look like, and what kind of person fits in here?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="city">City / town *</Label>
            <Input id="city" name="city" required placeholder="Conrad" defaultValue={profile.city ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              name="state"
              defaultValue={profile.state ?? "MT"}
              className="w-full border rounded px-3 py-2 bg-background h-9"
            >
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="start_date">Start date</Label>
            <Input id="start_date" name="start_date" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end_date">End date</Label>
            <Input id="end_date" name="end_date" type="date" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wage_text">Pay</Label>
          <Input id="wage_text" name="wage_text" placeholder="$22-28/hr DOE · OT after 40" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipment">Equipment / experience needed</Label>
          <Textarea
            id="equipment"
            name="equipment"
            rows={3}
            placeholder="John Deere S780 combine, semi (no CDL required on-farm), 3-point hitch tractors. Willing to train the right person."
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="housing_provided" className="h-4 w-4" />
            Housing provided
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="meals_provided" className="h-4 w-4" />
            Meals provided
          </label>
        </div>

        <div className="space-y-1.5">
          <Label>Contact method</Label>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="contact_method" value="in_app" defaultChecked />
              Through BigSkyHarvest
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contact_method" value="email" />
              Email
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contact_method" value="phone" />
              Phone
            </label>
          </div>
        </div>

        <Button type="submit" size="lg">Post job</Button>
      </form>
    </div>
  );
}
