"use client";

import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketMoversProps {
  type: "biggest-losers" | "biggest-gainers";
  movers: Mover[];
  error?: string;
}

export const MarketMovers = memo(({ type, movers, error }: MarketMoversProps) => {
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  const isGainers = type === "biggest-gainers";
  const ColorIcon = isGainers ? TrendingUp : TrendingDown;
  const colorClass = isGainers ? "text-green-500" : "text-red-500";
  const bgClass = isGainers ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10";

  return (
    <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bgClass}`}>
            <ColorIcon className={`h-5 w-5 ${colorClass}`} />
          </div>
          <CardTitle className="text-lg capitalize">Top {type}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {movers.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{item.symbol}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">{item.name}</span>
                </div>
                <div className="text-xs font-mono mt-0.5">${item.price.toFixed(2)}</div>
              </div>
              <Badge variant="outline" className={`${colorClass} border-current bg-transparent`}>
                {item.changePercent > 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

MarketMovers.displayName = "MarketMovers";