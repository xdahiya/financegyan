"use client";

import { memo } from "react";
import { Gauge, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SentimentMeterProps {
  value: number; // 0 to 100
  classification: string;
  timestamp: number;
  error?: string;
}

export const SentimentMeter = memo(({ value, classification, error }: SentimentMeterProps) => {
  if (error) {
    return (
      <Card className="w-full max-w-sm border-destructive/50">
        <CardContent className="pt-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  // Determine color based on value
  const getColor = (val: number) => {
    if (val <= 25) return "text-red-500 stroke-red-500";       // Extreme Fear
    if (val <= 45) return "text-orange-500 stroke-orange-500"; // Fear
    if (val <= 55) return "text-yellow-500 stroke-yellow-500"; // Neutral
    if (val <= 75) return "text-lime-500 stroke-lime-500";     // Greed
    return "text-green-500 stroke-green-500";                  // Extreme Greed
  };

  const colorClass = getColor(value);

  // SVG Calculations for the Gauge Arc
  // We want a semi-circle (180 degrees).
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We only show half the circle, so max offset is half circumference
  const strokeDashoffset = circumference - (value / 100) * (circumference / 2);
  
  // Needle rotation: 0 value = -90deg, 100 value = 90deg
  const rotation = (value / 100) * 180 - 90;

  return (
    <Card className="w-full max-w-[300px] border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Market Sentiment</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground/50 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] text-xs">
                Based on volatility, market volume, social media, and dominance.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Crypto Fear & Greed Index</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center pt-4 pb-6">
        <div className="relative flex items-center justify-center">
          {/* SVG Gauge */}
          <svg
            height={radius}
            width={radius * 2}
            className="overflow-visible"
          >
             {/* Background Track (Grey) */}
            <path
              d={`M ${stroke} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke} ${radius}`}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              className="text-muted/20"
            />
            {/* Colored Value Track */}
            <path
              d={`M ${stroke} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke} ${radius}`}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
              style={{ 
                  strokeDasharray: `${circumference} ${circumference}`, 
                  strokeDashoffset 
              }}
            />
          </svg>

          {/* Needle */}
          <div 
            className="absolute bottom-0 w-1 h-[70px] bg-zinc-800 dark:bg-zinc-100 origin-bottom rounded-full transition-transform duration-1000 ease-out z-10"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
             {/* Pivot point */}
             <div className="absolute -bottom-2 -left-1.5 w-4 h-4 bg-zinc-800 dark:bg-zinc-100 rounded-full border-2 border-background" />
          </div>
        </div>

        {/* Text readout */}
        <div className="mt-4 text-center">
          <div className={`text-4xl font-bold ${colorClass}`}>{value}</div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {classification}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 py-2 px-4">
        <p className="text-[10px] text-muted-foreground w-full text-center">
          Updates daily • Source: alternative.me
        </p>
      </CardFooter>
    </Card>
  );
});

SentimentMeter.displayName = "SentimentMeter";