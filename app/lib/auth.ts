import { Database } from "@app/types/database.types";
import supabase from "./supabase";
import { createClient } from "./supabase/server";
import { PostgrestError, Session } from "@supabase/supabase-js";

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getSessionAndUser(): Promise<{
  session: Session | null;
  user: Database["public"]["Tables"]["users"]["Row"] | null;
  error: PostgrestError | Error | null;
}> {
  const userDetails: {
    user: Database["public"]["Tables"]["users"]["Row"] | null;
  } = {
    user: null,
  };

  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getSession();

  if (!authError && authData?.session?.user) {
    // Fetch the user details
    const { data, error } = await supabase
      .from("users") // Table name
      .select("*") // Select all columns (or specify specific columns)
      .eq("id", authData.session.user.id); // Use 'eq' to filter by primary key value

    if (error) {
      return {
        session: null,
        user: null,
        error,
      };
    }

    if (!error && data?.[0]) {
      userDetails.user = data[0];
    }
  }

  return {
    session: authData?.session,
    user: userDetails.user,
    error: authError,
  };
}
