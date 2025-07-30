// supabase/functions/update-staff-account/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses
export const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-client-info, apikey"
};

// Brevo email helper (uses templateId=2, same as in create flow)
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

// Same password generator as in your create flow
function generateRandomPassword(
  firstName: string,
  lastName: string,
  length = 6
): string {
  // Ensure length is within bounds.
  length = Math.max(8, Math.min(36, length));

  const digits = "0123456789";
  let password = "";

  // Guarantee at least one upper & one lower:
  password += firstName.trim()[0].toUpperCase();
  password += lastName.trim()[0].toLowerCase();

  // Fill remaining characters with digits
  for (let i = 2; i < length; i++) {
    password += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  // Shuffle so the fixed letters aren't always first
  return password.split("").sort(() => 0.5 - Math.random()).join("");
}

serve(async (req) => {
  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2) Only PATCH allowed
  if (req.method !== "PATCH") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  // 3) Init Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 4) Safe JSON parse
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON payload" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  // 5) Destructure & validate required fields (no role)
  const {
    userId,
    newEmail,
    firstName,
    lastName,
    isActive,
    phoneNumber,
    branchIds
  } = payload;

  if (
    !userId ||
    !newEmail ||
    !firstName ||
    !lastName ||
    typeof isActive !== "boolean" ||
    !Array.isArray(branchIds)
  ) {
    return new Response(
      JSON.stringify({ error: "Missing required fields in payload" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    // 6) Authenticate & authorize
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: jwtErr } = await supabase.auth.getUser(jwt);
    if (jwtErr || !userData.user) throw new Error("Unauthorized");
    if (userData.user.user_metadata?.role !== "SuperAdmin") {
      throw new Error("Insufficient permissions");
    }

    // 7) Fetch the user’s current auth record
    const {
    data: { user: staffUser },
    error: fetchErr
    } = await supabase.auth.admin.getUserById(userId);
    if (fetchErr || !staffUser) throw fetchErr || new Error("User not found");

    const oldEmail      = (staffUser.email    ?? "").trim().toLowerCase();
    const existingRole  = (staffUser.user_metadata?.role ?? "");

    // 8) If email changed → reset password & send new creds
    const newNormalized = newEmail.trim().toLowerCase();

    if (newNormalized !== oldEmail) {
    const newPassword = generateRandomPassword(firstName, lastName, 6);

      // 8a) Update Auth record (email + password)
      const { error: authErr } = await supabase.auth.admin.updateUserById(
        userId,
        { email: newEmail, password: newPassword, email_confirm: false }
      );
      if (authErr) throw authErr;

      // 8b) Update your Staff table’s email
      const { error: dbErr } = await supabase
        .from("Staff")
        .update({ email: newEmail })
        .eq("id", userId);
      if (dbErr) {
        // optional rollback
        await supabase.auth.admin.updateUserById(userId, { email: oldEmail });
        throw dbErr;
      }

      // 8c) Send credentials email using existingRole
      await sendCredentialsEmail(newEmail, newPassword, firstName, existingRole);
    }

    // 9) Update branches & other info via your RPC
    const { error: rpcErr } = await supabase.rpc(
      "update_staff_with_branches",
      {
        staff_id:       userId,
        first_name:     firstName,
        last_name:      lastName,
        is_active:      isActive,
        phone_number:   phoneNumber ?? "",
        new_branch_ids: branchIds,
      }
    );
    if (rpcErr) throw rpcErr;

    // 10) Success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });

  } catch (err: any) {
    // 11) Error
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
