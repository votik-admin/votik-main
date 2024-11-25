import { Database, Tables } from "@app/types/database.types";
import supabase from "./supabase";
import { PostgrestError, Session } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getSessionAndUser(): Promise<{
  session: Session | null;
  user: Tables<"users"> | null;
  error: PostgrestError | Error | null;
}> {
  const userDetails: {
    user: Tables<"users"> | null;
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

export async function getSessionAndOrganizer(): Promise<{
  session: Session | null;
  organizer: Tables<"organizers"> | null;
  error: PostgrestError | Error | null;
}> {
  const organizerDetails: {
    organizer: Tables<"organizers"> | null;
  } = {
    organizer: null,
  };

  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getSession();

  if (!authError && authData?.session?.user) {
    // Fetch the user details
    const { data, error } = await supabase
      .from("organizers") // Table name
      .select("*") // Select all columns (or specify specific columns)
      .eq("id", authData.session.user.id); // Use 'eq' to filter by primary key value

    if (error) {
      return {
        session: null,
        organizer: null,
        error,
      };
    }

    if (!error && data?.[0]) {
      organizerDetails.organizer = data[0];
    }
  }

  return {
    session: authData?.session,
    organizer: organizerDetails.organizer,
    error: authError,
  };
}
