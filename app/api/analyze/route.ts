import { NextResponse } from "next/server";
import { streamObject, jsonSchema } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: jsonSchema({
        type: "object",
        properties: {
          mood: { type: "string", description: "The overall mood detected in the entry" },
          stress_level: { type: "number", description: "Stress level from 0-10" },
          topic: { type: "string", description: "Main topic or theme of the entry" },
          summary: { type: "string", description: "Brief summary of the entry" },
          advice: { type: "string", description: "Personalized advice or encouragement" },
        },
        required: ["mood", "stress_level", "topic", "summary", "advice"],
      }),
      prompt: `
        Analyze this journal entry and return an object describing the user's emotional state.
        Be empathetic, supportive, and constructive in your analysis.
        
        Entry: "${text}"
      `,
    });

    const chunks = [];
    for await (const part of partialObjectStream) {
      chunks.push(part);
    }

    const finalResult = chunks[chunks.length - 1];
    return NextResponse.json(finalResult);
  } catch (error: any) {
    console.error("OpenAI analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze entry", details: error.message },
      { status: 500 }
    );
  }
}

