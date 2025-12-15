"use client";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CurrencyCard = ({ from, to, amount, convertedAmount, date }: any) => (
  <Card className="w-full max-w-sm">
    <CardContent className="flex flex-col items-center p-6 gap-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase">
        <span className="font-bold">{from}</span>
        <ArrowRightLeft className="h-4 w-4" />
        <span className="font-bold">{to}</span>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">
          {convertedAmount?.toFixed(2)} <span className="text-lg text-muted-foreground">{to}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          = {amount} {from}
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground">Rate date: {date}</div>
    </CardContent>
  </Card>
);