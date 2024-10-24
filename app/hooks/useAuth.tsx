"use client";

import supabase from "@app/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function getUser() {
    const { data, error } = await supabase.auth.getSession();
    setSession(data.session);
    setLoading(false);
  }

  useEffect(() => {
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
