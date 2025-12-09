import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TelecallerDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-px w-full" />
              <div className="space-y-4">
                <div className="flex justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-32" /></div>
                <div className="flex justify-between"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-28" /></div>
                <div className="flex justify-between"><Skeleton className="h-5 w-32" /><Skeleton className="h-5 w-36" /></div>
                <div className="flex justify-between"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-28" /></div>
                <div className="flex justify-between"><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-24" /></div>
                <div className="flex justify-between"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-32" /></div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};