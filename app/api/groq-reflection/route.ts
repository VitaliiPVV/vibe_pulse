import { NextResponse } from "next/server";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { date, entries } = await req.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: "Entries are required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant that generates short daily reflections.

You receive a summary of a user's day based on journal analysis.

Your task:
- Generate ONE short daily affirmation (1-2 sentences).
- Generate ONE reflection question to help the user think deeper about their day.

Guidelines:
- Be supportive and calm
- Use simple, warm language
- Do NOT repeat the summary
- Do NOT give long advice
- No emojis
- Output ONLY valid JSON

Return JSON format:
{
  "affirmation": string,
  "reflection_question": string
}
          `,
        },
        {
          role: "user",
          content: JSON.stringify({
            date,
            entries,
          }),
        },
      ],
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) throw new Error("No response from AI");

    return NextResponse.json(JSON.parse(result));
  } catch (error: any) {
    console.error("Daily reflection error:", error);
    return NextResponse.json(
      { error: "Failed to generate daily reflection" },
      { status: 500 }
    );
  }
}
