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
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are an AI that processes user text.

Step 1:
Decide if the text is a personal journal / diary entry
(reflection about feelings, thoughts, personal experiences).

Step 2:
If it is NOT a journal entry:
Return JSON:
{
  "status": "rejected",
  "reason": "short explanation why this is not a journal entry"
}

Step 3:
If it IS a journal entry:
Analyze it and return JSON:
{
  "status": "ok",
  "mood": string (overall mood)
  "stress_level": number (0-10)
  "topic": string (main theme)
  "summary": string (brief summary)
  "advice": string (personalized encouragement)
}

Rules:
- Respond ONLY with valid JSON
- No markdown
- No extra text
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from Groq");
    }

    const parsed = JSON.parse(result);

    if (parsed.status === "rejected") {
      return NextResponse.json(parsed, { status: 200 });
    }

    if (parsed.status === "ok") {
      return NextResponse.json(parsed, { status: 200 });
    }

    throw new Error("Invalid AI response format");
  } catch (error: any) {
    console.error("Groq analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze entry", details: error.message },
      { status: 500 }
    );
  }
}
