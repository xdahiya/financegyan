"use client";

import { useMemo, memo } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type StockChartProps = {
  stockPrice: number;
  prices: (number | null)[];
  timestamp: number[];
  symbol: string;
};

// Define the chart configuration for colors and labels
const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// 1. Keep the component memoized to prevent AI stream re-renders
export const StockChart = memo(
  ({ stockPrice, prices = [], timestamp = [], symbol }: StockChartProps) => {
    
    // 2. Transform data
    const chartData = useMemo(() => {
      if (!prices.length || !timestamp.length) return [];

      const formatDate = (ts: number) =>
        new Date(ts * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

      return timestamp
        .map((ts, index) => ({
          date: formatDate(ts),
          price: prices[index] ?? undefined, // Filter out nulls later if needed
        }))
        .filter((d) => d.price !== undefined);
    }, [prices, timestamp]);

    if (!chartData.length) {
      return (
        <Card className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          No data available for {symbol}
        </Card>
      );
    }

    const startDate = chartData[0].date;
    const endDate = chartData[chartData.length - 1].date;

    // Calculate percent change for the "Trending" footer
    const firstPrice = chartData[0].price as number;
    const lastPrice = chartData[chartData.length - 1].price as number;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
    const isPositive = percentChange >= 0;

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{symbol.toUpperCase()} Stock Price</CardTitle>
              <CardDescription>
                {startDate} - {endDate}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${stockPrice?.toFixed(2) || "N/A"}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: -20, // Tweak margins to fit the card better
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                // Hide ticks on small screens if needed, or format strictly
                tickFormatter={(value) => value.slice(0, 3)} 
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
                domain={['auto', 'auto']} // Auto scale
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="price"
                type="natural" // 'natural' gives a smoother look than 'monotone'
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
                connectNulls
                // 3. CRITICAL: Disable animation to prevent recursion error during streaming
                isAnimationActive={false} 
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {isPositive ? "Trending up" : "Trending down"} by {Math.abs(percentChange).toFixed(1)}% this period
            <TrendingUp className={`h-4 w-4 ${isPositive ? "text-green-500" : "text-red-500"}`} />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total market close prices
          </div>
        </CardFooter>
      </Card>
    );
  },
  // 4. Comparison function
  (prev, next) => {
    return (
      prev.symbol === next.symbol &&
      prev.stockPrice === next.stockPrice &&
      prev.prices.length === next.prices.length
    );
  }
);

StockChart.displayName = "StockChart";