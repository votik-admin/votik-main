import { Database } from "@app/types/database.types";
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false, // Disable session persistence
        autoRefreshToken: false, // Disable automatic token refresh
        detectSessionInUrl: false, // Ignore URL session
      },
    }
  );
}
