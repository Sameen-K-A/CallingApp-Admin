import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRechargeWithdrawalTrends, type TimePeriod } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

export function RechargeWithdrawalChart() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("last7days");
  const { data, isLoading, error } = useRechargeWithdrawalTrends(timePeriod);

  const chartData = data?.trends || [];

  return (
    <Card className="flex flex-col shadow-none h-full">
      <CardHeader className="flex items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Recharge & Withdrawal</CardTitle>
          <CardDescription>Transaction trends over time</CardDescription>
        </div>

        <Select value={timePeriod} onValueChange={(val) => setTimePeriod(val as TimePeriod)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last24hours">Last 24 hours</SelectItem>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full rounded-md" />
          </div>
        ) : error ? (
          <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            Failed to load chart data
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <div className="h-[200px] w-[200px] rounded-full border-4 border-dashed border-muted mb-4" />
            <p className="text-sm font-medium text-center mt-5">No transaction data</p>
            <p className="text-xs text-center">No recharges or withdrawals in this period</p>
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={timePeriod === "last30days" ? 4 : timePeriod === "last24hours" ? 3 : 0}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  className="text-muted-foreground"
                  width={45}
                />
                <Tooltip
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '5 5' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-popover p-3 shadow-md">
                          <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                              <span className="text-xs text-muted-foreground">Recharge:</span>
                              <span className="text-sm font-semibold text-green-600">
                                ₹{payload[0]?.value?.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                              <span className="text-xs text-muted-foreground">Withdrawal:</span>
                              <span className="text-sm font-semibold text-red-600">
                                ₹{payload[1]?.value?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  content={() => (
                    <div className="flex w-full justify-center gap-6 text-xs mt-5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        <span className="text-muted-foreground font-medium">Recharge</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <span className="text-muted-foreground font-medium">Withdrawal</span>
                      </div>
                    </div>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="recharge"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="withdrawal"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
