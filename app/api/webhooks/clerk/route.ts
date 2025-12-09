import { headers } from "next/headers";
import { Webhook } from "svix";
import { supabaseAdmin } from "@/utils/supabase-server";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  throw new Error("CLERK_WEBHOOK_SECRET env var is not set");
}

export async function POST(req: Request) {
  const headerStore = await headers();

  const svixId = headerStore.get("svix-id");
  const svixTimestamp = headerStore.get("svix-timestamp");
  const svixSignature = headerStore.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix signature headers", { status: 400 });
  }

  const payload = await req.text();

  const wh = new Webhook(CLERK_WEBHOOK_SECRET || '');

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Error verifying Clerk webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type as string;
  const data = evt.data;

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const userId: string = data.id;

        // Prefer primary email if set
        let email: string | null = null;
        if (Array.isArray(data.email_addresses) && data.email_addresses.length) {
          const primaryId = data.primary_email_address_id;
          const primary =
            data.email_addresses.find((e: any) => e.id === primaryId) ??
            data.email_addresses[0];
          email = primary.email_address ?? null;
        }

        const fullName =
          [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

        const { error } = await supabaseAdmin.from("Profiles").upsert(
          {
            id: userId,
            email,
            full_name: fullName,
          },
          { onConflict: "id" }
        );

        if (error) {
          console.error("Supabase upsert error (webhook):", error);
          return new Response(
            JSON.stringify({
              message: "Supabase error",
              supabaseError: {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
              },
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        break;
      }
      case "user.deleted": {
        const userId: string = data.id;
        const { error } = await supabaseAdmin
          .from("profiles")
          .delete()
          .eq("id", userId);
        if (error) {
          console.error("Supabase delete error (webhook):", error);
          return new Response(
            JSON.stringify({
              message: "Supabase error",
              supabaseError: {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
              },
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        break;
      }
      default: {
        // Ignore other events
        break;
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Unexpected webhook handler error:", err);
    return new Response("Internal error", { status: 500 });
  }
}


