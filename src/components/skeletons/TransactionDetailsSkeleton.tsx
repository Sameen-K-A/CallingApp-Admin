import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionDetailsSkeleton = () => {
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

            <div className="grid gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
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
            {Array.from({ length: 4 }).map((_, i) => (
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
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};