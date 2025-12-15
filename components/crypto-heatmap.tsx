"use client";

import { memo } from "react";
import { TrendingUp, TrendingDown, LayoutGrid } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface HeatmapItem {
  symbol: string;
  price: number;
  changePercent: number;
  shortName: string;
}

interface CryptoHeatmapProps {
  coins: HeatmapItem[];
  error?: string;
}

export const CryptoHeatmap = memo(({ coins, error }: CryptoHeatmapProps) => {
  if (error || !coins || coins.length === 0) {
    return (
      <Card className="w-full border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground">
          <LayoutGrid className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">{error || "No heatmap data available."}</p>
        </CardContent>
      </Card>
    );
  }

  // Helper to determine block color based on performance
  const getBlockColor = (percent: number) => {
    // Neutral
    if (Math.abs(percent) < 0.1) return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400";
    
    // Positive Returns (Green)
    if (percent > 0) {
      if (percent > 5) return "bg-emerald-500 text-white dark:bg-emerald-600"; 
      if (percent > 2) return "bg-emerald-400 text-white dark:bg-emerald-700";
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
    }
    
    // Negative Returns (Red)
    else {
      if (percent < -5) return "bg-rose-500 text-white dark:bg-rose-600";
      if (percent < -2) return "bg-rose-400 text-white dark:bg-rose-700";
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
    }
  };

  return (
    <Card className="w-full border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
            <LayoutGrid className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-base">Market Heatmap</CardTitle>
            <CardDescription className="text-xs">
              Top {coins.length} coins by Market Cap
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Responsive Grid: 2 cols mobile, 3 cols tablet, 5 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {coins.map((coin) => {
            const isPositive = coin.changePercent >= 0;
            const colorClass = getBlockColor(coin.changePercent);

            return (
              <div
                key={coin.symbol}
                className={`${colorClass} rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all hover:brightness-110 hover:scale-[1.02] cursor-default shadow-sm min-h-[80px]`}
                title={`${coin.shortName}: $${coin.price}`}
              >
                <div className="font-bold text-sm tracking-tight">{coin.symbol}</div>
                
                <div className="text-xs opacity-90 font-medium my-0.5">
                  ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                
                <div className="flex items-center gap-0.5 mt-1 text-[10px] font-bold bg-black/5 dark:bg-black/20 px-1.5 py-0.5 rounded-full">
                   {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                   {Math.abs(coin.changePercent).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

CryptoHeatmap.displayName = "CryptoHeatmap";