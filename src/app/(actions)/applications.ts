"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const job_id = String(formData.get("job_id") ?? "");

  if (!user) redirect(`/login?next=/jobs/${job_id}`);
  if (!job_id) redirect("/jobs");

  const message = String(formData.get("message") ?? "").trim() || null;
  const worker_phone = String(formData.get("worker_phone") ?? "").trim() || null;
  const worker_email = String(formData.get("worker_email") ?? "").trim() || user.email || null;

  const { error } = await supabase
    .from("applications")
    .insert({ job_id, worker_id: user.id, message, worker_phone, worker_email });

  if (error) {
    if (error.code === "23505") {
      redirect(`/jobs/${job_id}?applied=1`);
    }
    redirect(`/jobs/${job_id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/jobs/${job_id}`);
  revalidatePath("/dashboard");
  redirect(`/jobs/${job_id}?applied=1`);
}

export async function updateApplicationStatus(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "viewed", "contacted", "declined"].includes(status)) return;

  await supabase.from("applications").update({ status }).eq("id", id);
  revalidatePath("/dashboard");
}
