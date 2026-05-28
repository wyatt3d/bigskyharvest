import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, key, { auth: { persistSession: false } });

const SEED_EMAIL = "seed@bigskyharvest.com";

let userId;
const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
const found = list.users.find((u) => u.email === SEED_EMAIL);
if (found) {
  userId = found.id;
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email: SEED_EMAIL,
    email_confirm: true,
    user_metadata: { is_seed: true },
  });
  if (error) throw error;
  userId = data.user.id;
}

await admin.from("profiles").upsert({
  id: userId,
  full_name: "Sample Farms (demo data)",
  role: "farmer",
  city: "Great Falls",
  state: "MT",
  bio: "Sample postings to show how the platform looks.",
});

await admin.from("jobs").delete().eq("farmer_id", userId);

const jobs = [
  {
    farmer_id: userId,
    title: "Combine operator — winter wheat harvest",
    description:
      "Looking for a combine operator for our 4,200 acre wheat operation east of Great Falls. Running two Case IH 8250s. You'll be in the cab from sunup to about 9 pm. Big sky, good food, real work. Willing to train someone with general ag/equipment experience — full combine experience preferred.",
    city: "Great Falls",
    state: "MT",
    start_date: "2026-07-15",
    end_date: "2026-09-15",
    wage_text: "$25/hr + OT, $30/hr in-season",
    housing_provided: true,
    meals_provided: true,
    equipment: "Case IH 8250 combine, semi trucks (no CDL needed on-farm), grain carts",
    contact_method: "in_app",
  },
  {
    farmer_id: userId,
    title: "Swather / hay crew — Bitterroot Valley",
    description:
      "Family hay operation needs 2 swather operators for the season. We put up about 1,500 acres of alfalfa and grass. Long days but you'll be home by dark most nights. Quiet valley, great cooking, mountain views.",
    city: "Hamilton",
    state: "MT",
    start_date: "2026-06-01",
    end_date: "2026-09-01",
    wage_text: "$22/hr + housing",
    housing_provided: true,
    meals_provided: false,
    equipment: "New Holland swathers, balers, stackers",
    contact_method: "in_app",
  },
  {
    farmer_id: userId,
    title: "Calving hand — Hi-Line ranch",
    description:
      "Cow/calf operation north of Havre needs an extra hand for spring calving. 2 am checks, pulling calves, tagging, doctoring. Hard work, learn fast, ranch family meals included. Good fit for someone who wants the real deal.",
    city: "Havre",
    state: "MT",
    start_date: "2026-03-01",
    end_date: "2026-05-15",
    wage_text: "$2,800/mo + room and board",
    housing_provided: true,
    meals_provided: true,
    equipment: "Horses, ATVs, squeeze chute. Riding experience a plus, not required.",
    contact_method: "in_app",
  },
  {
    farmer_id: userId,
    title: "Cattle drive crew — fall move",
    description:
      "Three-week fall cattle move from summer range to winter pasture. Roughly 600 head. We do it horseback, the way it's always been done. Pay's not great but the trip is a story you'll tell for the rest of your life.",
    city: "Big Timber",
    state: "MT",
    start_date: "2026-10-01",
    end_date: "2026-10-21",
    wage_text: "$1,200 flat + horses + meals",
    housing_provided: true,
    meals_provided: true,
    equipment: "We provide the horse. You provide a saddle if you've got one, otherwise we'll set you up.",
    contact_method: "in_app",
  },
  {
    farmer_id: userId,
    title: "General farm hand — Flathead",
    description:
      "Mixed orchard/vegetable operation north of Kalispell needs a steady hand May through October. Irrigation, equipment, harvest, packing shed. Slower-paced than a dryland wheat job, perfect for someone who wants to learn the broad strokes of a farm.",
    city: "Kalispell",
    state: "MT",
    start_date: "2026-05-01",
    end_date: "2026-10-31",
    wage_text: "$20/hr + cabin",
    housing_provided: true,
    meals_provided: false,
    equipment: "Kubota tractor, irrigation pipe, harvest crates.",
    contact_method: "in_app",
  },
];

const { error } = await admin.from("jobs").insert(jobs);
if (error) { console.error(error); process.exit(1); }
console.log(`Seeded ${jobs.length} jobs as ${SEED_EMAIL}`);
