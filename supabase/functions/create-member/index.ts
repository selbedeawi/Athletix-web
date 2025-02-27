// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { corsHeaders } from "../_shared/cors.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, x-client-info, apikey",
};

// Define the allowed account types for staff creation.
export enum AccountType {
  SuperAdmin = "SuperAdmin",
  Sales = "Sales",
  Receptionist = "Receptionist",
  SalesManager = "SalesManager",
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function sendCredentialsEmail(email: string, password: string) {
  const client = new SmtpClient();
  // Connect to the SMTP server using TLS.
  await client.connectTLS({
    hostname: Deno.env.get("SMTP_HOST")!,
    port: Number(Deno.env.get("SMTP_PORT")!),

    password: Deno.env.get("SMTP_PASS")!,
  });

  // Compose and send the email.
  await client.send({
    from: Deno.env.get("SMTP_FROM")!,
    to: email,
    subject: "Your New Account Credentials",
    content: `Hello,

Your account has been created successfully.
Email: ${email}
Password: ${password}

Please keep this information safe. We strongly recommend that you change your password after logging in.

Best regards,
The Team`,
  });
  await client.close();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // 1. Get JWT from header.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const jwt = authHeader.replace("Bearer ", "");

    // 2. Verify the requesting user using their JWT.
    const { data: { user: requestingUser }, error: jwtError } = await supabase
      .auth.getUser(jwt);
    if (jwtError || !requestingUser) throw new Error("Unauthorized");

    // 3. Get the requester's role from their token's user_metadata.
    const requesterRole = requestingUser.user_metadata?.role;
    if (!requesterRole) {
      throw new Error("Requesting user's role not found in token metadata");
    }
    // 4. Authorization check: only SuperAdmin can create Member accounts.
    const allowedRoles = Object.values(AccountType);
    if (!allowedRoles.includes(requesterRole)) {
      throw new Error("You do not have permission to create Member accounts");
    }
    // 5. Parse the incoming JSON data.
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      nationalId,
      userName,
    } = await req.json();

    if (!firstName || !lastName || !email || !password || !userName) {
      throw new Error(
        "Missing required fields (firstName, lastName, email, password, userName)",
      );
    }

    // 2. Create the authentication user and set their role to 'Member'.
    const { data: authUser, error: createError } = await supabase.auth.admin
      .createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "Member" },
      });
    if (createError || !authUser.user) {
      throw createError || new Error("Failed to create user");
    }

    // 3. Insert a record into the "Members" table.
    const { error: dbError } = await supabase.from("Members").insert({
      id: authUser.user.id,
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      nationalId,
      userName,
      createdBy: requestingUser.id,
      isActive: true,
      isFirstTime: true,
      role: "Member",
    });
    if (dbError) {
      // Cleanup auth user if member creation fails.
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw dbError;
    }

    // 9. Send an email with the credentials to the new user.
    // await sendCredentialsEmail(email, password);

    // 10. Return a successful response.
    return new Response(
      JSON.stringify({ success: true, user_id: authUser.user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
