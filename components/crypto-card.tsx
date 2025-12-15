"use client";

import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface CryptoPriceCardProps {
  symbol: string;
  price: number;
  currency: string;
  previousClose: number;
  logoUrl?: string;
}

export function CryptoPriceCard({ symbol, price, currency, previousClose, logoUrl }: CryptoPriceCardProps) {
  const change = price - previousClose;
  const percentChange = (change / previousClose) * 100;
  const isPositive = change >= 0;

  // The specific yellow color requested
  const themeColorClass = "text-[#ffd439]";
  const themeBorderClass = "border-[#ffd439]/50 dark:border-[#ffd439]/30";
  // Using a very light opacity version for the gradient background
  const themeBgClass = "bg-gradient-to-br from-white to-[#ffd439]/10 dark:from-gray-950 dark:to-[#ffd439]/5";

  return (
    <Card className={`w-full max-w-[250px] ${themeBorderClass} ${themeBgClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* For light mode text, the specific bright yellow [#ffd439] is hard to read on white. 
          Using a darker standard 'amber' for light mode readability, and the specific yellow for dark mode.
        */}
        <CardTitle className={`text-sm font-bold text-amber-700 dark:${themeColorClass}`}>
          {symbol}
        </CardTitle>
        {/* Simple image fallback logic */}
        {logoUrl ? (
             // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={logoUrl} 
              alt={symbol} 
              className="h-6 w-6 rounded-full" 
              onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
        ) : (
            // Use the specified yellow for the fallback icon
            <Coins className={`h-4 w-4 ${themeColorClass}`} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-xs font-normal text-muted-foreground ml-1">{currency}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {/* Keeping green/red for financial sentiment as it is standard */}
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}{percentChange.toFixed(2)}%
          </span>
          <span className="opacity-70">24h</span>
        </p>
      </CardContent>
    </Card>
  );
}