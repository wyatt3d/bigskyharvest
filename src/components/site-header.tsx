import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(actions)/auth";

function WheatMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22V8" />
      <path d="M8 18c-2 0-3-2-3-4 2 0 3 2 3 4Z" />
      <path d="M16 18c2 0 3-2 3-4-2 0-3 2-3 4Z" />
      <path d="M8 13c-2 0-3-2-3-4 2 0 3 2 3 4Z" />
      <path d="M16 13c2 0 3-2 3-4-2 0-3 2-3 4Z" />
      <path d="M8 8c-2 0-3-2-3-4 2 0 3 2 3 4Z" />
      <path d="M16 8c2 0 3-2 3-4-2 0-3 2-3 4Z" />
    </svg>
  );
}

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-base">
          <WheatMark className="h-5 w-5 text-amber-600" />
          BigSkyHarvest
        </Link>
        <nav className="flex items-center gap-1 md:gap-2 text-sm">
          <Link href="/jobs" className="px-3 py-2 text-muted-foreground hover:text-foreground rounded-md">
            Jobs
          </Link>
          <Link href="/jobs/new" className="px-3 py-2 text-muted-foreground hover:text-foreground rounded-md hidden sm:inline">
            Post a job
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="px-3 py-2 text-muted-foreground hover:text-foreground rounded-md">
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
