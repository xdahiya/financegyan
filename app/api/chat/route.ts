import {
  streamText,
  UIMessage,
  convertToModelMessages,
  ToolSet,
  InferUITools,
} from "ai";

import { openai } from "@ai-sdk/openai";

import { localTools } from "@/lib/tools";

const allTools = {
  ...localTools,
} satisfies ToolSet;

export type MyUITools = InferUITools<typeof allTools>;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5-mini"),
    messages: convertToModelMessages(messages),
    // stopWhen: stepCountIs(5),
    system: `You are FinanceGyan, a friendly finance AI chatbot. Provide very short, simple, and direct answers in Markdown. Be concise and get straight to the point.`,
    tools: allTools,
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    sendSources: true,
  });
}
