import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
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
    </div>
  );
};