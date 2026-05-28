import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(actions)/auth";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          BigSkyHarvest
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
            Find work
          </Link>
          {user ? (
            <>
              <Link href="/jobs/new" className="text-muted-foreground hover:text-foreground">
                Post a job
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">Sign out</Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
