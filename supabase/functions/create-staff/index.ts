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
  Coach = "Coach",
  SalesManager = "SalesManager",
  SessionManager = "SessionManager",
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
    // 4. Authorization check: only SuperAdmin can create staff accounts.
    if (requesterRole !== AccountType.SuperAdmin) {
      throw new Error("You do not have permission to create staff accounts");
    }
    // 5. Parse the incoming JSON data.
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      branchIds,
      role: newUserRole,
    } = await req
      .json();
    if (
      !firstName || !lastName || !email || !password || !newUserRole ||
      !branchIds || !branchIds.length
    ) {
      throw new Error(
        "Missing required fields (firstName, lastName, email, password, role, branchIds)",
      );
    }

    // 6. Validate that the new role is one of the allowed AccountType values.
    const allowedRoles = Object.values(AccountType);
    if (!allowedRoles.includes(newUserRole)) {
      throw new Error("Invalid role provided");
    }

    // 7. Create the authentication user and set their user_metadata with the role.
    const { data: authUser, error: createError } = await supabase.auth.admin
      .createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        // Set the new user's role in their user_metadata.
        user_metadata: { role: newUserRole },
      });
    if (createError || !authUser.user) {
      throw createError || new Error("Failed to create user");
    }

    // 8. Insert a record into the "Staff" table.
    // Expected accountData properties: firstName, lastName, userName, phoneNumber, dateOfBirth, nationalId, etc.
    const { error: dbError } = await supabase
      .from("Staff")
      .insert({
        id: authUser.user.id,
        email,
        role: newUserRole,
        firstName,
        lastName,
        phoneNumber,
      });
    if (dbError) {
      // Cleanup auth user if account creation fails.
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw dbError;
    }

    // Insert staff-branch relationships into StaffBranch table
    const { error: errorST } = await supabase.from("StaffBranch").insert(
      branchIds.map((branchId: number) => ({
        staffId: authUser.user.id,
        branchId: branchId,
      })),
    );

    if (errorST) {
      // Cleanup auth user if account creation fails.
      await supabase.auth.admin.deleteUser(authUser.user.id);

      // Cleanup the staff record to prevent orphaned data.
      await supabase.from("Staff").delete().eq("id", authUser.user.id);

      // Throw the actual error from StaffBranch insertion.
      throw errorST;
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
