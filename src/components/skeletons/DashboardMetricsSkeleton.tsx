import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="@container/card bg-linear-to-t from-muted/70 to-muted/30 shadow-none">
          <CardHeader>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}