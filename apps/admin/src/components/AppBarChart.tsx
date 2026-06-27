"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-1)",
  },
  successful: {
    label: "Successful",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type TimeRange = "week" | "month" | "last12Months" | "allTime";

interface AnalyticsData {
  week: { day: string; total: number; successful: number }[];
  month: { date: string; total: number; successful: number }[];
  last12Months: { month: string; total: number; successful: number }[];
  allTime: { month: string; total: number; successful: number }[];
}

const AppBarChart = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("last12Months");
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const orderServiceUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL;
        
        if (!orderServiceUrl) {
          console.warn("NEXT_PUBLIC_ORDER_SERVICE_URL is not set");
          return;
        }

        const baseUrl = orderServiceUrl.endsWith("/") ? orderServiceUrl.slice(0, -1) : orderServiceUrl;
        const res = await fetch(`${baseUrl}/orders/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          console.error("Failed to fetch analytics status:", res.status);
        }
      } catch (error) {
        console.error("Error fetching order analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [getToken]);

  const currentChartData = data ? data[timeRange] : [];
  const xAxisKey = timeRange === "week" ? "day" : timeRange === "month" ? "date" : "month";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Total Revenue</h1>
        <Select
          value={timeRange}
          onValueChange={(val) => setTimeRange(val as TimeRange)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="last12Months">Last 12 Months</SelectItem>
            <SelectItem value="allTime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-[250px] w-full" />
        </div>
      ) : currentChartData.length === 0 ? (
        <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
          No analytics data available
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={currentChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => (value.length > 3 ? value.slice(0, 3) : value)}
            />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            <Bar dataKey="successful" fill="var(--color-successful)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AppBarChart;
