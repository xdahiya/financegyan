"use client";

import { memo } from "react";
import { Globe, User, TrendingUp, BarChart3, PieChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface CompanyProfileProps {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  marketCap: number;
  beta?: number;
  volume?: number;
  sector: string;
  industry: string;
  website?: string;
  description: string;
  ceo?: string;
  logo?: string;
  exchange?: string;
  error?: string;
}

export const CompanyProfile = memo((props: CompanyProfileProps) => {
  if (props.error) {
    return (
      <Card className="w-full border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
        <CardContent className="pt-6 text-center text-red-500 text-sm">
          {props.error}
        </CardContent>
      </Card>
    );
  }

  // Helper for massive numbers (e.g., 2.5T)
  const formatCompact = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Card className="w-full max-w-lg border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Header with Logo */}
      <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border bg-white rounded-lg p-1">
              {props.logo && <AvatarImage src={props.logo} className="object-contain" />}
              <AvatarFallback className="rounded-lg font-bold bg-zinc-100 text-zinc-500">
                {props.symbol.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">{props.name}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                  {props.exchange || "US"} : {props.symbol}
                </Badge>
                {props.sector}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight">
              ${props.price?.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-medium">
              {props.currency}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 grid gap-6">
        {/* Description Area */}
        <div className="space-y-2">
           <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About</h4>
              {props.website && (
                <a href={props.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Visit Website
                </a>
              )}
           </div>
           <ScrollArea className="h-20 w-full rounded-md border border-zinc-100 dark:border-zinc-800 p-3 text-xs text-muted-foreground bg-zinc-50/50 dark:bg-zinc-900/20 leading-relaxed">
              {props.description}
           </ScrollArea>
        </div>

        {/* Fundamentals Grid */}
        <div className="grid grid-cols-2 gap-4">
           {/* Market Cap */}
           <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-muted/30">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
                 <PieChart className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-[10px] text-muted-foreground font-medium uppercase">Market Cap</p>
                 <p className="text-sm font-bold">${props.marketCap ? formatCompact(props.marketCap) : "N/A"}</p>
              </div>
           </div>

           {/* Beta (Volatility) */}
           <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-muted/30">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
                 <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-[10px] text-muted-foreground font-medium uppercase">Beta (Vol)</p>
                 <p className="text-sm font-bold">{props.beta ? props.beta.toFixed(2) : "N/A"}</p>
              </div>
           </div>

           {/* Average Volume */}
           <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-muted/30">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400">
                 <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-[10px] text-muted-foreground font-medium uppercase">Avg Volume</p>
                 <p className="text-sm font-bold">{props.volume ? formatCompact(props.volume) : "N/A"}</p>
              </div>
           </div>
           
           {/* CEO */}
           <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-muted/30">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-md text-orange-600 dark:text-orange-400">
                 <User className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-[10px] text-muted-foreground font-medium uppercase">CEO</p>
                 <p className="text-sm font-bold truncate max-w-[100px]" title={props.ceo}>{props.ceo || "N/A"}</p>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
});

CompanyProfile.displayName = "CompanyProfile";