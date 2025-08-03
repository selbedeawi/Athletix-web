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
  const { userId, newPassword } = payload;
  if (!userId || !newPassword) {
    return new Response(
      JSON.stringify({ error: 'Missing userId or newPassword' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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

    const { error: authErr } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    if (authErr) throw authErr;

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
