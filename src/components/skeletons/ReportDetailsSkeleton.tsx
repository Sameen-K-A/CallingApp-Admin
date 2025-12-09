import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const ReportDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-36 mt-1" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Skeleton className="h-5 w-16" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-44 mt-1" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-24" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>

            <Separator />

            <div className="space-y-4">
              <Skeleton className="h-5 w-28" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};