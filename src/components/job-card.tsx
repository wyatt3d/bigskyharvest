import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/types";

type Category = {
  key: string;
  label: string;
  gradient: string;
  icon: string;
};

const CATEGORIES: Category[] = [
  { key: "wheat",   label: "Wheat / Grain",  gradient: "from-amber-300 via-amber-500 to-amber-700", icon: "🌾" },
  { key: "cattle",  label: "Cattle / Ranch", gradient: "from-stone-400 via-stone-600 to-stone-800",  icon: "🐂" },
  { key: "hay",     label: "Hay / Forage",   gradient: "from-lime-300 via-lime-500 to-lime-700",     icon: "🌿" },
  { key: "calving", label: "Calving",        gradient: "from-rose-300 via-rose-500 to-rose-700",     icon: "🐄" },
  { key: "orchard", label: "Orchard",        gradient: "from-red-300 via-red-500 to-red-700",        icon: "🍎" },
  { key: "general", label: "Farm hand",      gradient: "from-emerald-300 via-emerald-500 to-emerald-700", icon: "🚜" },
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
        <div className={`relative aspect-[5/3] bg-gradient-to-br ${cat.gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3 backdrop-blur-md bg-white/20 border border-white/30 text-white text-xs font-medium tracking-wide uppercase px-2.5 py-1 rounded-full">
            {cat.label}
          </div>
          <div className="absolute bottom-3 right-3 text-5xl drop-shadow-lg" aria-hidden>
            {cat.icon}
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
