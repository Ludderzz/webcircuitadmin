import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if env variables are missing to avoid cryptic errors
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}