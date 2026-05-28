"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/jobs/new");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "MT").trim().toUpperCase();
  const start_date = String(formData.get("start_date") ?? "") || null;
  const end_date = String(formData.get("end_date") ?? "") || null;
  const wage_text = String(formData.get("wage_text") ?? "").trim() || null;
  const housing_provided = formData.get("housing_provided") === "on";
  const meals_provided = formData.get("meals_provided") === "on";
  const equipment = String(formData.get("equipment") ?? "").trim() || null;
  const contact_method = String(formData.get("contact_method") ?? "in_app");

  if (!title || !description || !city) {
    redirect("/jobs/new?error=missing_required");
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      farmer_id: user.id,
      title,
      description,
      city,
      state,
      start_date,
      end_date,
      wage_text,
      housing_provided,
      meals_provided,
      equipment,
      contact_method,
    })
    .select("id")
    .single();

  if (error) redirect(`/jobs/new?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  redirect(`/jobs/${data.id}`);
}

export async function updateJobStatus(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["open", "filled", "closed"].includes(status)) return;

  await supabase.from("jobs").update({ status }).eq("id", id);
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  revalidatePath(`/jobs/${id}`);
}
