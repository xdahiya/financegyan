"use client";

import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface StockPriceCardProps {
  symbol: string;
  price: number;
  currency: string;
  previousClose: number;
}

export function StockPriceCard({ symbol, price, currency, previousClose }: StockPriceCardProps) {
  // Calculate simple day change
  const change = price - previousClose;
  const percentChange = (change / previousClose) * 100;
  const isPositive = change >= 0;

  return (
    <Card className="w-full max-w-[250px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {symbol}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {price.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">{currency}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}{percentChange.toFixed(2)}%
          </span>{" "}
          from yesterday
        </p>
      </CardContent>
    </Card>
  );
}