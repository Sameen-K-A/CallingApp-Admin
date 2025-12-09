import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserDetailsSkeleton = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* User Info Card - Row 1 */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-px w-full" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Management Card - Row 2 */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/40 rounded-lg p-3.5 border border-border space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-40" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complaints Card - Row 3 */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3 border-b last:border-b-0">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-32" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};