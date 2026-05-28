import { NextResponse } from "next/server";
import { createAdminClient, DEMO_EMAIL } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const admin = createAdminClient();

  // Find or create the demo user
  let userId: string | undefined;
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = list?.users.find((u) => u.email === DEMO_EMAIL);

  if (existing) {
    userId = existing.id;
  } else {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      email_confirm: true,
      user_metadata: { is_demo: true },
    });
    if (error || !created.user) {
      return NextResponse.redirect(`${origin}/?demo_error=${encodeURIComponent(error?.message ?? "create_failed")}`);
    }
    userId = created.user.id;
  }

  // Wipe demo state so onboarding fires fresh
  await admin.from("applications").delete().eq("worker_id", userId);
  await admin.from("jobs").delete().eq("farmer_id", userId);
  await admin.from("profiles").delete().eq("id", userId);

  // Generate a magic link and verify its hashed_token server-side.
  // This establishes the session in cookies on our domain directly,
  // bypassing the implicit-flow fragment that the action_link returns.
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: DEMO_EMAIL,
  });
  if (linkErr || !link?.properties?.hashed_token) {
    return NextResponse.redirect(`${origin}/?demo_error=${encodeURIComponent(linkErr?.message ?? "link_failed")}`);
  }

  const supabase = await createClient();
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: link.properties.hashed_token,
  });
  if (verifyErr) {
    return NextResponse.redirect(`${origin}/?demo_error=${encodeURIComponent(verifyErr.message)}`);
  }

  return NextResponse.redirect(`${origin}/onboarding`);
}
