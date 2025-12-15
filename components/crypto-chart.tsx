"use client";

import { useMemo, memo } from "react";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

// Define props matching the tool output
export type CryptoChartProps = {
  symbol: string;
  prices: (number | null)[];
  timestamp: number[];
  currentPrice: number;
  currency?: string;
  rangeUsed?: string;
  error?: string;
};

// Shadcn chart configuration - using an "yellow" theme for crypto
const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-2))", // Usually a purple/yellow in standard shadcn themes
  },
} satisfies ChartConfig;

// 1. WRAP IN MEMO: Critical for AI streaming performance
export const CryptoChart = memo(
  ({ symbol, prices = [], timestamp = [], currentPrice, currency = "USD", error }: CryptoChartProps) => {

        // 2. Transform data efficiently with useMemo
    const chartData = useMemo(() => {
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: timestamp.length > 100 ? undefined : 'numeric' // Show hours for shorter ranges
      });

      return timestamp
        .map((ts, index) => ({
          date: dateFormatter.format(new Date(ts * 1000)),
          // Ensure we don't pass nulls to Recharts, default to previous or 0 just in case
          price: prices[index] ?? (index > 0 ? prices[index-1] : 0), 
        }))
        // Filter out any remaining bad data points
        .filter((d) => d.price !== undefined && d.price !== null);
        
    }, [prices, timestamp]);
    
    // Handle error state gracefully
    if (error || !prices.length || !timestamp.length) {
      return (
        <Card className="flex flex-col items-center justify-center h-[250px] bg-muted/30 border-destructive/50">
          <Coins className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{error || `No data for ${symbol}`}</p>
        </Card>
      );
    }




    // Determine trend
    const firstPrice = chartData[0]?.price as number ?? 0;
    const lastPrice = chartData[chartData.length - 1]?.price as number ?? 0;
    const percentChange = firstPrice !== 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
    const isPositive = percentChange >= 0;

    return (
      // Using a slightly different border color to distinguish from stocks visually
      <Card className="border-yellow-100 dark:border-yellow-950/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-100 dark:bg-yellow-950/50 rounded-full">
                 <Coins className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>{symbol}</CardTitle>
                <CardDescription className="text-xs">
                  Historical Data
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">
                {/* Intl formatter handles currency formatting nicely */}
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(currentPrice)}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-2 pb-4">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
             {/* Using an AreaChart for a slightly different look than the Stock LineChart */}
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0, right: 0, top: 10, bottom: 0
              }}
            >
              <defs>
                {/* Adds a nice gradient fill below the line */}
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={30}
                tickFormatter={(value) => value}
                fontSize={10}
              />
               {/* YAxis hidden for cleaner look, tooltip shows values */}
              <YAxis domain={['auto', 'auto']} hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="line" />}
              />
              {/* 3. CRITICAL: isAnimationActive={false} */}
              <Area
                dataKey="price"
                type="monotone"
                stroke="var(--chart-3)"
                fill="url(#fillPrice)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false} 
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        
        <CardFooter className="flex-col items-start gap-1 text-sm pt-0 pb-3">
          <div className={`flex gap-1 font-medium leading-none ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? "Trending up" : "Trending down"} {Math.abs(percentChange).toFixed(2)}%
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </div>
          <div className="leading-none text-muted-foreground text-xs">
            {chartData[0]?.date} - {chartData[chartData.length-1]?.date}
          </div>
        </CardFooter>
      </Card>
    );
  },
  // 4. Custom comparison function for memo effectiveness
  (prev, next) => {
    // Only re-render if these specific props change. 
    // Ignores new array references if lengths are the same.
    return (
      prev.symbol === next.symbol &&
      prev.currentPrice === next.currentPrice &&
      prev.prices.length === next.prices.length &&
      prev.error === next.error
    );
  }
);

CryptoChart.displayName = "CryptoChart";