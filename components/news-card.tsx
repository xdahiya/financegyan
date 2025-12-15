"use client";

import { memo } from "react";
import { Newspaper, ExternalLink, CalendarClock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  publishTime: string;
  thumbnail?: string;
}

interface NewsCardProps {
  query: string;
  news: NewsItem[];
  error?: string;
}

// 1. Wrap in memo for render safety during streaming
export const NewsCard = memo(({ query, news, error }: NewsCardProps) => {
  if (error || !news || news.length === 0) {
    return (
      <Card className="w-full border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground">
          <Newspaper className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No recent news found for {query}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden border-zinc-200 dark:border-zinc-800">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Latest News: {query}</CardTitle>
        </div>
        <CardDescription>Top headlines from financial sources</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {news.map((item) => (
            <a
              key={item.uuid}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-4 hover:bg-muted/50 transition-colors group"
            >
              {/* Thumbnail or Fallback */}
              <div className="shrink-0">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt={item.publisher}
                    className="h-16 w-16 object-cover rounded-md border border-border"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.publisher}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <CalendarClock className="h-3 w-3" />
                    <span>{item.publishTime}</span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}, (prev, next) => {
    // Memo comparison to prevent re-renders unless data changes
    return prev.query === next.query && prev.news.length === next.news.length;
});

NewsCard.displayName = "NewsCard";