// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// serve(async (req) => {
//   const payload = await req.json();

//   if (payload.type !== "user.created" && payload.type !== "user.updated") {
//     return new Response("Ignored", { status: 200 });
//   }

//   const user = payload.data;

//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );

//   const email = user?.email_addresses?.[0]?.email_address ?? null;
//   const fullName = [user.first_name, user.last_name]
//     .filter(Boolean)
//     .join(" ") || null;

//   const { error } = await supabase.from("Profiles").upsert(
//     {
//       id: user.id,
//       email,
//       full_name: fullName,
//     },
//     { onConflict: "id" }
//   );

//   if (error) {
//     console.error(error);
//     return new Response(JSON.stringify(error), { status: 500 });
//   }

//   return new Response("OK", { status: 200 });
// });
