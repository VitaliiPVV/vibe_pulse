import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/utils/supabase-server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "10";

    const { data, error } = await supabaseAdmin
      .from("journal_entries")
      .select("*")
      .eq("clerk_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch entries", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: data || [] });
  } catch (error: any) {
    console.error("Fetch entries error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

