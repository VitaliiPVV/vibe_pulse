import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/utils/supabase-server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { text, analysis } = await req.json();

    if (!text || !analysis) {
      return NextResponse.json(
        { error: "Text and analysis are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.from("journal_entries").insert({
      clerk_user_id: user.id,
      entry_text: text,
      mood: analysis.mood,
      stress_level: analysis.stress_level,
      topic: analysis.topic,
      summary: analysis.summary,
      advice: analysis.advice,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save entry", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Save journal error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
