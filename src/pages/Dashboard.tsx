import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { UserDistributionChart } from '@/components/dashboard/UserDistributionChart';
import { RechargeWithdrawalChart } from '@/components/dashboard/RechargeWithdrawalChart';
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

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 items-stretch">
        <div className="xl:col-span-3">
          <UserDistributionChart />
        </div>
        <div className="xl:col-span-4">
          <RechargeWithdrawalChart />
        </div>
      </div>
    </div>
  );
};