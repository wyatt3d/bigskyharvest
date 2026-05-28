import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <Card className="hover:border-foreground/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold leading-tight truncate">{job.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {job.city}, {job.state}
              </p>
            </div>
            {job.wage_text && (
              <span className="shrink-0 text-sm font-medium">{job.wage_text}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.housing_provided && <Badge variant="secondary">Housing</Badge>}
            {job.meals_provided && <Badge variant="secondary">Meals</Badge>}
            {job.start_date && (
              <Badge variant="outline">
                Starts {new Date(job.start_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </Badge>
            )}
            {job.status !== "open" && (
              <Badge variant="destructive">{job.status}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
