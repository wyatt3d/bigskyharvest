import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertProfile } from "@/app/(actions)/profile";
import { US_STATES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Set up your profile</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Quick details so farmers and workers know who they&rsquo;re dealing with.
      </p>

      {error && <p className="text-sm text-destructive mt-3">{decodeURIComponent(error)}</p>}

      <form action={upsertProfile} className="mt-6 space-y-5">
        <div className="space-y-1.5">
          <Label>I&rsquo;m a... *</Label>
          <div className="grid grid-cols-2 gap-3">
            <label className="border rounded-lg p-4 cursor-pointer hover:border-foreground/40 has-checked:border-foreground has-checked:bg-secondary/30">
              <input
                type="radio"
                name="role"
                value="farmer"
                required
                defaultChecked={existing?.role === "farmer"}
                className="sr-only"
              />
              <div className="font-medium">Farmer / Rancher</div>
              <div className="text-xs text-muted-foreground mt-0.5">Posting jobs</div>
            </label>
            <label className="border rounded-lg p-4 cursor-pointer hover:border-foreground/40 has-checked:border-foreground has-checked:bg-secondary/30">
              <input
                type="radio"
                name="role"
                value="worker"
                defaultChecked={existing?.role === "worker"}
                className="sr-only"
              />
              <div className="font-medium">Seasonal worker</div>
              <div className="text-xs text-muted-foreground mt-0.5">Looking for harvest work</div>
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name *</Label>
          <Input id="full_name" name="full_name" required defaultValue={existing?.full_name ?? ""} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={existing?.phone ?? ""} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="city">City / town</Label>
            <Input id="city" name="city" defaultValue={existing?.city ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              name="state"
              defaultValue={existing?.state ?? "MT"}
              className="w-full border rounded px-3 py-2 bg-background h-9"
            >
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">A few words about you</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={existing?.bio ?? ""}
            placeholder="Farmers: what's your operation? Workers: what's your experience and what are you looking for?"
          />
        </div>

        <Button type="submit" size="lg">Save and continue</Button>
      </form>
    </div>
  );
}
