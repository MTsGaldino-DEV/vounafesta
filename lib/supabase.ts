import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export const coverBucket = 'event-covers';

export function coverUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${coverBucket}/${path}`;
}

export function guestClient() {
  const config = supabaseConfig();
  return config && createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

export async function organizerClient() {
  const cookieStore = await cookies();
  const config = supabaseConfig();
  if (!config) return null;
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          for (const { name, value, options } of values) cookieStore.set(name, value, options);
        } catch {
          // The proxy writes refreshed cookies before Server Components render.
        }
      },
    },
  });
}
