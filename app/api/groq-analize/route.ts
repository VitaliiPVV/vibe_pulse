import { NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an empathetic AI that analyzes journal entries. Always respond with valid JSON only, no markdown or extra text.",
        },
        {
          role: "user",
          content: `Analyze this journal entry and return a JSON object with these fields:
- mood: string (overall mood)
- stress_level: number (0-10)
- topic: string (main theme)
- summary: string (brief summary)
- advice: string (personalized encouragement)

Entry: "${text}"`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq");
    }

    const analysis = JSON.parse(result);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Groq analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze entry", details: error.message },
      { status: 500 }
    );
  }
}
