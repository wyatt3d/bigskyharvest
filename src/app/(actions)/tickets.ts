"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitTicket(input: {
  page_url: string;
  element_selector: string | null;
  element_html: string | null;
  viewport_w: number | null;
  viewport_h: number | null;
  description: string;
}) {
  const description = input.description.trim();
  if (!description) return { ok: false, error: "Description required" };
  if (description.length > 4000) return { ok: false, error: "Description too long" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("tickets").insert({
    reporter_id: user?.id ?? null,
    reporter_email: user?.email ?? null,
    page_url: input.page_url.slice(0, 2000),
    element_selector: input.element_selector?.slice(0, 500) ?? null,
    element_html: input.element_html?.slice(0, 2000) ?? null,
    viewport_w: input.viewport_w,
    viewport_h: input.viewport_h,
    description,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
