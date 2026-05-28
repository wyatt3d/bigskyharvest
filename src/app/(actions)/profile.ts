"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export async function upsertProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "") as UserRole;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const state = String(formData.get("state") ?? "").trim().toUpperCase() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;

  if (!full_name) redirect("/onboarding?error=name_required");
  if (role !== "farmer" && role !== "worker") redirect("/onboarding?error=role_required");

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name, role, phone, city, state, bio });

  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/dashboard");
  redirect(role === "farmer" ? "/jobs/new" : "/jobs");
}
