"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

import { useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import Image from "next/image";
import Link from "next/link";

import {
  CopyIcon,
  GlobeIcon,
  RefreshCcwIcon,
  StopCircleIcon,
  TrendingUp,
  LayoutGrid,
  Building2,
  Newspaper,
} from "lucide-react";

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { UIDataTypes } from "ai";
import { StockChart, StockChartProps } from "@/components/stock-chart";
import {
  StockPriceCard,
  StockPriceCardProps,
} from "@/components/stock-price-card";
import { Button } from "@/components/ui/button";
import {
  CryptoPriceCard,
  CryptoPriceCardProps,
} from "@/components/crypto-card";
import { CryptoChart, CryptoChartProps } from "@/components/crypto-chart";
import { NewsCard } from "@/components/news-card";
import {
  SentimentMeter,
  SentimentMeterProps,
} from "@/components/sentiment-meter";
import { CryptoHeatmap } from "@/components/crypto-heatmap";
import { CurrencyCard } from "@/components/currency-card";
import {
  CompanyProfile,
  CompanyProfileProps,
} from "@/components/company-profile";
import { MarketMovers } from "@/components/market-movers";
import { MyUITools } from "./api/chat/route";

const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];

const SUGGESTED_ACTIONS = [
  {
    title: "Market Heatmap",
    label: "Show current crypto market heatmap",
    action: "Show me the crypto market heatmap",
    icon: <LayoutGrid className="size-5 text-[#ffd439]" />,
  },
  {
    title: "Stock Analysis",
    label: "Check fundamentals for Apple",
    action: "Get company profile and fundamentals for AAPL",
    icon: <Building2 className="size-5 text-[#ffd439]" />,
  },
  {
    title: "Crypto Sentiment",
    label: "Fear & Greed Index",
    action: "What is the current crypto market sentiment?",
    icon: <TrendingUp className="size-5 text-[#ffd439]" />,
  },
  {
    title: "Latest News",
    label: "Recent finance news for Tesla",
    action: "Show me the latest news for Tesla",
    icon: <Newspaper className="size-5 text-[#ffd439]" />,
  },
];

type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);

  const { messages, sendMessage, status, regenerate, error, stop } =
    useChat<MyUIMessage>();

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) {
      return;
    }
    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
        },
      }
    );
    setInput("");
  };

  const handleSuggestionClick = (actionText: string) => {
    sendMessage(
      { text: actionText },
      {
        body: { model: model, webSearch: webSearch },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-dvh">
      <div className="flex flex-col h-full pt-10">
        {/* --- LOGIC: If no messages, show Empty State (Logo + Grid), else show Conversation --- */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Logo Section */}
            <Link
              className="flex items-center gap-3 font-bold text-4xl hover:opacity-90 transition-opacity"
              href="/"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center shadow-sm">
                <Image
                  src="/logo.png" // Ensure this file exists in /public
                  alt="FinanceGyan Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="tracking-tight">
                Finance<span className="text-[#ffd439]">Gyan</span>
              </span>
            </Link>

            <p className="hidden md:block text-muted-foreground text-center max-w-md">
              Your AI-powered financial assistant. Ask about stocks, crypto,
              market trends, or fundamental analysis.
            </p>

            {/* Suggested Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
              {SUGGESTED_ACTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.action)}
                  className="flex items-center gap-3 p-4 text-left border rounded-xl bg-muted/50 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="p-2 bg-background rounded-lg shadow-sm border">
                    {suggestion.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {suggestion.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {suggestion.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* conversations area */
          <Conversation className="h-full">
            <ConversationContent>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === "assistant" &&
                    message.parts.filter((part) => part.type === "source-url")
                      .length > 0 && (
                      <Sources>
                        <SourcesTrigger
                          count={
                            message.parts.filter(
                              (part) => part.type === "source-url"
                            ).length
                          }
                        />
                        {message.parts
                          .filter((part) => part.type === "source-url")
                          .map((part, i) => (
                            <SourcesContent key={`${message.id}-${i}`}>
                              <Source
                                key={`${message.id}-${i}`}
                                href={part.url}
                                title={part.url}
                              />
                            </SourcesContent>
                          ))}
                      </Sources>
                    )}

                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message
                            key={`${message.id}-${i}`}
                            from={message.role}
                          >
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                            {message.role === "assistant" &&
                              i === messages.length - 1 && (
                                <MessageActions>
                                  <MessageAction
                                    onClick={() => regenerate()}
                                    label="Retry"
                                  >
                                    <RefreshCcwIcon className="size-3" />
                                  </MessageAction>
                                  <MessageAction
                                    onClick={() =>
                                      navigator.clipboard.writeText(part.text)
                                    }
                                    label="Copy"
                                  >
                                    <CopyIcon className="size-3" />
                                  </MessageAction>
                                </MessageActions>
                              )}
                          </Message>
                        );

                      // ... [Keep existing Reasoning case] ...
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );

                      case "tool-displayStockChart":
                        if (part.state === "input-available")
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`}>
                              Loading Chart...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div key={`${part.toolCallId}-${i}-output`}>
                              <StockChart
                                {...(part.output as StockChartProps)}
                              />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div key={`${part.toolCallId}-${i}-error`}>
                              Error In Stocks: {part.errorText}
                            </div>
                          );
                        return null;

                      case "tool-displayStockPrice":
                        if (part.state === "input-available")
                          return (
                            <div key={`${part.toolCallId}-${i}-loading`}>
                              Loading Price...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div key={`${part.toolCallId}-${i}-output`}>
                              <StockPriceCard
                                {...(part.output as StockPriceCardProps)}
                              />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div key={`${part.toolCallId}-${i}-error`}>
                              Error In Stocks: {part.errorText}
                            </div>
                          );
                        return null;

                      case "tool-displayCryptoPrice":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="opacity-50 text-sm"
                            >
                              Checking crypto markets...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="mt-2 mb-4"
                            >
                              <CryptoPriceCard
                                {...(part.output as CryptoPriceCardProps)}
                              />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="text-red-500 text-sm"
                            >
                              Failed to load crypto data.
                            </div>
                          );
                        return null;

                      case "tool-displayCryptoChart":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="flex items-center gap-2 text-sm text-muted-foreground my-4 p-4 border rounded-lg border-dashed animate-pulse"
                            >
                              Loading crypto chart data...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-4 max-w-lg"
                            >
                              <CryptoChart
                                {...(part.output as CryptoChartProps)}
                              />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div key={`${part.toolCallId}-${i}-error`}>
                              Error loading chart
                            </div>
                          );
                        return null;

                      case "tool-displayNews":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="flex items-center gap-2 text-sm text-muted-foreground my-2"
                            >
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              Finding latest headlines...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-4 max-w-lg"
                            >
                              <NewsCard {...part.output} />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="text-sm text-red-500"
                            >
                              Error loading news.
                            </div>
                          );
                        return null;

                      case "tool-displayCryptoSentiment":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="flex items-center gap-2 text-sm text-muted-foreground my-4 p-4"
                            >
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                              Analyzing market sentiment...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-4"
                            >
                              <SentimentMeter
                                {...(part.output as SentimentMeterProps)}
                              />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="text-red-500 text-sm"
                            >
                              Error loading sentiment.
                            </div>
                          );
                        return null;

                      case "tool-displayCryptoHeatmap":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="flex items-center gap-2 text-sm text-muted-foreground my-4 p-4 border border-dashed rounded-lg"
                            >
                              <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full" />
                              Scanning crypto market data...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-4 w-full max-w-2xl"
                            >
                              <CryptoHeatmap {...part.output} />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="text-sm text-red-500 p-2"
                            >
                              Error: {"Failed to load heatmap"}
                            </div>
                          );
                        return null;

                      case "tool-displayCurrencyConverted":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="flex items-center gap-2 text-sm text-muted-foreground my-4 p-4 border border-dashed rounded-lg"
                            >
                              <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full" />
                              Converting the Currency
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-4 w-full max-w-2xl"
                            >
                              <CurrencyCard {...part.output} />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="text-sm text-red-500 p-2"
                            >
                              Error: {"Failed to Convert Currency"}
                            </div>
                          );
                        return null;

                      case "tool-displayCompanyProfile":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-profile`}
                              className="flex items-center gap-3 text-sm text-muted-foreground my-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm"
                            >
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
                              <div>
                                <span className="block text-foreground font-medium">
                                  Gathering Intelligence
                                </span>
                                <span className="text-xs opacity-70">
                                  Analyzing fundamental data...
                                </span>
                              </div>
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-6 w-full flex justify-start"
                            >
                              <CompanyProfile
                                {...(part.output as CompanyProfileProps)}
                              />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100"
                            >
                              ⚠️ Unable to retrieve company profile.
                            </div>
                          );
                        return null;

                      case "tool-displayMarketMovers":
                        if (part.state === "input-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-input`}
                              className="text-sm text-muted-foreground my-4"
                            >
                              Scanning market data...
                            </div>
                          );
                        if (part.state === "output-available")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-output`}
                              className="my-4"
                            >
                              <MarketMovers {...part.output} />
                            </div>
                          );
                        if (part.state === "output-error")
                          return (
                            <div
                              key={`${part.toolCallId}-${i}-error`}
                              className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100"
                            >
                              ⚠️ Error
                            </div>
                          );
                        return null;

                      default:
                        return null;
                    }
                  })}
                </div>
              ))}

              {status === "submitted" && (
                <Message from="assistant">
                  <MessageContent>
                    <Loader />
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        )}
        {/* end-conversations area */}

        {/* prompt input */}
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          globalDrop
          multiple
        >
          {/* ... [Input components remain unchanged] ... */}
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>

          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>

              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((model) => (
                    <PromptInputSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>

            <div className="flex items-center gap-2">
              {(status === "submitted" || status === "streaming") && (
                <Button size="icon-sm" variant="ghost" onClick={() => stop()}>
                  <StopCircleIcon />
                </Button>
              )}

              {error && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => regenerate()}
                >
                  Retry
                </Button>
              )}

              <PromptInputSubmit
                className="bg-amber-300 h-8 mx-4"
                disabled={!input && !status}
                status={status}
              />
            </div>
          </PromptInputFooter>
        </PromptInput>
        {/* end-prompt input */}
      </div>
    </div>
  );
};
export default ChatBotDemo;
