// supabase/functions/update-staff-account/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses
export const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-client-info, apikey"
};

// Brevo helper (templateId=2)
async function sendCredentialsEmail(
  email: string,
  password: string,
  firstName: string,
  role: string
) {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": Deno.env.get("BREVO_API_KEY")!
    },
    body: JSON.stringify({
      to:    [{ email }],
      templateId: 2,
      params: { name: firstName, role, password },
      sender: { name: "Athletix", email: "athletixegy@gmail.com" }
    })
  });
}

// 8-char password generator (initials or random uppercase + digits)
function generateRandomPassword(
  firstName: string,
  lastName: string,
  length = 6
): string {
  length = Math.max(8, Math.min(36, length));
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits  = "0123456789";
  const randLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));

  const firstInitial = firstName?.trim()
    ? firstName.trim()[0].toUpperCase()
    : randLetter();
  const lastInitial = lastName?.trim()
    ? lastName.trim()[0].toUpperCase()
    : randLetter();

  const prefix = firstInitial + lastInitial;
  let rest = "";
  for (let i = prefix.length; i < length; i++) {
    rest += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return (prefix + rest).split("").sort(() => 0.5 - Math.random()).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "PATCH") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // parse JSON
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  const { userId, newEmail } = payload;
  if (!userId || !newEmail) {
    return new Response(JSON.stringify({ error: "Missing userId or newEmail" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // authorize
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const jwt = authHeader.replace("Bearer ", "");
    const { data: requester, error: jwtErr } = await supabase.auth.getUser(jwt);
    if (jwtErr || !requester.user) throw new Error("Unauthorized");
    if (requester.user.user_metadata?.role !== "SuperAdmin") {
      throw new Error("Insufficient permissions");
    }

    // fetch target user from Auth
    const {
      data: { user: target },
      error: fetchErr
    } = await supabase.auth.admin.getUserById(userId);
    if (fetchErr || !target) throw fetchErr || new Error("User not found");

    const oldEmail     = (target.email ?? "").trim().toLowerCase();
    const firstName    = (target.user_metadata?.firstName as string) ?? "";
    const lastName     = (target.user_metadata?.lastName as string)  ?? "";
    const role         = (target.user_metadata?.role  as string)    ?? "";

    const newNormalized = newEmail.trim().toLowerCase();
    if (newNormalized !== oldEmail) {
      // 1) generate & apply new password + update Auth email
      const newPassword = generateRandomPassword(firstName, lastName, 8);
      const { error: authErr } = await supabase.auth.admin.updateUserById(
        userId,
        { email: newEmail, password: newPassword, email_confirm: false }
      );
      if (authErr) throw authErr;

      // 2) update proper table based on role
      const staffRoles = new Set([
        "SuperAdmin","Sales","Receptionist","Coach","SalesManager","SessionManager"
      ]);
      const tableName = staffRoles.has(role) ? "Staff" : "Members";
      const { error: dbErr } = await supabase
        .from(tableName)
        .update({ email: newEmail })
        .eq("id", userId);
      if (dbErr) {
        // rollback Auth change if you like
        await supabase.auth.admin.updateUserById(userId, { email: oldEmail });
        throw dbErr;
      }

      // 3) send email with new credentials
      await sendCredentialsEmail(newEmail, newPassword, firstName, role);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
