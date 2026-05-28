import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_EMAIL } from "@/lib/supabase/admin";

export async function DemoBanner() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== DEMO_EMAIL) return null;

  return (
    <div className="bg-amber-500 text-amber-950 text-sm">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <p>
          <strong>Demo mode.</strong> You&rsquo;re using a shared demo account.
          Anything you create may be wiped when the next visitor tries the demo.
        </p>
        <Link href="/demo" className="underline whitespace-nowrap">
          Reset demo
        </Link>
      </div>
    </div>
  );
}
