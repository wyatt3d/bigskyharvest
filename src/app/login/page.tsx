import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink } from "@/app/(actions)/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; sent?: string; email?: string; error?: string }>;
}) {
  const { next, sent, email, error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Sign in to BigSkyHarvest</h1>
      <p className="text-sm text-muted-foreground mt-1">
        We&rsquo;ll send you a link. No passwords.
      </p>

      {sent ? (
        <div className="mt-6 border rounded-lg p-4 bg-secondary/40">
          <p className="font-medium">Check your inbox.</p>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
          </p>
        </div>
      ) : (
        <form action={sendMagicLink} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? "/onboarding"} />
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoFocus placeholder="you@example.com" />
          </div>
          {error && <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>}
          <Button type="submit" className="w-full">Send sign-in link</Button>
        </form>
      )}
    </div>
  );
}
