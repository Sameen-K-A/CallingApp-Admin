import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { UserDistributionChart } from '@/components/dashboard/UserDistributionChart';
import { useDashboardStats } from '@/hooks/useApi';
import useErrorHandler from '@/hooks/useErrorHandler';

export default function Dashboard() {
  const { handleError } = useErrorHandler();
  const { data: stats, isLoading: isStatsLoading, error: isStatsError } = useDashboardStats();

  if (isStatsError) {
    handleError(isStatsError, 'Failed to load dashboard statistics');
  };

  return (
    <div className="space-y-6 @container/main">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform's performance and activity
        </p>
      </div>

      <DashboardMetrics
        stats={stats || null}
        isLoading={isStatsLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <UserDistributionChart />
        </div>
      </div>
    </div>
  );
};