import { TrendingUp, Dot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { IDashboardStats } from "@/types/general";
import { DashboardMetricsSkeleton } from "../skeletons/DashboardMetricsSkeleton";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import type { OnlineCountsPayload } from "@/types/socket";
import { socket } from "@/lib/socket";

interface DashboardMetricsProps {
  stats: IDashboardStats | null;
  isLoading: boolean;
}

// Helper function to format minutes to "Xh Ym"
const formatDuration = (minutes: number): string => {
  const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
  return `${duration.hours || 0}h ${duration.minutes || 0}m`;
};

// Helper function to format seconds to "Xm Ys"
const formatSeconds = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
};

export function DashboardMetrics({ stats, isLoading }: DashboardMetricsProps) {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [onlineTelecallers, setOnlineTelecallers] = useState<number>(0);

  useEffect(() => {
    const handlePresenceCounts = (data: OnlineCountsPayload) => {
      setOnlineUsers(data.onlineUsers);
      setOnlineTelecallers(data.onlineTelecallers);
    };

    socket.on('presence:counts', handlePresenceCounts);
    socket.emit('presence:request-counts');

    return () => {
      socket.off('presence:counts', handlePresenceCounts);
    };
  }, []);

  if (isLoading) {
    return <DashboardMetricsSkeleton />;
  };

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Revenue Card */}
      <Card className="@container/card bg-linear-to-t from-muted/70 to-transparent">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-primary @[250px]/card:text-3xl">
            ₹{stats ? stats.revenue.platformProfit.toLocaleString('en-IN') : 0}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Platform earnings increased <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground space-y-0.5 text-xs">
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>Recharges: ₹{stats ? stats.revenue.totalRecharges.toLocaleString('en-IN') : 0}</span>
            </div>
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>Withdrawals: ₹{stats ? stats.revenue.totalWithdrawals.toLocaleString('en-IN') : 0}</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Users Card */}
      <Card className="@container/card bg-linear-to-t from-muted/70 to-transparent">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-primary @[250px]/card:text-3xl">
            {stats ? stats.users.total.toLocaleString('en-IN') : 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1" />
              {onlineUsers} - Online
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing user base <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground space-y-0.5 text-xs">
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>{stats ? stats.users.newThisMonth : 0} new users registered this month</span>
            </div>
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>{stats ? stats.users.incompleteProfiles : 0} incomplete profile users</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Telecallers Card */}
      <Card className="@container/card bg-linear-to-t from-muted/70 to-transparent">
        <CardHeader>
          <CardDescription>Total Telecallers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-primary @[250px]/card:text-3xl">
            {stats ? stats.telecallers.total : 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1" />
              {onlineTelecallers} - Online
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active telecaller network <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground space-y-0.5 text-xs">
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>{stats ? stats.telecallers.approved : 0} Approved</span>
            </div>
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>{stats ? stats.telecallers.pending : 0} Pending</span>
            </div>
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>{stats ? stats.telecallers.rejected : 0} Rejected</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Calls Card */}
      <Card className="@container/card bg-linear-to-t from-muted/70 to-transparent">
        <CardHeader>
          <CardDescription>Total Calls</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-primary @[250px]/card:text-3xl">
            {stats ? stats.calls.total.toLocaleString('en-IN') : 0}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Call activity trending up <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground space-y-0.5 text-xs">
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>{formatDuration(stats ? stats.calls.totalDurationMinutes : 0)} total duration</span>
            </div>
            <div className="flex items-center">
              <Dot className="size-4 shrink-0" />
              <span>Avg {formatSeconds(stats ? stats.calls.averageDurationSeconds : 0)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}