import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/types";

type Category = { key: string; label: string; icon: string };

const CATEGORIES: Category[] = [
  { key: "wheat",   label: "Wheat / Grain",  icon: "🌾" },
  { key: "cattle",  label: "Cattle / Ranch", icon: "🐂" },
  { key: "hay",     label: "Hay / Forage",   icon: "🌿" },
  { key: "calving", label: "Calving",        icon: "🐄" },
  { key: "orchard", label: "Orchard",        icon: "🍎" },
  { key: "general", label: "Farm hand",      icon: "🚜" },
];

export function categoryFor(job: Pick<Job, "title" | "description" | "equipment">): Category {
  const t = `${job.title} ${job.description ?? ""} ${job.equipment ?? ""}`.toLowerCase();
  if (/(combine|wheat|grain|barley|harvest)/.test(t)) return CATEGORIES[0];
  if (/(cattle|ranch|cattle drive|cowboy|horse)/.test(t)) return CATEGORIES[1];
  if (/(hay|swather|baler|forage|alfalfa)/.test(t)) return CATEGORIES[2];
  if (/(calv|cow.calf|cow\/calf)/.test(t)) return CATEGORIES[3];
  if (/(orchard|apple|cherry|fruit)/.test(t)) return CATEGORIES[4];
  return CATEGORIES[5];
}

function fmtDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  if (end) return `Until ${fmt(end!)}`;
  return null;
}

export function JobCard({ job }: { job: Job }) {
  const cat = categoryFor(job);
  const dateRange = fmtDateRange(job.start_date, job.end_date);

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl bg-background ring-1 ring-stone-200 hover:ring-stone-300 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="relative aspect-[5/3] bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl drop-shadow-sm select-none" aria-hidden>{cat.icon}</span>
          </div>
          <div className="absolute top-3 left-3 bg-white/85 backdrop-blur text-stone-700 text-xs font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border border-stone-200/60 shadow-sm">
            {cat.label}
          </div>
          {job.status !== "open" && (
            <div className="absolute top-3 right-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
              {job.status}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
              {job.title}
            </h3>
            {job.wage_text && (
              <span className="shrink-0 text-sm font-semibold text-stone-900">{job.wage_text.split(/[+·]/)[0].trim()}</span>
            )}
          </div>
          <p className="text-sm text-stone-500 mt-0.5">
            {job.city}, {job.state}
            {dateRange && <> · {dateRange}</>}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.housing_provided && <Badge variant="secondary" className="rounded-full">Housing</Badge>}
            {job.meals_provided && <Badge variant="secondary" className="rounded-full">Meals</Badge>}
          </div>
        </div>
      </article>
    </Link>
  );
}
