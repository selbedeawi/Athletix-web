// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { corsHeaders } from "../_shared/cors.ts";
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

async function sendCredentialsEmail(
  email: string,
  password: string,
  firstName: string,
) {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": Deno.env.get("BREVO_API_KEY")!, // stored as Supabase secret
    },
    body: JSON.stringify({
      to: [{ email }],
      templateId: 1, // Replace with your Brevo template ID
      params: {
        name: `${firstName}`,
        password: password,
      },
      sender: {
        name: "Athletix",
        email: "athletixegy@gmail.com",
      },
    }),
  });
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
      gender,
    } = await req.json();

    if (!firstName || !lastName || !email || !password || !gender) {
      throw new Error(
        "Missing required fields (firstName, lastName, email, password, gender)",
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
      gender,
      nationalId,
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
    await sendCredentialsEmail(email, password, firstName);

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
