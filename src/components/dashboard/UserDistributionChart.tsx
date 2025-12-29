
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserDistribution, type UserDistributionPeriod } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)"];

export function UserDistributionChart() {
  const [timePeriod, setTimePeriod] = useState<UserDistributionPeriod>("all");

  const { data, isLoading, error } = useUserDistribution(timePeriod);

  const chartData = data ? [
    { name: "Users", value: data.users },
    { name: "Telecallers", value: data.telecallers },
  ] : [];

  return (
    <Card className="flex flex-col shadow-none">
      <CardHeader className="flex items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">User Distribution</CardTitle>
          <CardDescription>Users vs Telecallers Ratio</CardDescription>
        </div>

        <Select value={timePeriod} onValueChange={(val) => setTimePeriod(val as UserDistributionPeriod)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="all">Full Count</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Skeleton className="h-[220px] w-[220px] rounded-full" />
          </div>
        ) : error ? (
          <div className="w-full flex items-center justify-center text-muted-foreground text-sm">
            Failed to load data
          </div>
        ) : data && data.users === 0 && data.telecallers === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="h-[200px] w-[200px] rounded-full border-4 border-dashed border-muted mb-4" />
            <p className="text-sm font-medium text-center mt-5">No data available</p>
            <p className="text-xs text-center">No users or telecallers registered in this period</p>
          </div>
        ) : (
          <div className="w-full min-h-[300px] relative flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                innerRadius={0}
                outerRadius={110}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{ outline: 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-popover p-2 shadow-md">
                        <div className="flex flex-col gap-0 text-center">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].name}
                          </span>
                          <span className="font-bold text-foreground">
                            {payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={0}
                content={({ payload }) => {
                  if (!payload) return null;
                  return (
                    <div className="flex w-full justify-center gap-4 text-xs">
                      {payload.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: entry.color }} />
                          <span className="text-muted-foreground font-medium">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
            </PieChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
