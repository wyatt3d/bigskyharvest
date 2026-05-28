"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!user || !allowed.includes((user.email ?? "").toLowerCase())) {
    throw new Error("forbidden");
  }
}

export async function resolveTicket(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createAdminClient();
  await admin.from("tickets").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/tickets");
}

export async function reopenTicket(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createAdminClient();
  await admin.from("tickets").update({ status: "open", resolved_at: null }).eq("id", id);
  revalidatePath("/admin/tickets");
}
