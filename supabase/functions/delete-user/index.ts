// supabase/functions/update-staff-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers':
    'Authorization, Content-Type, x-client-info, apikey',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'PATCH') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // parse JSON
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const { userId } = payload;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId ' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // authorize
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');
    const jwt = authHeader.replace('Bearer ', '');
    const { data: requester, error: jwtErr } = await supabase.auth.getUser(jwt);
    if (jwtErr || !requester.user) throw new Error('Unauthorized');
    if (requester.user.user_metadata?.role !== 'SuperAdmin') {
      throw new Error('Insufficient permissions');
    }

    // fetch target user from Auth
    const {
      data: { user: target },
      error: fetchErr,
    } = await supabase.auth.admin.getUserById(userId);
    if (fetchErr || !target) throw fetchErr || new Error('User not found');

    const role = (target.user_metadata?.role as string) ?? '';

    // … after you’ve fetched `target` from Auth …
    const oldEmail = target.email!;

    // 1) build a “corrupted” placeholder
    //    e.g. "1630489123456-550e8400-e29b-41d4-a716-446655440000@deleted.local"
    const corruptedEmail = `${Date.now()}-${crypto.randomUUID()}@deleted.local`;

    // 2) update in Supabase Auth
    const { data: updatedAuthUser, error: authErr } =
      await supabase.auth.admin.updateUserById(userId, {
        email: corruptedEmail,
      });

    if (authErr) {
      console.error('Auth email corruption failed:', authErr);
      return new Response(JSON.stringify({ error: authErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3) mirror in your own table (if you store email there)
    const staffRoles = new Set([
      'SuperAdmin',
      'Sales',
      'Receptionist',
      'Coach',
      'SalesManager',
      'SessionManager',
    ]);
    // const role = updatedAuthUser.user.user_metadata?.role as string;
    const tableName = staffRoles.has(role) ? 'Staff' : 'Members';

    const { error: dbErr } = await supabase
      .from(tableName)
      .update({ email: corruptedEmail, isDeleted: true })
      .eq('id', userId);

    if (dbErr) {
      console.error('DB email mirror failed:', dbErr);
      // Roll back Auth if needed
      await supabase.auth.admin.updateUserById(userId, { email: oldEmail });
      return new Response(JSON.stringify({ error: dbErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
